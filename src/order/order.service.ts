
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Types } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus } from 'src/database/schema/order.schema';
import { ShipRocketService } from 'src/ship-rocket/ship-rocket.service';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class OrderService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly shiprocketService: ShipRocketService,
        private readonly whatsappService: WhatsappService,
        private readonly paymentService: PaymentService,
    ) { }

    /**
     * Admin: Get all orders with pagination and optional status filter.
     * GET /orders/admin?page=1&limit=10&status=PENDING
     */
    async getAllOrders(
        page = 1,
        limit = 10,
        status?: string,
    ) {
        page = Number(page);
        limit = Number(limit);

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1
        ) {
            throw new BadRequestException(
                'Page and limit must be positive integers.',
            );
        }

        limit = Math.min(limit, 100);

        const filter: Record<string, any> = {};

        if (status) {
            if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
                throw new BadRequestException('Invalid order status.');
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

        const transactionsByOrder = new Map<
            string,
            typeof transactions
        >();

        for (const transaction of transactions) {
            const key = transaction.orderId.toString();
            const existing = transactionsByOrder.get(key) ?? [];

            existing.push(transaction);
            transactionsByOrder.set(key, existing);
        }

        const data = orders.map((order) => ({
            ...order,
            paymentDetails:
                transactionsByOrder.get(order._id.toString()) ?? [],
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

    /**
     * Admin: Update order status and optional tracking number.
     * PATCH /orders/admin/:orderId/status
     */

    async updateOrderStatus(
        orderId: string,
        status: OrderStatus,
        trackingNumber?: string,
    ) {
        if (!Types.ObjectId.isValid(orderId)) {
            throw new BadRequestException('Invalid order ID.');
        }

        if (!Object.values(OrderStatus).includes(status)) {
            throw new BadRequestException('Invalid order status.');
        }

        const order = await this.databaseService.orderModel
            .findById(orderId)
            .exec();

        if (!order) {
            throw new NotFoundException('Order not found.');
        }

        if (order.status === OrderStatus.CANCELLED) {
            throw new BadRequestException(
                'A cancelled order cannot be updated.',
            );
        }

        if (
            order.status === OrderStatus.DELIVERED &&
            status !== OrderStatus.RETURN_REQUESTED &&
            status !== OrderStatus.RETURNED
        ) {
            throw new BadRequestException(
                'A delivered order can only be moved to a return status.',
            );
        }

        // Create the Shiprocket order before marking the order as shipped.
        if (
            status === OrderStatus.SHIPPED &&
            order.status !== OrderStatus.SHIPPED
        ) {
            try {
                const payload = {
                    order_id: order.orderNumber,
                    order_date: new Date().toISOString().slice(0, 10),
                    pickup_location:
                        process.env.SHIPROCKET_PICKUP_LOCATION || 'warehouse',

                    billing_customer_name: order.customer.firstName,
                    billing_last_name: order.customer.lastName,
                    billing_address: order.shippingAddress.address,
                    billing_address_2:
                        order.shippingAddress.apartment || '',
                    billing_city: order.shippingAddress.city,
                    billing_pincode: order.shippingAddress.pincode,
                    billing_state: order.shippingAddress.state,
                    billing_country:
                        order.shippingAddress.country || 'India',
                    billing_email: order.customer.email,
                    billing_phone: order.customer.phone,

                    shipping_is_billing: true,

                    order_items: order.items.map((item) => ({
                        name: item.name,
                        sku: item.sku || item.productId.toString(),
                        units: item.quantity,
                        selling_price: item.price,
                    })),

                    payment_method:
                        order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',

                    sub_total: order.subtotal - order.discount,

                    // Replace these defaults with actual package measurements.
                    length: 20,
                    breadth: 15,
                    height: 10,
                    weight: 0.5,
                };

                const shipment =
                    await this.shiprocketService.createShipmentOrder(
                        payload,
                    ) as any;

                // Save the AWB only if one is actually returned.
                const awbCode =
                    shipment?.awb_code ??
                    shipment?.awb_data?.awb_code;

                if (awbCode) {
                    order.trackingNumber = String(awbCode);
                }
            } catch (e) {
                console.log(e, 'err');

                throw new BadRequestException(
                    'Unable to create Shiprocket shipment. Order status was not updated.',
                );
            }
        }

        order.status = status;

        if (status === OrderStatus.DELIVERED) {
            order.deliveredAt = new Date();
            await this.whatsappService.sendOrderDelivered({
                phone: process.env.WHATSAPP_NUMBER!,
                customerName: order.customer.firstName,
                orderNumber: order.orderNumber,
            });
        }

        if (status === OrderStatus.SHIPPED) {
            await this.whatsappService.sendOrderShipped({
                phone: process.env.WHATSAPP_NUMBER!,
                customerName: order.customer.firstName,
                orderNumber: order.orderNumber,
                trackingUrl: `${process.env.URL}/track-order?order_id=${order.orderNumber}`,
            });
        }

        if (status === OrderStatus.CANCELLED) {
            order.cancelledAt = new Date();
            await this.whatsappService.sendOrderCancelled({
                phone: order.customer.phone,
                customerName: order.customer.firstName,
                orderNumber: order.orderNumber,
            });
        }

        if (status === OrderStatus.RETURN_REQUESTED) {
            await this.whatsappService.sendReturnInitiated({
                phone: order.customer.phone,
                customerName: order.customer.firstName,
                orderNumber: order.orderNumber,
            });
        }

        if (status === OrderStatus.RETURNED) {
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


    /**
     * Get a single order with addresses and payment transaction history.
     */
    async getOrderById(orderId: string) {
        if (!Types.ObjectId.isValid(orderId)) {
            throw new BadRequestException('Invalid order ID.');
        }

        const order = await this.databaseService.orderModel
            .findById(orderId)
            .lean()
            .exec();

        if (!order) {
            throw new NotFoundException('Order not found.');
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

    /**
     * Get guest orders with pagination.
     */
    async getGuestOrder(
        guest_id: string,
        page = 1,
        limit = 10,
    ) {
        if (!guest_id || !guest_id.trim()) {
            throw new BadRequestException('Guest ID is required.');
        }

        page = Number(page);
        limit = Number(limit);

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1
        ) {
            throw new BadRequestException(
                'Page and limit must be positive integers.',
            );
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

        const transactionsByOrder = new Map<
            string,
            typeof transactions
        >();

        for (const transaction of transactions) {
            const key = transaction.orderId.toString();
            const existing = transactionsByOrder.get(key) ?? [];

            existing.push(transaction);
            transactionsByOrder.set(key, existing);
        }

        const data = orders.map((order) => ({
            ...order,
            paymentDetails:
                transactionsByOrder.get(order._id.toString()) ?? [],
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

    async getUserOrder(
        userId: string,
        page = 1,
        limit = 10,
    ) {
        try {


            const currentPage = Math.max(1, Number(page) || 1);
            const perPage = Math.min(100, Math.max(1, Number(limit) || 10));
            const skip = (currentPage - 1) * perPage;

            const filter = {
                userId: new Types.ObjectId(userId),
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
        } catch (e) {
            console.log(e);

            throw new BadRequestException(e.message)
        }
    }

    async handleCodConfirmationReply(
        customerPhone: string,
        buttonId: string,
    ) {
        const isConfirm = buttonId.startsWith("CONFIRM_COD_");
        const isCancel = buttonId.startsWith("CANCEL_COD_");

        if (!isConfirm && !isCancel) {
            return { success: false, message: "Unknown button reply" };
        }

        const orderId = buttonId.replace(
            isConfirm ? "CONFIRM_COD_" : "CANCEL_COD_",
            "",
        );

        if (!Types.ObjectId.isValid(orderId)) {
            return { success: false, message: "Invalid order ID" };
        }

        const order = await this.databaseService.orderModel.findById(orderId);

        if (!order) {
            return { success: false, message: "Order not found" };
        }

        if (order.paymentMethod !== PaymentMethod.COD) {
            return { success: false, message: "This is not a COD order" };
        }

        // Normalize both numbers before comparing.
        const normalizePhone = (phone: string) => {
            let number = phone.replace(/\D/g, "");

            if (number.length === 10) {
                number = `91${number}`;
            }

            return number;
        };

        // we are using hardcoded number for dev account
        // if (
        //     normalizePhone(order.customer.phone) !==
        //     normalizePhone(customerPhone)
        // ) {
        //     return {
        //         success: false,
        //         message: "WhatsApp number does not match the order",
        //     };
        // }

        // Prevent duplicate replies from changing an already processed order.
        if (order.status !== OrderStatus.PENDING) {
            return {
                success: true,
                message: `Order is already ${order.status}`,
            };
        }

        if (isConfirm) {
            order.status = OrderStatus.CONFIRMED;
            await order.save();

            console.log(`COD order ${orderId} confirmed by customer.`);

            return {
                success: true,
                message: "COD order confirmed successfully",
                orderId,
                status: OrderStatus.CONFIRMED,
            };
        }

        // Customer clicked NO: release the reserved stock.
        const session = await this.databaseService.connection.startSession();

        try {
            await session.withTransaction(async () => {
                const currentOrder =
                    await this.databaseService.orderModel
                        .findOne({
                            _id: orderId,
                            paymentMethod: PaymentMethod.COD,
                            status: OrderStatus.PENDING,
                            stockReleased: false,
                        })
                        .session(session);

                if (!currentOrder) return;

                for (const item of currentOrder.items) {
                    await this.databaseService.productModel.updateOne(
                        { _id: item.productId },
                        { $inc: { stock: item.quantity } },
                        { session },
                    );
                }

                currentOrder.stockReleased = true;
                currentOrder.status = OrderStatus.CANCELLED;
                currentOrder.cancelledAt = new Date();

                await currentOrder.save({ session });
            });

            return {
                success: true,
                message: "COD order cancelled",
                orderId,
                status: OrderStatus.CANCELLED,
            };
        } finally {
            await session.endSession();
        }
    }


    async initiateOrderRefund(
        orderId: string,
        refundAmount: number,
    ) {
        if (!Types.ObjectId.isValid(orderId)) {
            throw new BadRequestException("Invalid order ID.");
        }

        if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
            throw new BadRequestException("Enter a valid refund amount.");
        }

        const order = await this.databaseService.orderModel
            .findById(orderId)
            .exec();

        if (!order) {
            throw new NotFoundException("Order not found.");
        }

        if (order.paymentMethod !== PaymentMethod.RAZORPAY) {
            throw new BadRequestException(
                "Online refunds are only supported for Razorpay orders.",
            );
        }

        // Check duplicate refund before checking PAID status.
        if (
            order.paymentStatus === PaymentStatus.REFUND_INITIATED ||
            order.paymentStatus === PaymentStatus.REFUNDED
        ) {
            throw new BadRequestException(
                "A refund has already been initiated or completed for this order.",
            );
        }

        if (order.paymentStatus !== PaymentStatus.PAID) {
            throw new BadRequestException(
                "Only paid orders can be refunded.",
            );
        }

        if (!order.paymentId) {
            throw new BadRequestException(
                "Razorpay payment ID is missing.",
            );
        }

        // Convert INR to paise.
        const amountInPaise = Math.round(refundAmount * 100);
        const maximumRefundInPaise = Math.round(order.total * 100);

        if (amountInPaise > maximumRefundInPaise) {
            throw new BadRequestException(
                "Refund amount cannot exceed the order total.",
            );
        }

        // Initiate Razorpay refund.
        const refund = await this.paymentService.createRefund(
            order.paymentId,
            amountInPaise,
        );

        // Keep order status separate from payment status.
        order.paymentStatus = PaymentStatus.REFUND_INITIATED;
        order.status = OrderStatus.REFUND_INITIATED
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

}
