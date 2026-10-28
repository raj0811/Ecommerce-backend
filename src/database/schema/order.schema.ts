
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
    COD = "COD",
    RAZORPAY = "RAZORPAY",
}

export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
}

@Schema({ _id: false })
export class OrderItem {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    })
    productId: Types.ObjectId;

    // Product details are snapshotted so order history remains accurate.
    @Prop({ type: String, required: true, trim: true })
    name: string;

    @Prop({ type: String, default: "" })
    sku: string;

    @Prop({ type: String, default: "" })
    image: string;

    // Price at the time the order is created, calculated by the backend.
    @Prop({ type: Number, required: true, min: 0 })
    price: number;

    @Prop({ type: Number, required: true, min: 1 })
    quantity: number;

    @Prop({ type: Number, required: true, min: 0 })
    lineTotal: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class OrderAddress {
    @Prop({ type: String, required: true, trim: true })
    address: string;

    @Prop({ type: String, default: "" })
    apartment: string;

    @Prop({ type: String, required: true, trim: true })
    city: string;

    @Prop({ type: String, required: true, trim: true })
    state: string;

    @Prop({ type: String, required: true, trim: true })
    pincode: string;

    @Prop({ type: String, default: "India" })
    country: string;
}

export const OrderAddressSchema =
    SchemaFactory.createForClass(OrderAddress);

@Schema({ _id: false })
export class OrderCustomer {
    @Prop({ type: String, required: true, trim: true })
    firstName: string;

    @Prop({ type: String, required: true, trim: true })
    lastName: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    })
    email: string;

    @Prop({ type: String, required: true, trim: true })
    phone: string;
}

export const OrderCustomerSchema =
    SchemaFactory.createForClass(OrderCustomer);

@Schema({
    timestamps: true,
    collection: "orders",
})
export class Order {
    @Prop({
        type: String,
        required: true,
        unique: true,
        index: true,
    })
    orderNumber: string;

    // Set when the customer is logged in.
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    })
    userId: Types.ObjectId | null;

    // Set for guest checkout and guest order lookup.
    @Prop({ type: String, default: null, index: true })
    guestId: string | null;

    @Prop({ type: OrderCustomerSchema, required: true })
    customer: OrderCustomer;

    @Prop({
        type: [OrderItemSchema],
        required: true,
        validate: {
            validator: (items: OrderItem[]) =>
                Array.isArray(items) && items.length > 0,
            message: "An order must contain at least one item.",
        },
    })
    items: OrderItem[];

    @Prop({ type: OrderAddressSchema, required: true })
    shippingAddress: OrderAddress;

    @Prop({ type: OrderAddressSchema, default: null })
    billingAddress: OrderAddress | null;

    @Prop({
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING,
        index: true,
    })
    status: OrderStatus;

    @Prop({
        type: String,
        enum: Object.values(PaymentMethod),
        required: true,
    })
    paymentMethod: PaymentMethod;

    @Prop({
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
    })
    paymentStatus: PaymentStatus;

    // All monetary values are calculated and validated by the backend.
    @Prop({ type: Number, required: true, min: 0 })
    subtotal: number;

    @Prop({ type: Number, default: 0, min: 0 })
    discount: number;

    @Prop({ type: Number, default: 0, min: 0 })
    shippingCharge: number;

    @Prop({ type: Number, required: true, min: 0 })
    total: number;

    @Prop({ type: String, default: null })
    paymentOrderId: string | null;

    @Prop({ type: String, default: null })
    paymentId: string | null;

    @Prop({ type: String, default: null })
    trackingNumber: string | null;

    @Prop({ type: Date, default: null })
    deliveredAt: Date | null;

    @Prop({ type: Date, default: null })
    cancelledAt: Date | null;

    @Prop({ type: String, required: true })
    checkoutRequestId: string;

    @Prop({ type: Boolean, default: false })
    stockReleased: boolean;

    @Prop({ type: Date, default: null })
    reservationExpiresAt: Date | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ guestId: 1, createdAt: -1 });
OrderSchema.index({ "customer.email": 1, createdAt: -1 });
OrderSchema.index({ "customer.phone": 1, createdAt: -1 });
