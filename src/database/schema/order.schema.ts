
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
    CANCELLATION_REQUESTED = "CANCELLATION_REQUESTED",
    RETURN_REQUESTED = "RETURN_REQUESTED",
    RETURN_INITIATED = "RETURN_INITIATED",
    RETURNED = "RETURNED",
    COD_INITIATED = "COD_INITIATED",
    REFUND_INITIATED = "REFUND_INITIATED",
}

export enum PaymentMethod {
    COD = "COD",
    RAZORPAY = "RAZORPAY",
}

export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUND_INITIATED = "REFUND_INITIATED",
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

    @Prop({ type: String, required: true, trim: true })
    name: string;

    @Prop({ type: String, default: "" })
    sku: string;

    @Prop({ type: String, default: "" })
    image: string;

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

// Individual tracking scan received from Shiprocket.
@Schema({ _id: false })
export class ShipmentScan {
    @Prop({ type: String, required: true })
    date: string;

    @Prop({ type: String, required: true })
    activity: string;

    @Prop({ type: String, default: "" })
    location: string;
}

export const ShipmentScanSchema =
    SchemaFactory.createForClass(ShipmentScan);

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

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    })
    userId: Types.ObjectId | null;

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

    // Existing generic tracking number.
    @Prop({ type: String, default: null, index: true })
    trackingNumber: string | null;

    // Shiprocket shipment information.
    @Prop({ type: String, default: null, index: true })
    awb: string | null;

    @Prop({ type: String, default: null, index: true })
    shiprocketOrderId: string | null;

    @Prop({ type: String, default: null })
    shipmentCurrentStatus: string | null;

    @Prop({ type: String, default: null })
    shipmentStatus: string | null;

    @Prop({ type: Number, default: null })
    shipmentStatusId: number | null;

    @Prop({ type: String, default: null })
    courierName: string | null;

    @Prop({ type: Date, default: null })
    shipmentEtd: Date | null;

    @Prop({ type: Date, default: null })
    shipmentCurrentTimestamp: Date | null;

    @Prop({
        type: [ShipmentScanSchema],
        default: [],
    })
    shipmentScans: ShipmentScan[];

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

    @Prop({ type: Number, default: 0, min: 0 })
    refundAmount: number;

    @Prop({ type: String, default: null })
    razorpayRefundId: string | null;

    @Prop({ type: Date, default: null })
    refundInitiatedAt: Date | null;

    @Prop({ type: String, default: null })
    refundGatewayStatus: string | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ guestId: 1, createdAt: -1 });
OrderSchema.index({ "customer.email": 1, createdAt: -1 });
OrderSchema.index({ "customer.phone": 1, createdAt: -1 });
