"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const database_service_1 = require("../database/database.service");
const transaction_schema_1 = require("../database/schema/transaction.schema");
const admin_AuthGuard_1 = require("../Guards/admin.AuthGuard");
const jwt = __importStar(require("jsonwebtoken"));
const cart_service_1 = require("../cart/cart.service");
let PaymentController = class PaymentController {
    paymentService;
    databaseService;
    cartService;
    constructor(paymentService, databaseService, cartService) {
        this.paymentService = paymentService;
        this.databaseService = databaseService;
        this.cartService = cartService;
    }
    async createOrder(body, request) {
        const authHeader = request.headers.authorization;
        let userId;
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.slice(7).trim();
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            userId = payload.id ?? payload._id ?? payload.sub;
        }
        return this.paymentService.processOrder({
            ...body,
            userId,
            guestId: userId ? undefined : body.guestId,
        });
    }
    async createCodOrder(body, request) {
        const authHeader = request.headers.authorization;
        let userId;
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.slice(7).trim();
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            userId = payload.id ?? payload._id ?? payload.sub;
        }
        return this.paymentService.processCodOrder({
            ...body,
            userId,
            guestId: userId ? undefined : body.guestId,
        });
    }
    verifyPayment(body) {
        const isValid = this.paymentService.verifyPaymentSignature(body);
        if (!isValid) {
            return {
                success: false,
                message: "Invalid payment signature.",
            };
        }
        return {
            success: true,
            message: "Payment signature verified.",
        };
    }
    async initRazorpay(req, res) {
        const transactionId = req.query.transaction_id;
        if (!transactionId || !/^[a-f\d]{24}$/i.test(transactionId)) {
            throw new common_1.BadRequestException('Invalid transaction ID');
        }
        const transaction = await this.databaseService.transactionModel.findById(transactionId);
        if (!transaction) {
            throw new common_1.BadRequestException('Transaction not found');
        }
        if (!transaction.gatewayOrderId) {
            throw new common_1.BadRequestException('Failed to create an order at gateway');
        }
        if (transaction.status !== 'PENDING') {
            throw new common_1.BadRequestException('Transaction is not pending');
        }
        const order = await this.databaseService.orderModel
            .findById(transaction.orderId)
            .populate('shippingAddress')
            .exec();
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        const options = {
            key: process.env.RZP_API_KEY,
            order_id: transaction.gatewayOrderId,
            amount: transaction.amount,
            currency: transaction.currency || 'INR',
            name: `${order.customer.firstName} ${order.customer.lastName}`,
            description: `Order ${order.orderNumber || order._id}`,
            callback_url: `${process.env.BACKEND_URL}/payments/callback?transaction_id=${transactionId}`,
            redirect: true,
            prefill: {
                name: `${order.customer.firstName} ${order.customer.lastName}`,
                email: order.customer.email || '',
                contact: order.customer.phone || '',
            },
        };
        if (!options.key || !process.env.BACKEND_URL) {
            throw new Error('Razorpay environment variables are missing');
        }
        const checkoutOptions = JSON.stringify(options).replace(/</g, '\\u003c');
        const frontendUrl = process.env.URL;
        if (!frontendUrl) {
            throw new Error('Frontend URL is missing');
        }
        const dismissUrl = `${frontendUrl}/razorpay-nonseamless/callback` +
            `?collect_id=${encodeURIComponent(transaction.gatewayOrderId)}`;
        return res.type('html').send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Razorpay Payment</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <p>Opening secure payment checkout...</p>
        <script>
          window.onload = function () {
            const options = ${checkoutOptions};

            options.modal = {
              ondismiss: function () {
                window.location.href = ${JSON.stringify(dismissUrl)};
              }
            };

            const rzp = new Razorpay(options);
            rzp.open();
          };
        </script>
      </body>
    </html>
  `);
    }
    async callback(req, res) {
        const { transaction_id } = req.query;
        if (!transaction_id) {
            throw new common_1.BadRequestException("Invalid transaction ID");
        }
        const transaction = await this.databaseService.transactionModel.findById(transaction_id);
        if (!transaction || !transaction.gatewayOrderId) {
            throw new common_1.BadRequestException("Transaction not found");
        }
        const response = await this.paymentService.checkPaymentStatus(transaction.gatewayOrderId.toString());
        console.log(response);
        return res.send({
            response
        });
    }
    async callbackPost(req, res, body) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, } = body;
        const { transaction_id } = req.query;
        const frontendUrl = process.env.URL;
        if (!transaction_id) {
            throw new common_1.BadRequestException('Invalid transaction ID');
        }
        try {
            const transaction = await this.databaseService.transactionModel.findById(transaction_id);
            if (!transaction) {
                throw new common_1.BadRequestException('Transaction not found');
            }
            if (transaction.gatewayOrderId !== razorpay_order_id) {
                throw new common_1.BadRequestException('Razorpay order ID mismatch');
            }
            const response = await this.paymentService.checkPaymentStatus(razorpay_order_id);
            if (response.status === 'paid') {
                if (transaction.status !== transaction_schema_1.TransactionStatus.SUCCESS) {
                    transaction.status = transaction_schema_1.TransactionStatus.SUCCESS;
                    transaction.gatewayPaymentId = razorpay_payment_id;
                    transaction.gatewaySignature = razorpay_signature;
                    transaction.paidAt = new Date(response.created_at);
                    await transaction.save();
                    await this.databaseService.orderModel.findByIdAndUpdate(transaction.orderId, {
                        paymentStatus: 'PAID',
                        paymentId: razorpay_payment_id,
                    });
                }
                try {
                    await this.cartService.clearCart(transaction.userId?.toString());
                }
                catch (e) {
                    console.log("keeping cart for guest");
                }
                return res.redirect(`${frontendUrl}/payment-success/${transaction.orderId}`);
            }
            return res.redirect(`${frontendUrl}/payment-pending`);
        }
        catch (error) {
            console.error('Razorpay callback error:', error);
            return res.redirect(`${frontendUrl}/payment-pending`);
        }
    }
    async webhook(req, body) {
        console.log('Razorpay webhook received:', body);
        await this.databaseService.webhookLogModel.create({
            log: JSON.stringify(body),
        });
        if (body.event !== 'payment.captured') {
            return { received: true };
        }
        const payment = body.payload?.payment?.entity;
        if (!payment) {
            return { received: true, message: 'Payment payload missing' };
        }
        const orderId = payment.notes?.orderId;
        const paymentId = payment.id;
        if (!orderId || !paymentId) {
            return { received: true, message: 'Order ID or payment ID missing' };
        }
        const transaction = await this.databaseService.transactionModel.findOne({
            gatewayOrderId: payment.order_id,
        });
        if (!transaction) {
            console.error('Transaction not found for gateway order:', payment.order_id);
            return { received: true, message: 'Transaction not found' };
        }
        if (transaction.status !== transaction_schema_1.TransactionStatus.SUCCESS) {
            transaction.status = transaction_schema_1.TransactionStatus.SUCCESS;
            transaction.gatewayPaymentId = paymentId;
            transaction.paidAt = new Date(payment.created_at * 1000);
            await transaction.save();
            await this.databaseService.orderModel.findByIdAndUpdate(transaction.orderId, {
                paymentStatus: 'PAID',
                paymentId,
            });
            try {
                await this.cartService.clearCart(transaction.userId?.toString());
            }
            catch (error) {
                console.log('Could not clear cart:', error);
            }
        }
        return { received: true };
    }
    async refundWebhook(req, body) {
        await this.databaseService.webhookLogModel.create({
            log: JSON.stringify(body),
            event: body.event,
        });
        const event = body.event;
        const payment = body.payload?.payment?.entity;
        const refund = body.payload?.refund?.entity;
        if (!payment || !refund) {
            return { received: true, message: 'Invalid refund payload' };
        }
        if (event !== 'refund.processed' || refund.status !== 'processed') {
            return { received: true, message: 'Refund event logged' };
        }
        const transaction = await this.databaseService.transactionModel.findOne({
            gatewayOrderId: payment.order_id,
        });
        if (!transaction) {
            console.error('Transaction not found for Razorpay order:', payment.order_id);
            return { received: true, message: 'Transaction not found' };
        }
        transaction.status = transaction_schema_1.TransactionStatus.REFUNDED;
        await transaction.save();
        await this.databaseService.orderModel.findByIdAndUpdate(transaction.orderId, {
            paymentStatus: 'REFUNDED',
        });
        return { received: true, message: 'Refund processed successfully' };
    }
    getAllTransactions(page, limit, status, paymentMethod, search, startDate, endDate) {
        return this.paymentService.getAllTransactions({
            page,
            limit,
            status,
            paymentMethod,
            search,
            startDate,
            endDate,
        });
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)("create-order"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)("create-cod-order"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createCodOrder", null);
__decorate([
    (0, common_1.Post)("verify"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Get)('/razorpay-init'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "initRazorpay", null);
__decorate([
    (0, common_1.Get)("/callback"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "callback", null);
__decorate([
    (0, common_1.Post)('/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "callbackPost", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "webhook", null);
__decorate([
    (0, common_1.Post)('/refund/webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "refundWebhook", null);
__decorate([
    (0, common_1.Get)('/transactions'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("status")),
    __param(3, (0, common_1.Query)("paymentMethod")),
    __param(4, (0, common_1.Query)("search")),
    __param(5, (0, common_1.Query)("startDate")),
    __param(6, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getAllTransactions", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        database_service_1.DatabaseService,
        cart_service_1.CartService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map