
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import axios from "axios";
import { createHmac, randomUUID } from "crypto";
import { Types } from "mongoose";

import {
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
} from "src/database/schema/order.schema";

import {
    TransactionPaymentMethod,
    TransactionStatus,
} from "src/database/schema/transaction.schema";
import { WhatsappService } from "src/whatsapp/whatsapp.service";
import { UserService } from "src/user/user.service";
import { CustomerAddress } from "aws-sdk/clients/directconnect";

type CheckoutItem = {
    product_id: string;
    qty: number;
};

type CheckoutInput = {
    checkoutRequestId: string;
    items: CheckoutItem[];
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    shippingAddress: {
        address: string;
        apartment?: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
    };
    billingAddress?: {
        address: string;
        apartment?: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
    };
    userId?: string;
    guestId?: string;
};

@Injectable()
export class PaymentService {
    private readonly reservationMinutes = 15;

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly whatsappService: WhatsappService,
        private readonly userService: UserService
    ) { }

    generateOrderNumber(): string {
        return `ORD-${Date.now()}-${randomUUID()
            .slice(0, 8)
            .toUpperCase()}`;
    }

    private async createRazorpayOrder(input: {
        amount: number;
        receipt: string;
        orderId: string;
        orderNumber: string;
    }) {
        const keyId = process.env.RZP_API_KEY;
        const keySecret = process.env.RZP_KEY_SECRET;

        if (!keyId || !keySecret) {
            throw new InternalServerErrorException(
                "Razorpay credentials are missing.",
            );
        }

        const { data } = await axios.post(
            "https://api.razorpay.com/v1/orders",
            {
                amount: input.amount,
                currency: "INR",
                receipt: input.receipt,
                notes: {
                    orderId: input.orderId,
                    orderNumber: input.orderNumber,
                },
            },
            {
                auth: {
                    username: keyId,
                    password: keySecret,
                },
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 15000,
            },
        );

        if (!data?.id) {
            throw new Error("Razorpay did not return an order ID.");
        }

        return data as {
            id: string;
            amount: number;
            currency: string;
            status: string;
        };
    }


    async processOrder(input: CheckoutInput) {
        const {
            checkoutRequestId,
            customer,
            shippingAddress,
            billingAddress,
            userId,
            guestId,
        } = input;
        if (!guestId && !userId) {
            throw new BadRequestException("Invalid user")
        }
        if (
            !checkoutRequestId ||
            checkoutRequestId.length > 128 ||
            !Array.isArray(input.items) ||
            input.items.length === 0
        ) {
            throw new BadRequestException(
                "A checkout ID and at least one item are required.",
            );
        }

        if (
            !customer?.firstName?.trim() ||
            !customer?.lastName?.trim() ||
            !customer?.email?.trim() ||
            !customer?.phone?.trim() ||
            !shippingAddress?.address?.trim() ||
            !shippingAddress?.city?.trim() ||
            !shippingAddress?.state?.trim() ||
            !/^\d{6}$/.test(shippingAddress.pincode)
        ) {
            throw new BadRequestException(
                "Please provide valid customer and shipping details.",
            );
        }

        if (userId && !Types.ObjectId.isValid(userId)) {
            throw new BadRequestException("Invalid user ID.");
        }

        const quantities = new Map<string, number>();

        for (const item of input.items) {
            if (
                !item ||
                !Types.ObjectId.isValid(item.product_id) ||
                !Number.isSafeInteger(item.qty) ||
                item.qty < 1
            ) {
                throw new BadRequestException(
                    "Each item must have a valid product ID and positive integer quantity.",
                );
            }

            const id = item.product_id;
            const combined = (quantities.get(id) ?? 0) + item.qty;

            if (!Number.isSafeInteger(combined)) {
                throw new BadRequestException("Invalid item quantity.");
            }

            quantities.set(id, combined);
        }

        // Return the existing payment instead of creating a duplicate.
        // const existing = await this.databaseService.orderModel.findOne({
        //     checkoutRequestId,
        // });

        // if (existing) {
        //     return this.getExistingPayment(existing);
        // }

        const session =
            await this.databaseService.orderModel.db.startSession();

        let orderId
        let transaction_id
        let orderNumber = "";
        let subtotalPaise = 0;
        let discountPaise = 0;
        let totalPaise = 0;

        try {
            await session.withTransaction(async () => {
                // Protect against a checkout that appeared before this transaction.
                // const duplicate =
                //     await this.databaseService.orderModel
                //         .findOne({ checkoutRequestId })
                //         .session(session);

                // if (duplicate) {
                //     throw new BadRequestException(
                //         "This checkout is already being processed. Retry the same checkout request.",
                //     );
                // }

                const orderItems: Array<{
                    productId: Types.ObjectId;
                    name: string;
                    sku: string;
                    image: string;
                    price: number;
                    quantity: number;
                    lineTotal: number;
                }> = [];

                subtotalPaise = 0;

                // All inventory changes are rolled back if any database write fails.
                for (const [productId, qty] of quantities.entries()) {
                    const id = new Types.ObjectId(productId);

                    const product =
                        await this.databaseService.productModel.findOneAndUpdate(
                            {
                                _id: id,
                                isActive: true,
                                stock: { $gte: qty },
                            },
                            {
                                $inc: { stock: -qty },
                            },
                            {
                                new: true,
                                session,
                            },
                        );

                    if (!product) {
                        throw new BadRequestException(
                            `Product ${productId} is unavailable or has insufficient stock.`,
                        );
                    }

                    const price = Number(product.price);

                    if (!Number.isFinite(price) || price <= 0) {
                        throw new BadRequestException(
                            `Product ${productId} has an invalid price.`,
                        );
                    }

                    const pricePaise = Math.round(price * 100);
                    const lineTotalPaise = pricePaise * qty;

                    if (!Number.isSafeInteger(lineTotalPaise)) {
                        throw new BadRequestException("Invalid order amount.");
                    }

                    subtotalPaise += lineTotalPaise;

                    if (!Number.isSafeInteger(subtotalPaise)) {
                        throw new BadRequestException("Invalid order subtotal.");
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

                // Five percent prepaid discount, calculated server-side.
                discountPaise = Math.round(subtotalPaise * 0.05);
                totalPaise = subtotalPaise - discountPaise;

                if (totalPaise <= 0) {
                    throw new BadRequestException(
                        "Order total must be greater than zero.",
                    );
                }

                orderNumber = this.generateOrderNumber();

                const [order] = await this.databaseService.orderModel.create(
                    [
                        {
                            checkoutRequestId,
                            orderNumber,
                            userId: userId ? new Types.ObjectId(userId) : null,
                            guestId: guestId || null,
                            customer: {
                                ...customer,
                                email: customer.email.trim().toLowerCase(),
                            },
                            items: orderItems,
                            shippingAddress,
                            billingAddress: billingAddress ?? null,
                            status: OrderStatus.PENDING,
                            paymentMethod: PaymentMethod.RAZORPAY,
                            paymentStatus: PaymentStatus.PENDING,
                            subtotal: subtotalPaise / 100,
                            discount: discountPaise / 100,
                            shippingCharge: 0,
                            total: totalPaise / 100,
                            stockReleased: false,
                            reservationExpiresAt: new Date(
                                Date.now() + this.reservationMinutes * 60 * 1000,
                            ),
                        },
                    ],
                    { session },
                );

                orderId = order._id as Types.ObjectId;

                // Create the payment transaction in the SAME MongoDB transaction.
                // If this write fails, the order and stock changes roll back too.
                const [transaction] = await this.databaseService.transactionModel.create(
                    [
                        {
                            orderId: order._id,
                            userId: order.userId ?? null,
                            guestId: order.guestId ?? null,
                            paymentMethod: TransactionPaymentMethod.RAZORPAY,
                            status: TransactionStatus.PENDING,
                            amount: totalPaise / 100,
                            currency: "INR",
                            gatewayOrderId: null,
                        },
                    ],
                    { session },
                );

                transaction_id = transaction._id;
            });
        } catch (error) {
            console.log(error);

            // withTransaction aborts all order, transaction and stock writes.
            // Never manually increment stock here; MongoDB rolled it back.
            if (
                error instanceof BadRequestException ||
                error instanceof InternalServerErrorException
            ) {
                throw error;
            }

            // Another request may have won the idempotency race.
            const duplicate = await this.databaseService.orderModel.findOne({
                checkoutRequestId,
            });

            if (duplicate) {
                return this.getExistingPayment(duplicate);
            }

            throw new InternalServerErrorException(
                "Checkout could not be saved. No order or stock reservation was committed.",
            );
        } finally {
            await session.endSession();
        }

        if (!orderId) {
            throw new InternalServerErrorException(
                "Order transaction did not complete.",
            );
        }

        // MongoDB is committed at this point. Call Razorpay outside the transaction.
        let razorpayOrder: {
            id: string;
            amount: number;
            currency: string;
            status: string;
        };

        try {
            razorpayOrder = await this.createRazorpayOrder({
                amount: totalPaise,
                receipt: orderNumber,
                orderId: orderId?.toString(),
                orderNumber,
            });
        } catch (e) {

            // Do NOT delete the order or release stock automatically here.
            // A timeout can mean Razorpay created the order but the response was lost.
            // Keep the pending transaction for reconciliation.
            throw new InternalServerErrorException(
                "Payment setup is pending reconciliation. Retry using the same checkoutRequestId.",
            );
        }

        // Persist the Razorpay order ID. If this fails, the external Razorpay order
        // may exist, so keep the database records for reconciliation.
        try {
            const updateResult =
                await this.databaseService.transactionModel.updateOne(
                    {
                        orderId,
                        paymentMethod: TransactionPaymentMethod.RAZORPAY,
                        status: TransactionStatus.PENDING,
                    },
                    {
                        $set: {
                            gatewayOrderId: razorpayOrder.id,
                        },
                    },
                );

            if (updateResult.matchedCount !== 1) {
                throw new Error("Pending transaction was not found.");
            }
        } catch {
            throw new InternalServerErrorException(
                "Payment was created but its status needs reconciliation. Do not start a new checkout.",
            );
        }
        try {
            void this.whatsappService
                .sendOrderReceived({
                    phone: process.env.WHATSAPP_NUMBER!,
                    customerName: customer.firstName,
                    orderNumber,
                    total: totalPaise / 100,
                })
                .catch((error) => {
                    console.error(
                        'Failed to send WhatsApp order notification:',
                        error.response?.data || error.message,
                    );
                });
        } catch (e) {
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
                }
                await this.userService.updateUserAddress(userId, fullAddress)
            }
        } catch (e) {
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


    async processCodOrder(input: CheckoutInput) {
        const {
            checkoutRequestId,
            customer,
            shippingAddress,
            billingAddress,
            userId,
            guestId,
        } = input;

        // 1. Validate checkout
        if (!guestId && !userId) {
            throw new BadRequestException("Invalid user");
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
                }
                await this.userService.updateUserAddress(userId, fullAddress)
            }
        } catch (e) {
            console.log(`error in savin address ${e.message}`);
        }
        if (
            !checkoutRequestId ||
            checkoutRequestId.length > 128 ||
            !Array.isArray(input.items) ||
            input.items.length === 0
        ) {
            throw new BadRequestException(
                "A checkout ID and at least one item are required.",
            );
        }

        if (
            !customer?.firstName?.trim() ||
            !customer?.lastName?.trim() ||
            !customer?.email?.trim() ||
            !customer?.phone?.trim() ||
            !shippingAddress?.address?.trim() ||
            !shippingAddress?.city?.trim() ||
            !shippingAddress?.state?.trim() ||
            !/^\d{6}$/.test(shippingAddress.pincode)
        ) {
            throw new BadRequestException(
                "Please provide valid customer and shipping details.",
            );
        }

        if (userId && !Types.ObjectId.isValid(userId)) {
            throw new BadRequestException("Invalid user ID.");
        }

        // 2. Validate and combine product quantities
        const quantities = new Map<string, number>();

        for (const item of input.items) {
            if (
                !item ||
                !Types.ObjectId.isValid(item.product_id) ||
                !Number.isSafeInteger(item.qty) ||
                item.qty < 1
            ) {
                throw new BadRequestException(
                    "Each item must have a valid product ID and positive integer quantity.",
                );
            }

            const id = item.product_id;
            const combined = (quantities.get(id) ?? 0) + item.qty;

            if (!Number.isSafeInteger(combined)) {
                throw new BadRequestException("Invalid item quantity.");
            }

            quantities.set(id, combined);
        }

        // 3. Prevent duplicate COD checkout
        const existingOrder = await this.databaseService.orderModel.findOne({
            checkoutRequestId,
        });

        if (existingOrder) {
            if (existingOrder.paymentMethod !== PaymentMethod.COD) {
                throw new BadRequestException(
                    "This checkout ID has already been used for another payment method.",
                );
            }



            return {
                orderId: existingOrder._id,
                orderNumber: existingOrder.orderNumber,
                paymentMethod: PaymentMethod.COD,
                subtotal: existingOrder.subtotal,
                discount: existingOrder.discount,
                total: existingOrder.total,
                currency: "INR",
                status: "ORDER_PLACED",
                paymentStatus: existingOrder.paymentStatus,
            };
        }

        // 4. Start MongoDB transaction
        const session =
            await this.databaseService.orderModel.db.startSession();

        let orderId: Types.ObjectId | undefined;
        let transactionId: Types.ObjectId | undefined;
        let orderNumber = "";
        let subtotalPaise = 0;
        let totalPaise = 0;

        try {
            await session.withTransaction(async () => {
                const orderItems: Array<{
                    productId: Types.ObjectId;
                    name: string;
                    sku: string;
                    image: string;
                    price: number;
                    quantity: number;
                    lineTotal: number;
                }> = [];

                subtotalPaise = 0;

                // 5. Reserve stock and calculate prices from database
                for (const [productId, qty] of quantities.entries()) {
                    const id = new Types.ObjectId(productId);

                    const product =
                        await this.databaseService.productModel.findOneAndUpdate(
                            {
                                _id: id,
                                isActive: true,
                                stock: { $gte: qty },
                            },
                            {
                                $inc: { stock: -qty },
                            },
                            {
                                new: true,
                                session,
                            },
                        );

                    if (!product) {
                        throw new BadRequestException(
                            `Product ${productId} is unavailable or has insufficient stock.`,
                        );
                    }

                    const price = Number(product.price);

                    if (!Number.isFinite(price) || price <= 0) {
                        throw new BadRequestException(
                            `Product ${productId} has an invalid price.`,
                        );
                    }

                    const pricePaise = Math.round(price * 100);
                    const lineTotalPaise = pricePaise * qty;

                    if (!Number.isSafeInteger(lineTotalPaise)) {
                        throw new BadRequestException("Invalid order amount.");
                    }

                    subtotalPaise += lineTotalPaise;

                    if (!Number.isSafeInteger(subtotalPaise)) {
                        throw new BadRequestException("Invalid order subtotal.");
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

                // 6. COD is allowed only below ₹3,000
                if (subtotalPaise >= 300000) {
                    throw new BadRequestException(
                        "Cash on Delivery is available only for orders below ₹3,000.",
                    );
                }

                // 7. No online discount for COD
                totalPaise = subtotalPaise;

                if (totalPaise <= 0) {
                    throw new BadRequestException(
                        "Order total must be greater than zero.",
                    );
                }

                orderNumber = this.generateOrderNumber();

                // 8. Create COD order
                const [order] =
                    await this.databaseService.orderModel.create(
                        [
                            {
                                checkoutRequestId,
                                orderNumber,
                                userId: userId
                                    ? new Types.ObjectId(userId)
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

                                status: OrderStatus.PENDING,
                                paymentMethod: PaymentMethod.COD,
                                paymentStatus: PaymentStatus.PENDING,

                                subtotal: subtotalPaise / 100,
                                discount: 0,
                                shippingCharge: 0,
                                total: totalPaise / 100,

                                stockReleased: false,
                                reservationExpiresAt: new Date(
                                    Date.now() +
                                    this.reservationMinutes * 60 * 1000,
                                ),
                            },
                        ],
                        { session },
                    );

                orderId = order._id as Types.ObjectId;

                // 9. Create COD transaction
                const [transaction] =
                    await this.databaseService.transactionModel.create(
                        [
                            {
                                orderId: order._id,
                                userId: order.userId ?? null,
                                guestId: order.guestId ?? null,

                                paymentMethod:
                                    TransactionPaymentMethod.COD,

                                status: TransactionStatus.PENDING,
                                amount: totalPaise / 100,
                                currency: "INR",
                                gatewayOrderId: null,
                            },
                        ],
                        { session },
                    );

                transactionId = transaction._id as Types.ObjectId;
            });
        } catch (error) {
            if (
                error instanceof BadRequestException ||
                error instanceof InternalServerErrorException
            ) {
                throw error;
            }

            // Check if another request created the same checkout.
            const duplicate = await this.databaseService.orderModel.findOne({
                checkoutRequestId,
            });

            if (duplicate?.paymentMethod === PaymentMethod.COD) {
                return {
                    orderId: duplicate._id,
                    orderNumber: duplicate.orderNumber,
                    paymentMethod: PaymentMethod.COD,
                    subtotal: duplicate.subtotal,
                    discount: duplicate.discount,
                    total: duplicate.total,
                    currency: "INR",
                    status: "ORDER_PLACED",
                    paymentStatus: duplicate.paymentStatus,
                };
            }

            console.error("COD order creation failed:", error);

            throw new InternalServerErrorException(
                "COD order could not be created.",
            );
        } finally {
            await session.endSession();
        }

        if (!orderId) {
            throw new InternalServerErrorException(
                "COD order transaction did not complete.",
            );
        }

        // 10. Send WhatsApp notification without blocking checkout

        void this.whatsappService
            .sendCodOrderConfirmation({
                phone: process.env.WHATSAPP_NUMBER!,
                customerName: customer.firstName,
                orderNumber,
                orderId: orderId.toString(),
                total: totalPaise / 100,
            })
            .catch((error) => {
                console.error(
                    "Failed to send COD confirmation:",
                    error.response?.data || error.message,
                );
            });

        // 11. Return COD order details
        return {
            orderId,
            orderNumber,
            transaction_id: transactionId?.toString(),
            paymentMethod: PaymentMethod.COD,
            subtotal: subtotalPaise / 100,
            discount: 0,
            total: totalPaise / 100,
            currency: "INR",
            status: "ORDER_PLACED",
            paymentStatus: PaymentStatus.PENDING,
        };
    }



    private async getExistingPayment(order: any) {
        const transaction =
            await this.databaseService.transactionModel.findOne({
                orderId: order._id,
                paymentMethod: TransactionPaymentMethod.RAZORPAY,
                status: TransactionStatus.PENDING,
                gatewayOrderId: { $ne: null },
            });

        if (
            transaction &&
            order.paymentStatus === PaymentStatus.PENDING &&
            !order.stockReleased &&
            order.reservationExpiresAt &&
            new Date(order.reservationExpiresAt).getTime() > Date.now()
        ) {
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

        throw new BadRequestException(
            "This checkout has already been processed or expired. Start a new checkout.",
        );
    }

    // Verify the Razorpay Checkout signature on the backend.
    verifyPaymentSignature(input: {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
    }): boolean {
        const secret = process.env.RAZORPAY_KEY_SECRET;

        if (!secret) {
            throw new InternalServerErrorException(
                "Razorpay credentials are missing.",
            );
        }

        const expected = createHmac("sha256", secret)
            .update(
                `${input.razorpayOrderId}|${input.razorpayPaymentId}`,
            )
            .digest("hex");

        const a = Buffer.from(expected, "hex");
        const b = Buffer.from(input.razorpaySignature, "hex");

        const { timingSafeEqual } = require("crypto") as typeof import("crypto");

        return (
            a.length === b.length &&
            timingSafeEqual(a, b)
        );
    }

    async checkPaymentStatus(razorpay_order_id: string) {
        try {


            const config = {
                url: `https://api.razorpay.com/v1/orders/${razorpay_order_id}`,
                method: 'get',
                auth: {
                    username: process.env.RAZORPAY_API_KEY!,
                    password: process.env.RAZORPAY_KEY_SECRET!
                },
                headers: {
                    "content-type": "application/json"
                }
            }

            const response = await axios.request(config);
            return response.data;
        } catch (e) {

            return e.response.data;
        }
    }

    async getAllTransactions(query: {
        page?: string;
        limit?: string;
        status?: string;
        paymentMethod?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
    }) {
        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 10);

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            throw new BadRequestException(
                "Page must be positive and limit must be between 1 and 100.",
            );
        }

        const filter: Record<string, any> = {};

        if (query.status) {
            filter.status = query.status;
        }

        if (query.paymentMethod) {
            filter.paymentMethod = query.paymentMethod;
        }

        if (query.startDate || query.endDate) {
            const createdAt: Record<string, Date> = {};

            if (query.startDate) {
                const start = new Date(query.startDate);
                if (Number.isNaN(start.getTime())) {
                    throw new BadRequestException("Invalid startDate.");
                }
                createdAt.$gte = start;
            }

            if (query.endDate) {
                const end = new Date(query.endDate);
                if (Number.isNaN(end.getTime())) {
                    throw new BadRequestException("Invalid endDate.");
                }
                createdAt.$lte = end;
            }

            filter.createdAt = createdAt;
        }

        if (query.search?.trim()) {
            const search = query.search.trim();
            const conditions: Record<string, any>[] = [
                { gatewayOrderId: search },
            ];

            if (Types.ObjectId.isValid(search)) {
                conditions.push({ _id: new Types.ObjectId(search) });
                conditions.push({ orderId: new Types.ObjectId(search) });
            }

            // Search by order number through the related order collection.
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
                    select:
                        "orderNumber customer items subtotal discount shippingCharge total status paymentStatus shippingAddress createdAt",
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

    private escapeRegex(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    async createRefund(paymentId: string, amount?: number) {
        const keyId = process.env.RAZORPAY_API_KEY!;
        const keySecret = process.env.RAZORPAY_KEY_SECRET!;

        const payload: Record<string, any> = {};

        if (amount !== undefined) {
            payload.amount = amount; // Amount in paise
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
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            console.error(
                'Razorpay refund error:',
                error.response?.data || error.message,
            );

            throw new InternalServerErrorException(
                error.response?.data?.error?.description ||
                'Failed to create Razorpay refund',
            );
        }
    }

}
