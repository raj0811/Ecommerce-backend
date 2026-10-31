"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
const mongoose_1 = require("mongoose");
const order_schema_1 = require("../database/schema/order.schema");
const transaction_schema_1 = require("../database/schema/transaction.schema");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const user_service_1 = require("../user/user.service");
let PaymentService = class PaymentService {
    databaseService;
    whatsappService;
    userService;
    reservationMinutes = 15;
    constructor(databaseService, whatsappService, userService) {
        this.databaseService = databaseService;
        this.whatsappService = whatsappService;
        this.userService = userService;
    }
    generateOrderNumber() {
        return `ORD-${Date.now()}-${(0, crypto_1.randomUUID)()
            .slice(0, 8)
            .toUpperCase()}`;
    }
    async createRazorpayOrder(input) {
        const keyId = process.env.RZP_API_KEY;
        const keySecret = process.env.RZP_KEY_SECRET;
        if (!keyId || !keySecret) {
            throw new common_1.InternalServerErrorException("Razorpay credentials are missing.");
        }
        const { data } = await axios_1.default.post("https://api.razorpay.com/v1/orders", {
            amount: input.amount,
            currency: "INR",
            receipt: input.receipt,
            notes: {
                orderId: input.orderId,
                orderNumber: input.orderNumber,
            },
        }, {
            auth: {
                username: keyId,
                password: keySecret,
            },
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 15000,
        });
        if (!data?.id) {
            throw new Error("Razorpay did not return an order ID.");
        }
        return data;
    }
    async processOrder(input) {
        const { checkoutRequestId, customer, shippingAddress, billingAddress, userId, guestId, } = input;
        if (!guestId && !userId) {
            throw new common_1.BadRequestException("Invalid user");
        }
        if (!checkoutRequestId ||
            checkoutRequestId.length > 128 ||
            !Array.isArray(input.items) ||
            input.items.length === 0) {
            throw new common_1.BadRequestException("A checkout ID and at least one item are required.");
        }
        if (!customer?.firstName?.trim() ||
            !customer?.lastName?.trim() ||
            !customer?.email?.trim() ||
            !customer?.phone?.trim() ||
            !shippingAddress?.address?.trim() ||
            !shippingAddress?.city?.trim() ||
            !shippingAddress?.state?.trim() ||
            !/^\d{6}$/.test(shippingAddress.pincode)) {
            throw new common_1.BadRequestException("Please provide valid customer and shipping details.");
        }
        if (userId && !mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException("Invalid user ID.");
        }
        const quantities = new Map();
        for (const item of input.items) {
            if (!item ||
                !mongoose_1.Types.ObjectId.isValid(item.product_id) ||
                !Number.isSafeInteger(item.qty) ||
                item.qty < 1) {
                throw new common_1.BadRequestException("Each item must have a valid product ID and positive integer quantity.");
            }
            const id = item.product_id;
            const combined = (quantities.get(id) ?? 0) + item.qty;
            if (!Number.isSafeInteger(combined)) {
                throw new common_1.BadRequestException("Invalid item quantity.");
            }
            quantities.set(id, combined);
        }
        const session = await this.databaseService.orderModel.db.startSession();
        let orderId;
        let transaction_id;
        let orderNumber = "";
        let subtotalPaise = 0;
        let discountPaise = 0;
        let totalPaise = 0;
        try {
            await session.withTransaction(async () => {
                const orderItems = [];
                subtotalPaise = 0;
                for (const [productId, qty] of quantities.entries()) {
                    const id = new mongoose_1.Types.ObjectId(productId);
                    const product = await this.databaseService.productModel.findOneAndUpdate({
                        _id: id,
                        isActive: true,
                        stock: { $gte: qty },
                    }, {
                        $inc: { stock: -qty },
                    }, {
                        new: true,
                        session,
                    });
                    if (!product) {
                        throw new common_1.BadRequestException(`Product ${productId} is unavailable or has insufficient stock.`);
                    }
                    const price = Number(product.price);
                    if (!Number.isFinite(price) || price <= 0) {
                        throw new common_1.BadRequestException(`Product ${productId} has an invalid price.`);
                    }
                    const pricePaise = Math.round(price * 100);
                    const lineTotalPaise = pricePaise * qty;
                    if (!Number.isSafeInteger(lineTotalPaise)) {
                        throw new common_1.BadRequestException("Invalid order amount.");
                    }
                    subtotalPaise += lineTotalPaise;
                    if (!Number.isSafeInteger(subtotalPaise)) {
                        throw new common_1.BadRequestException("Invalid order subtotal.");
                    }
                    orderItems.push({
                        productId: id,
                        name: product.name,
                        sku: product.sku ?? "",
                        image: Array.isArray(product.images)
                            ? product.images[0] ?? ""
                            : "",
                        price: pricePaise / 100,
                        quantity: qty,
                        lineTotal: lineTotalPaise / 100,
                    });
                }
                discountPaise = Math.round(subtotalPaise * 0.05);
                totalPaise = subtotalPaise - discountPaise;
                if (totalPaise <= 0) {
                    throw new common_1.BadRequestException("Order total must be greater than zero.");
                }
                orderNumber = this.generateOrderNumber();
                const [order] = await this.databaseService.orderModel.create([
                    {
                        checkoutRequestId,
                        orderNumber,
                        userId: userId ? new mongoose_1.Types.ObjectId(userId) : null,
                        guestId: guestId || null,
                        customer: {
                            ...customer,
                            email: customer.email.trim().toLowerCase(),
                        },
                        items: orderItems,
                        shippingAddress,
                        billingAddress: billingAddress ?? null,
                        status: order_schema_1.OrderStatus.PENDING,
                        paymentMethod: order_schema_1.PaymentMethod.RAZORPAY,
                        paymentStatus: order_schema_1.PaymentStatus.PENDING,
                        subtotal: subtotalPaise / 100,
                        discount: discountPaise / 100,
                        shippingCharge: 0,
                        total: totalPaise / 100,
                        stockReleased: false,
                        reservationExpiresAt: new Date(Date.now() + this.reservationMinutes * 60 * 1000),
                    },
                ], { session });
                orderId = order._id;
                const [transaction] = await this.databaseService.transactionModel.create([
                    {
                        orderId: order._id,
                        userId: order.userId ?? null,
                        guestId: order.guestId ?? null,
                        paymentMethod: transaction_schema_1.TransactionPaymentMethod.RAZORPAY,
                        status: transaction_schema_1.TransactionStatus.PENDING,
                        amount: totalPaise / 100,
                        currency: "INR",
                        gatewayOrderId: null,
                    },
                ], { session });
                transaction_id = transaction._id;
            });
        }
        catch (error) {
            console.log(error);
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            const duplicate = await this.databaseService.orderModel.findOne({
                checkoutRequestId,
            });
            if (duplicate) {
                return this.getExistingPayment(duplicate);
            }
            throw new common_1.InternalServerErrorException("Checkout could not be saved. No order or stock reservation was committed.");
        }
        finally {
            await session.endSession();
        }
        if (!orderId) {
            throw new common_1.InternalServerErrorException("Order transaction did not complete.");
        }
        let razorpayOrder;
        try {
            razorpayOrder = await this.createRazorpayOrder({
                amount: totalPaise,
                receipt: orderNumber,
                orderId: orderId?.toString(),
                orderNumber,
            });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException("Payment setup is pending reconciliation. Retry using the same checkoutRequestId.");
        }
        try {
            const updateResult = await this.databaseService.transactionModel.updateOne({
                orderId,
                paymentMethod: transaction_schema_1.TransactionPaymentMethod.RAZORPAY,
                status: transaction_schema_1.TransactionStatus.PENDING,
            }, {
                $set: {
                    gatewayOrderId: razorpayOrder.id,
                },
            });
            if (updateResult.matchedCount !== 1) {
                throw new Error("Pending transaction was not found.");
            }
        }
        catch {
            throw new common_1.InternalServerErrorException("Payment was created but its status needs reconciliation. Do not start a new checkout.");
        }
        try {
            void this.whatsappService
                .sendOrderReceived({
                phone: process.env.WHATSAPP_NUMBER,
                customerName: customer.firstName,
                orderNumber,
                total: totalPaise / 100,
            })
                .catch((error) => {
                console.error('Failed to send WhatsApp order notification:', error.response?.data || error.message);
            });
        }
        catch (e) {
            console.log("failed to send notifications");
        }
        try {
            if (userId) {
                const fullAddress = {
                    fullName: `${customer.firstName} ${customer.lastName}`,
                    phone: customer.phone,
                    addressLine1: shippingAddress.address,
                    addressLine2: shippingAddress.apartment,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    pincode: shippingAddress.pincode,
                    isDefault: false
                };
                await this.userService.updateUserAddress(userId, fullAddress);
            }
        }
        catch (e) {
            console.log(`error in savin address ${e.message}`);
        }
        return {
            payment_url: `${process.env.BACKEND_URL}/payments/razorpay-init?transaction_id=${transaction_id}`,
            orderId,
            orderNumber,
            razorpayOrderId: razorpayOrder.id,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID,
            transaction_id: "",
            amount: totalPaise,
            currency: "INR",
            subtotal: subtotalPaise / 100,
            discount: discountPaise / 100,
            total: totalPaise / 100,
            status: "PAYMENT_PENDING",
        };
    }
    async processCodOrder(input) {
        const { checkoutRequestId, customer, shippingAddress, billingAddress, userId, guestId, } = input;
        if (!guestId && !userId) {
            throw new common_1.BadRequestException("Invalid user");
        }
        try {
            if (userId) {
                const fullAddress = {
                    fullName: `${customer.firstName} ${customer.lastName}`,
                    phone: customer.phone,
                    addressLine1: shippingAddress.address,
                    addressLine2: shippingAddress.apartment,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    pincode: shippingAddress.pincode,
                    isDefault: false
                };
                await this.userService.updateUserAddress(userId, fullAddress);
            }
        }
        catch (e) {
            console.log(`error in savin address ${e.message}`);
        }
        if (!checkoutRequestId ||
            checkoutRequestId.length > 128 ||
            !Array.isArray(input.items) ||
            input.items.length === 0) {
            throw new common_1.BadRequestException("A checkout ID and at least one item are required.");
        }
        if (!customer?.firstName?.trim() ||
            !customer?.lastName?.trim() ||
            !customer?.email?.trim() ||
            !customer?.phone?.trim() ||
            !shippingAddress?.address?.trim() ||
            !shippingAddress?.city?.trim() ||
            !shippingAddress?.state?.trim() ||
            !/^\d{6}$/.test(shippingAddress.pincode)) {
            throw new common_1.BadRequestException("Please provide valid customer and shipping details.");
        }
        if (userId && !mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException("Invalid user ID.");
        }
        const quantities = new Map();
        for (const item of input.items) {
            if (!item ||
                !mongoose_1.Types.ObjectId.isValid(item.product_id) ||
                !Number.isSafeInteger(item.qty) ||
                item.qty < 1) {
                throw new common_1.BadRequestException("Each item must have a valid product ID and positive integer quantity.");
            }
            const id = item.product_id;
            const combined = (quantities.get(id) ?? 0) + item.qty;
            if (!Number.isSafeInteger(combined)) {
                throw new common_1.BadRequestException("Invalid item quantity.");
            }
            quantities.set(id, combined);
        }
        const existingOrder = await this.databaseService.orderModel.findOne({
            checkoutRequestId,
        });
        if (existingOrder) {
            if (existingOrder.paymentMethod !== order_schema_1.PaymentMethod.COD) {
                throw new common_1.BadRequestException("This checkout ID has already been used for another payment method.");
            }
            return {
                orderId: existingOrder._id,
                orderNumber: existingOrder.orderNumber,
                paymentMethod: order_schema_1.PaymentMethod.COD,
                subtotal: existingOrder.subtotal,
                discount: existingOrder.discount,
                total: existingOrder.total,
                currency: "INR",
                status: "ORDER_PLACED",
                paymentStatus: existingOrder.paymentStatus,
            };
        }
        const session = await this.databaseService.orderModel.db.startSession();
        let orderId;
        let transactionId;
        let orderNumber = "";
        let subtotalPaise = 0;
        let totalPaise = 0;
        try {
            await session.withTransaction(async () => {
                const orderItems = [];
                subtotalPaise = 0;
                for (const [productId, qty] of quantities.entries()) {
                    const id = new mongoose_1.Types.ObjectId(productId);
                    const product = await this.databaseService.productModel.findOneAndUpdate({
                        _id: id,
                        isActive: true,
                        stock: { $gte: qty },
                    }, {
                        $inc: { stock: -qty },
                    }, {
                        new: true,
                        session,
                    });
                    if (!product) {
                        throw new common_1.BadRequestException(`Product ${productId} is unavailable or has insufficient stock.`);
                    }
                    const price = Number(product.price);
                    if (!Number.isFinite(price) || price <= 0) {
                        throw new common_1.BadRequestException(`Product ${productId} has an invalid price.`);
                    }
                    const pricePaise = Math.round(price * 100);
                    const lineTotalPaise = pricePaise * qty;
                    if (!Number.isSafeInteger(lineTotalPaise)) {
                        throw new common_1.BadRequestException("Invalid order amount.");
                    }
                    subtotalPaise += lineTotalPaise;
                    if (!Number.isSafeInteger(subtotalPaise)) {
                        throw new common_1.BadRequestException("Invalid order subtotal.");
                    }
                    orderItems.push({
                        productId: id,
                        name: product.name,
                        sku: product.sku ?? "",
                        image: Array.isArray(product.images)
                            ? product.images[0] ?? ""
                            : "",
                        price: pricePaise / 100,
                        quantity: qty,
                        lineTotal: lineTotalPaise / 100,
                    });
                }
                if (subtotalPaise >= 300000) {
                    throw new common_1.BadRequestException("Cash on Delivery is available only for orders below ₹3,000.");
                }
                totalPaise = subtotalPaise;
                if (totalPaise <= 0) {
                    throw new common_1.BadRequestException("Order total must be greater than zero.");
                }
                orderNumber = this.generateOrderNumber();
                const [order] = await this.databaseService.orderModel.create([
                    {
                        checkoutRequestId,
                        orderNumber,
                        userId: userId
                            ? new mongoose_1.Types.ObjectId(userId)
                            : null,
                        guestId: guestId || null,
                        customer: {
                            ...customer,
                            email: customer.email
                                .trim()
                                .toLowerCase(),
                        },
                        items: orderItems,
                        shippingAddress,
                        billingAddress: billingAddress ?? null,
                        status: order_schema_1.OrderStatus.PENDING,
                        paymentMethod: order_schema_1.PaymentMethod.COD,
                        paymentStatus: order_schema_1.PaymentStatus.PENDING,
                        subtotal: subtotalPaise / 100,
                        discount: 0,
                        shippingCharge: 0,
                        total: totalPaise / 100,
                        stockReleased: false,
                        reservationExpiresAt: new Date(Date.now() +
                            this.reservationMinutes * 60 * 1000),
                    },
                ], { session });
                orderId = order._id;
                const [transaction] = await this.databaseService.transactionModel.create([
                    {
                        orderId: order._id,
                        userId: order.userId ?? null,
                        guestId: order.guestId ?? null,
                        paymentMethod: transaction_schema_1.TransactionPaymentMethod.COD,
                        status: transaction_schema_1.TransactionStatus.PENDING,
                        amount: totalPaise / 100,
                        currency: "INR",
                        gatewayOrderId: null,
                    },
                ], { session });
                transactionId = transaction._id;
            });
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            const duplicate = await this.databaseService.orderModel.findOne({
                checkoutRequestId,
            });
            if (duplicate?.paymentMethod === order_schema_1.PaymentMethod.COD) {
                return {
                    orderId: duplicate._id,
                    orderNumber: duplicate.orderNumber,
                    paymentMethod: order_schema_1.PaymentMethod.COD,
                    subtotal: duplicate.subtotal,
                    discount: duplicate.discount,
                    total: duplicate.total,
                    currency: "INR",
                    status: "ORDER_PLACED",
                    paymentStatus: duplicate.paymentStatus,
                };
            }
            console.error("COD order creation failed:", error);
            throw new common_1.InternalServerErrorException("COD order could not be created.");
        }
        finally {
            await session.endSession();
        }
        if (!orderId) {
            throw new common_1.InternalServerErrorException("COD order transaction did not complete.");
        }
        void this.whatsappService
            .sendCodOrderConfirmation({
            phone: process.env.WHATSAPP_NUMBER,
            customerName: customer.firstName,
            orderNumber,
            orderId: orderId.toString(),
            total: totalPaise / 100,
        })
            .catch((error) => {
            console.error("Failed to send COD confirmation:", error.response?.data || error.message);
        });
        return {
            orderId,
            orderNumber,
            transaction_id: transactionId?.toString(),
            paymentMethod: order_schema_1.PaymentMethod.COD,
            subtotal: subtotalPaise / 100,
            discount: 0,
            total: totalPaise / 100,
            currency: "INR",
            status: "ORDER_PLACED",
            paymentStatus: order_schema_1.PaymentStatus.PENDING,
        };
    }
    async getExistingPayment(order) {
        const transaction = await this.databaseService.transactionModel.findOne({
            orderId: order._id,
            paymentMethod: transaction_schema_1.TransactionPaymentMethod.RAZORPAY,
            status: transaction_schema_1.TransactionStatus.PENDING,
            gatewayOrderId: { $ne: null },
        });
        if (transaction &&
            order.paymentStatus === order_schema_1.PaymentStatus.PENDING &&
            !order.stockReleased &&
            order.reservationExpiresAt &&
            new Date(order.reservationExpiresAt).getTime() > Date.now()) {
            return {
                payment_url: `${process.env.BACKEND_URL}/payments/razorpay-init?transaction_id=${transaction._id}`,
                orderId: order._id,
                orderNumber: order.orderNumber,
                razorpayOrderId: transaction.gatewayOrderId,
                razorpayKeyId: process.env.RAZORPAY_KEY_ID,
                amount: Math.round(Number(transaction.amount) * 100),
                currency: transaction.currency ?? "INR",
                subtotal: order.subtotal,
                discount: order.discount,
                total: order.total,
                reservationExpiresAt: order.reservationExpiresAt,
                status: "PAYMENT_PENDING",
            };
        }
        throw new common_1.BadRequestException("This checkout has already been processed or expired. Start a new checkout.");
    }
    verifyPaymentSignature(input) {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            throw new common_1.InternalServerErrorException("Razorpay credentials are missing.");
        }
        const expected = (0, crypto_1.createHmac)("sha256", secret)
            .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
            .digest("hex");
        const a = Buffer.from(expected, "hex");
        const b = Buffer.from(input.razorpaySignature, "hex");
        const { timingSafeEqual } = require("crypto");
        return (a.length === b.length &&
            timingSafeEqual(a, b));
    }
    async checkPaymentStatus(razorpay_order_id) {
        try {
            const config = {
                url: `https://api.razorpay.com/v1/orders/${razorpay_order_id}`,
                method: 'get',
                auth: {
                    username: process.env.RAZORPAY_API_KEY,
                    password: process.env.RAZORPAY_KEY_SECRET
                },
                headers: {
                    "content-type": "application/json"
                }
            };
            const response = await axios_1.default.request(config);
            return response.data;
        }
        catch (e) {
            return e.response.data;
        }
    }
    async getAllTransactions(query) {
        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 10);
        if (!Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100) {
            throw new common_1.BadRequestException("Page must be positive and limit must be between 1 and 100.");
        }
        const filter = {};
        if (query.status) {
            filter.status = query.status;
        }
        if (query.paymentMethod) {
            filter.paymentMethod = query.paymentMethod;
        }
        if (query.startDate || query.endDate) {
            const createdAt = {};
            if (query.startDate) {
                const start = new Date(query.startDate);
                if (Number.isNaN(start.getTime())) {
                    throw new common_1.BadRequestException("Invalid startDate.");
                }
                createdAt.$gte = start;
            }
            if (query.endDate) {
                const end = new Date(query.endDate);
                if (Number.isNaN(end.getTime())) {
                    throw new common_1.BadRequestException("Invalid endDate.");
                }
                createdAt.$lte = end;
            }
            filter.createdAt = createdAt;
        }
        if (query.search?.trim()) {
            const search = query.search.trim();
            const conditions = [
                { gatewayOrderId: search },
            ];
            if (mongoose_1.Types.ObjectId.isValid(search)) {
                conditions.push({ _id: new mongoose_1.Types.ObjectId(search) });
                conditions.push({ orderId: new mongoose_1.Types.ObjectId(search) });
            }
            const matchingOrders = await this.databaseService.orderModel
                .find({
                orderNumber: { $regex: this.escapeRegex(search), $options: "i" },
            })
                .select("_id")
                .lean()
                .exec();
            if (matchingOrders.length) {
                conditions.push({
                    orderId: { $in: matchingOrders.map((order) => order._id) },
                });
            }
            filter.$or = conditions;
        }
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            this.databaseService.transactionModel
                .find(filter)
                .sort({ createdAt: -1, _id: -1 })
                .skip(skip)
                .limit(limit)
                .populate({
                path: "orderId",
                select: "orderNumber customer items subtotal discount shippingCharge total status paymentStatus shippingAddress createdAt",
            })
                .lean()
                .exec(),
            this.databaseService.transactionModel.countDocuments(filter),
        ]);
        return {
            success: true,
            data: transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        };
    }
    escapeRegex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    async createRefund(paymentId, amount) {
        const keyId = process.env.RAZORPAY_API_KEY;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        const payload = {};
        if (amount !== undefined) {
            payload.amount = amount;
        }
        const config = {
            method: 'POST',
            url: `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
            auth: {
                username: keyId,
                password: keySecret,
            },
            headers: {
                'Content-Type': 'application/json',
            },
            data: payload,
        };
        try {
            const response = await axios_1.default.request(config);
            return response.data;
        }
        catch (error) {
            console.error('Razorpay refund error:', error.response?.data || error.message);
            throw new common_1.InternalServerErrorException(error.response?.data?.error?.description ||
                'Failed to create Razorpay refund');
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        whatsapp_service_1.WhatsappService,
        user_service_1.UserService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map