import mongoose, { HydratedDocument, Types } from "mongoose";
export type TransactionDocument = HydratedDocument<Transaction>;
export declare enum TransactionPaymentMethod {
    RAZORPAY = "RAZORPAY",
    COD = "COD"
}
export declare enum TransactionStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
    REFUND_INITIATED = "REFUND_INITIATED"
}
export declare class Transaction {
    orderId: Types.ObjectId;
    userId: Types.ObjectId | null;
    guestId: string | null;
    paymentMethod: TransactionPaymentMethod;
    status: TransactionStatus;
    amount: number;
    currency: string;
    gatewayOrderId: string | null;
    gatewayPaymentId: string | null;
    gatewaySignature: string | null;
    failureReason: string | null;
    gatewayRefundId: string | null;
    refundedAmount: number;
    paidAt: Date | null;
    refundedAt: Date | null;
    notes: string | null;
}
export declare const TransactionSchema: mongoose.Schema<Transaction, mongoose.Model<Transaction, any, any, any, any, any, Transaction & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Transaction, mongoose.Document<unknown, {}, Transaction, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    orderId?: mongoose.SchemaDefinitionProperty<Types.ObjectId, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: mongoose.SchemaDefinitionProperty<Types.ObjectId | null, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    guestId?: mongoose.SchemaDefinitionProperty<string | null, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentMethod?: mongoose.SchemaDefinitionProperty<TransactionPaymentMethod, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: mongoose.SchemaDefinitionProperty<TransactionStatus, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    amount?: mongoose.SchemaDefinitionProperty<number, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    currency?: mongoose.SchemaDefinitionProperty<string, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gatewayOrderId?: mongoose.SchemaDefinitionProperty<string | null, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gatewayPaymentId?: mongoose.SchemaDefinitionProperty<string | null, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gatewaySignature?: mongoose.SchemaDefinitionProperty<string | null, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    failureReason?: mongoose.SchemaDefinitionProperty<string | null, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    gatewayRefundId?: mongoose.SchemaDefinitionProperty<string | null, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    refundedAmount?: mongoose.SchemaDefinitionProperty<number, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paidAt?: mongoose.SchemaDefinitionProperty<Date | null, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    refundedAt?: mongoose.SchemaDefinitionProperty<Date | null, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    notes?: mongoose.SchemaDefinitionProperty<string | null, Transaction, mongoose.Document<unknown, {}, Transaction, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Transaction>;
