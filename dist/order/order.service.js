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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const mongoose_1 = require("mongoose");
const order_schema_1 = require("../database/schema/order.schema");
const ship_rocket_service_1 = require("../ship-rocket/ship-rocket.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const payment_service_1 = require("../payment/payment.service");
let OrderService = class OrderService {
    databaseService;
    shiprocketService;
    whatsappService;
    paymentService;
    constructor(databaseService, shiprocketService, whatsappService, paymentService) {
        this.databaseService = databaseService;
        this.shiprocketService = shiprocketService;
        this.whatsappService = whatsappService;
        this.paymentService = paymentService;
    }
    async getAllOrders(page = 1, limit = 10, status) {
        page = Number(page);
        limit = Number(limit);
        if (!Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1) {
            throw new common_1.BadRequestException('Page and limit must be positive integers.');
        }
        limit = Math.min(limit, 100);
        const filter = {};
        if (status) {
            if (!Object.values(order_schema_1.OrderStatus).includes(status)) {
                throw new common_1.BadRequestException('Invalid order status.');
            }
            filter.status = status;
        }
        const skip = (page - 1) * limit;
        const [orders, totalOrders] = await Promise.all([
            this.databaseService.orderModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            this.databaseService.orderModel
                .countDocuments(filter)
                .exec(),
        ]);
        const orderIds = orders.map((order) => order._id);
        const transactions = orderIds.length
            ? await this.databaseService.transactionModel
                .find({ orderId: { $in: orderIds } })
                .select('-gatewaySignature')
                .sort({ createdAt: -1 })
                .lean()
                .exec()
            : [];
        const transactionsByOrder = new Map();
        for (const transaction of transactions) {
            const key = transaction.orderId.toString();
            const existing = transactionsByOrder.get(key) ?? [];
            existing.push(transaction);
            transactionsByOrder.set(key, existing);
        }
        const data = orders.map((order) => ({
            ...order,
            paymentDetails: transactionsByOrder.get(order._id.toString()) ?? [],
        }));
        return {
            data,
            pagination: {
                totalOrders,
                currentPage: page,
                limit,
                totalPages: Math.ceil(totalOrders / limit),
                hasNextPage: page * limit < totalOrders,
                hasPreviousPage: page > 1,
            },
        };
    }
    async updateOrderStatus(orderId, status, trackingNumber) {
        if (!mongoose_1.Types.ObjectId.isValid(orderId)) {
            throw new common_1.BadRequestException('Invalid order ID.');
        }
        if (!Object.values(order_schema_1.OrderStatus).includes(status)) {
            throw new common_1.BadRequestException('Invalid order status.');
        }
        const order = await this.databaseService.orderModel
            .findById(orderId)
            .exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found.');
        }
        if (order.status === order_schema_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('A cancelled order cannot be updated.');
        }
        if (order.status === order_schema_1.OrderStatus.DELIVERED &&
            status !== order_schema_1.OrderStatus.RETURN_REQUESTED &&
            status !== order_schema_1.OrderStatus.RETURNED) {
            throw new common_1.BadRequestException('A delivered order can only be moved to a return status.');
        }
        if (status === order_schema_1.OrderStatus.SHIPPED &&
            order.status !== order_schema_1.OrderStatus.SHIPPED) {
            try {
                const payload = {
                    order_id: order.orderNumber,
                    order_date: new Date().toISOString().slice(0, 10),
                    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'warehouse',
                    billing_customer_name: order.customer.firstName,
                    billing_last_name: order.customer.lastName,
                    billing_address: order.shippingAddress.address,
                    billing_address_2: order.shippingAddress.apartment || '',
                    billing_city: order.shippingAddress.city,
                    billing_pincode: order.shippingAddress.pincode,
                    billing_state: order.shippingAddress.state,
                    billing_country: order.shippingAddress.country || 'India',
                    billing_email: order.customer.email,
                    billing_phone: order.customer.phone,
                    shipping_is_billing: true,
                    order_items: order.items.map((item) => ({
                        name: item.name,
                        sku: item.sku || item.productId.toString(),
                        units: item.quantity,
                        selling_price: item.price,
                    })),
                    payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
                    sub_total: order.subtotal - order.discount,
                    length: 20,
                    breadth: 15,
                    height: 10,
                    weight: 0.5,
                };
                const shipment = await this.shiprocketService.createShipmentOrder(payload);
                const awbCode = shipment?.awb_code ??
                    shipment?.awb_data?.awb_code;
                if (awbCode) {
                    order.trackingNumber = String(awbCode);
                }
            }
            catch (e) {
                console.log(e, 'err');
                throw new common_1.BadRequestException('Unable to create Shiprocket shipment. Order status was not updated.');
            }
        }
        order.status = status;
        if (status === order_schema_1.OrderStatus.DELIVERED) {
            order.deliveredAt = new Date();
            await this.whatsappService.sendOrderDelivered({
                phone: process.env.WHATSAPP_NUMBER,
                customerName: order.customer.firstName,
                orderNumber: order.orderNumber,
            });
        }
        if (status === order_schema_1.OrderStatus.SHIPPED) {
            await this.whatsappService.sendOrderShipped({
                phone: process.env.WHATSAPP_NUMBER,
                customerName: order.customer.firstName,
                orderNumber: order.orderNumber,
                trackingUrl: `${process.env.URL}/track-order?order_id=${order.orderNumber}`,
            });
        }
        if (status === order_schema_1.OrderStatus.CANCELLED) {
            order.cancelledAt = new Date();
            await this.whatsappService.sendOrderCancelled({
                phone: order.customer.phone,
                customerName: order.customer.firstName,
                orderNumber: order.orderNumber,
            });
        }
        if (status === order_schema_1.OrderStatus.RETURN_REQUESTED) {
            await this.whatsappService.sendReturnInitiated({
                phone: order.customer.phone,
                customerName: order.customer.firstName,
                orderNumber: order.orderNumber,
            });
        }
        if (status === order_schema_1.OrderStatus.RETURNED) {
            await this.whatsappService.sendReturnCompleted({
                phone: order.customer.phone,
                customerName: order.customer.firstName,
                orderNumber: order.orderNumber,
                refundAmount: order.total,
            });
        }
        if (trackingNumber !== undefined) {
            order.trackingNumber = trackingNumber.trim() || null;
        }
        await order.save();
        return {
            message: 'Order status updated successfully.',
            order,
        };
    }
    async getOrderById(orderId) {
        if (!mongoose_1.Types.ObjectId.isValid(orderId)) {
            throw new common_1.BadRequestException('Invalid order ID.');
        }
        const order = await this.databaseService.orderModel
            .findById(orderId)
            .lean()
            .exec();
        if (!order) {
            throw new common_1.NotFoundException('Order not found.');
        }
        const transactions = await this.databaseService.transactionModel
            .find({ orderId: order._id })
            .select('-gatewaySignature')
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        return {
            ...order,
            paymentDetails: transactions,
        };
    }
    async getGuestOrder(guest_id, page = 1, limit = 10) {
        if (!guest_id || !guest_id.trim()) {
            throw new common_1.BadRequestException('Guest ID is required.');
        }
        page = Number(page);
        limit = Number(limit);
        if (!Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1) {
            throw new common_1.BadRequestException('Page and limit must be positive integers.');
        }
        limit = Math.min(limit, 100);
        const skip = (page - 1) * limit;
        const filter = { guestId: guest_id };
        const [orders, totalOrders] = await Promise.all([
            this.databaseService.orderModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            this.databaseService.orderModel
                .countDocuments(filter)
                .exec(),
        ]);
        const orderIds = orders.map((order) => order._id);
        const transactions = orderIds.length
            ? await this.databaseService.transactionModel
                .find({ orderId: { $in: orderIds } })
                .select('-gatewaySignature')
                .sort({ createdAt: -1 })
                .lean()
                .exec()
            : [];
        const transactionsByOrder = new Map();
        for (const transaction of transactions) {
            const key = transaction.orderId.toString();
            const existing = transactionsByOrder.get(key) ?? [];
            existing.push(transaction);
            transactionsByOrder.set(key, existing);
        }
        const data = orders.map((order) => ({
            ...order,
            paymentDetails: transactionsByOrder.get(order._id.toString()) ?? [],
        }));
        return {
            data,
            pagination: {
                totalOrders,
                currentPage: page,
                limit,
                totalPages: Math.ceil(totalOrders / limit),
                hasNextPage: page * limit < totalOrders,
                hasPreviousPage: page > 1,
            },
        };
    }
    async getUserOrder(userId, page = 1, limit = 10) {
        try {
            const currentPage = Math.max(1, Number(page) || 1);
            const perPage = Math.min(100, Math.max(1, Number(limit) || 10));
            const skip = (currentPage - 1) * perPage;
            const filter = {
                userId: new mongoose_1.Types.ObjectId(userId),
            };
            const [orders, totalOrders] = await Promise.all([
                this.databaseService.orderModel
                    .find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(perPage)
                    .lean()
                    .exec(),
                this.databaseService.orderModel.countDocuments(filter).exec(),
            ]);
            return {
                success: true,
                message: "User orders fetched successfully",
                data: orders,
                pagination: {
                    currentPage,
                    perPage,
                    totalOrders,
                    totalPages: Math.ceil(totalOrders / perPage),
                    hasNextPage: currentPage * perPage < totalOrders,
                    hasPreviousPage: currentPage > 1,
                },
            };
        }
        catch (e) {
            console.log(e);
            throw new common_1.BadRequestException(e.message);
        }
    }
    async handleCodConfirmationReply(customerPhone, buttonId) {
        const isConfirm = buttonId.startsWith("CONFIRM_COD_");
        const isCancel = buttonId.startsWith("CANCEL_COD_");
        if (!isConfirm && !isCancel) {
            return { success: false, message: "Unknown button reply" };
        }
        const orderId = buttonId.replace(isConfirm ? "CONFIRM_COD_" : "CANCEL_COD_", "");
        if (!mongoose_1.Types.ObjectId.isValid(orderId)) {
            return { success: false, message: "Invalid order ID" };
        }
        const order = await this.databaseService.orderModel.findById(orderId);
        if (!order) {
            return { success: false, message: "Order not found" };
        }
        if (order.paymentMethod !== order_schema_1.PaymentMethod.COD) {
            return { success: false, message: "This is not a COD order" };
        }
        const normalizePhone = (phone) => {
            let number = phone.replace(/\D/g, "");
            if (number.length === 10) {
                number = `91${number}`;
            }
            return number;
        };
        if (order.status !== order_schema_1.OrderStatus.PENDING) {
            return {
                success: true,
                message: `Order is already ${order.status}`,
            };
        }
        if (isConfirm) {
            order.status = order_schema_1.OrderStatus.CONFIRMED;
            await order.save();
            console.log(`COD order ${orderId} confirmed by customer.`);
            return {
                success: true,
                message: "COD order confirmed successfully",
                orderId,
                status: order_schema_1.OrderStatus.CONFIRMED,
            };
        }
        const session = await this.databaseService.connection.startSession();
        try {
            await session.withTransaction(async () => {
                const currentOrder = await this.databaseService.orderModel
                    .findOne({
                    _id: orderId,
                    paymentMethod: order_schema_1.PaymentMethod.COD,
                    status: order_schema_1.OrderStatus.PENDING,
                    stockReleased: false,
                })
                    .session(session);
                if (!currentOrder)
                    return;
                for (const item of currentOrder.items) {
                    await this.databaseService.productModel.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } }, { session });
                }
                currentOrder.stockReleased = true;
                currentOrder.status = order_schema_1.OrderStatus.CANCELLED;
                currentOrder.cancelledAt = new Date();
                await currentOrder.save({ session });
            });
            return {
                success: true,
                message: "COD order cancelled",
                orderId,
                status: order_schema_1.OrderStatus.CANCELLED,
            };
        }
        finally {
            await session.endSession();
        }
    }
    async initiateOrderRefund(orderId, refundAmount) {
        if (!mongoose_1.Types.ObjectId.isValid(orderId)) {
            throw new common_1.BadRequestException("Invalid order ID.");
        }
        if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
            throw new common_1.BadRequestException("Enter a valid refund amount.");
        }
        const order = await this.databaseService.orderModel
            .findById(orderId)
            .exec();
        if (!order) {
            throw new common_1.NotFoundException("Order not found.");
        }
        if (order.paymentMethod !== order_schema_1.PaymentMethod.RAZORPAY) {
            throw new common_1.BadRequestException("Online refunds are only supported for Razorpay orders.");
        }
        if (order.paymentStatus === order_schema_1.PaymentStatus.REFUND_INITIATED ||
            order.paymentStatus === order_schema_1.PaymentStatus.REFUNDED) {
            throw new common_1.BadRequestException("A refund has already been initiated or completed for this order.");
        }
        if (order.paymentStatus !== order_schema_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException("Only paid orders can be refunded.");
        }
        if (!order.paymentId) {
            throw new common_1.BadRequestException("Razorpay payment ID is missing.");
        }
        const amountInPaise = Math.round(refundAmount * 100);
        const maximumRefundInPaise = Math.round(order.total * 100);
        if (amountInPaise > maximumRefundInPaise) {
            throw new common_1.BadRequestException("Refund amount cannot exceed the order total.");
        }
        const refund = await this.paymentService.createRefund(order.paymentId, amountInPaise);
        order.paymentStatus = order_schema_1.PaymentStatus.REFUND_INITIATED;
        order.status = order_schema_1.OrderStatus.REFUND_INITIATED;
        order.refundAmount = refundAmount;
        order.razorpayRefundId = refund.id;
        order.refundInitiatedAt = new Date();
        order.refundGatewayStatus = refund.status ?? "pending";
        await order.save();
        return {
            message: "Refund initiated successfully.",
            refundId: refund.id,
            refundAmount,
            refundStatus: refund.status,
            order,
        };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        ship_rocket_service_1.ShipRocketService,
        whatsapp_service_1.WhatsappService,
        payment_service_1.PaymentService])
], OrderService);
//# sourceMappingURL=order.service.js.map