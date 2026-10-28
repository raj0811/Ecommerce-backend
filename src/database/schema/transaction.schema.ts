
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionPaymentMethod {
    RAZORPAY = "RAZORPAY",
    COD = "COD",
}

export enum TransactionStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

@Schema({ timestamps: true, collection: "transactions" })
export class Transaction {



    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true,
    })
    orderId: Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    })
    userId: Types.ObjectId | null;

    @Prop({
        type: String,
        default: null,
        index: true,
    })
    guestId: string | null;

    @Prop({
        type: String,
        enum: Object.values(TransactionPaymentMethod),
        required: true,
    })
    paymentMethod: TransactionPaymentMethod;

    @Prop({
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.PENDING,
        index: true,
    })
    status: TransactionStatus;

    @Prop({
        type: Number,
        required: true,
        min: 0,
    })
    amount: number;

    @Prop({
        type: String,
        default: "INR",
        uppercase: true,
    })
    currency: string;

    // Razorpay order ID
    @Prop({
        type: String,
        default: null,
        index: true,
    })
    gatewayOrderId: string | null;

    // Razorpay payment ID
    @Prop({
        type: String,
        default: null,
        index: true,
    })
    gatewayPaymentId: string | null;

    // Store only after successful server-side signature verification.
    @Prop({
        type: String,
        default: null,
        select: false,
    })
    gatewaySignature: string | null;

    @Prop({
        type: String,
        default: null,
    })
    failureReason: string | null;

    @Prop({
        type: String,
        default: null,
    })
    gatewayRefundId: string | null;

    @Prop({
        type: Number,
        default: 0,
        min: 0,
    })
    refundedAmount: number;

    @Prop({
        type: Date,
        default: null,
    })
    paidAt: Date | null;

    @Prop({
        type: Date,
        default: null,
    })
    refundedAt: Date | null;

    @Prop({
        type: String,
        default: null,
    })
    notes: string | null;
}

export const TransactionSchema =
    SchemaFactory.createForClass(Transaction);

// Useful for displaying an order's payment history.
TransactionSchema.index({ orderId: 1, createdAt: -1 });

// Useful for customer transaction history.
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ guestId: 1, createdAt: -1 });

