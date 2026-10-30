import mongoose, { HydratedDocument, Types } from "mongoose";
export type OrderDocument = HydratedDocument<Order>;
export declare enum OrderStatus {
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
    REFUND_INITIATED = "REFUND_INITIATED"
}
export declare enum PaymentMethod {
    COD = "COD",
    RAZORPAY = "RAZORPAY"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUND_INITIATED = "REFUND_INITIATED",
    REFUNDED = "REFUNDED"
}
export declare class OrderItem {
    productId: Types.ObjectId;
    name: string;
    sku: string;
    image: string;
    price: number;
    quantity: number;
    lineTotal: number;
}
export declare const OrderItemSchema: mongoose.Schema<OrderItem, mongoose.Model<OrderItem, any, any, any, any, any, OrderItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, OrderItem, mongoose.Document<unknown, {}, OrderItem, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<OrderItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    productId?: mongoose.SchemaDefinitionProperty<Types.ObjectId, OrderItem, mongoose.Document<unknown, {}, OrderItem, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: mongoose.SchemaDefinitionProperty<string, OrderItem, mongoose.Document<unknown, {}, OrderItem, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sku?: mongoose.SchemaDefinitionProperty<string, OrderItem, mongoose.Document<unknown, {}, OrderItem, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    image?: mongoose.SchemaDefinitionProperty<string, OrderItem, mongoose.Document<unknown, {}, OrderItem, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    price?: mongoose.SchemaDefinitionProperty<number, OrderItem, mongoose.Document<unknown, {}, OrderItem, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    quantity?: mongoose.SchemaDefinitionProperty<number, OrderItem, mongoose.Document<unknown, {}, OrderItem, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lineTotal?: mongoose.SchemaDefinitionProperty<number, OrderItem, mongoose.Document<unknown, {}, OrderItem, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, OrderItem>;
export declare class OrderAddress {
    address: string;
    apartment: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}
export declare const OrderAddressSchema: mongoose.Schema<OrderAddress, mongoose.Model<OrderAddress, any, any, any, any, any, OrderAddress & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, OrderAddress, mongoose.Document<unknown, {}, OrderAddress, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<OrderAddress & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    address?: mongoose.SchemaDefinitionProperty<string, OrderAddress, mongoose.Document<unknown, {}, OrderAddress, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    apartment?: mongoose.SchemaDefinitionProperty<string, OrderAddress, mongoose.Document<unknown, {}, OrderAddress, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    city?: mongoose.SchemaDefinitionProperty<string, OrderAddress, mongoose.Document<unknown, {}, OrderAddress, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    state?: mongoose.SchemaDefinitionProperty<string, OrderAddress, mongoose.Document<unknown, {}, OrderAddress, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    pincode?: mongoose.SchemaDefinitionProperty<string, OrderAddress, mongoose.Document<unknown, {}, OrderAddress, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    country?: mongoose.SchemaDefinitionProperty<string, OrderAddress, mongoose.Document<unknown, {}, OrderAddress, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, OrderAddress>;
export declare class OrderCustomer {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}
export declare const OrderCustomerSchema: mongoose.Schema<OrderCustomer, mongoose.Model<OrderCustomer, any, any, any, any, any, OrderCustomer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, OrderCustomer, mongoose.Document<unknown, {}, OrderCustomer, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<OrderCustomer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    firstName?: mongoose.SchemaDefinitionProperty<string, OrderCustomer, mongoose.Document<unknown, {}, OrderCustomer, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderCustomer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lastName?: mongoose.SchemaDefinitionProperty<string, OrderCustomer, mongoose.Document<unknown, {}, OrderCustomer, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderCustomer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: mongoose.SchemaDefinitionProperty<string, OrderCustomer, mongoose.Document<unknown, {}, OrderCustomer, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderCustomer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    phone?: mongoose.SchemaDefinitionProperty<string, OrderCustomer, mongoose.Document<unknown, {}, OrderCustomer, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<OrderCustomer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, OrderCustomer>;
export declare class ShipmentScan {
    date: string;
    activity: string;
    location: string;
}
export declare const ShipmentScanSchema: mongoose.Schema<ShipmentScan, mongoose.Model<ShipmentScan, any, any, any, any, any, ShipmentScan & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ShipmentScan, mongoose.Document<unknown, {}, ShipmentScan, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<ShipmentScan & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    date?: mongoose.SchemaDefinitionProperty<string, ShipmentScan, mongoose.Document<unknown, {}, ShipmentScan, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ShipmentScan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    activity?: mongoose.SchemaDefinitionProperty<string, ShipmentScan, mongoose.Document<unknown, {}, ShipmentScan, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ShipmentScan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    location?: mongoose.SchemaDefinitionProperty<string, ShipmentScan, mongoose.Document<unknown, {}, ShipmentScan, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<ShipmentScan & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, ShipmentScan>;
export declare class Order {
    orderNumber: string;
    userId: Types.ObjectId | null;
    guestId: string | null;
    customer: OrderCustomer;
    items: OrderItem[];
    shippingAddress: OrderAddress;
    billingAddress: OrderAddress | null;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    subtotal: number;
    discount: number;
    shippingCharge: number;
    total: number;
    paymentOrderId: string | null;
    paymentId: string | null;
    trackingNumber: string | null;
    awb: string | null;
    shiprocketOrderId: string | null;
    shipmentCurrentStatus: string | null;
    shipmentStatus: string | null;
    shipmentStatusId: number | null;
    courierName: string | null;
    shipmentEtd: Date | null;
    shipmentCurrentTimestamp: Date | null;
    shipmentScans: ShipmentScan[];
    deliveredAt: Date | null;
    cancelledAt: Date | null;
    checkoutRequestId: string;
    stockReleased: boolean;
    reservationExpiresAt: Date | null;
    refundAmount: number;
    razorpayRefundId: string | null;
    refundInitiatedAt: Date | null;
    refundGatewayStatus: string | null;
}
export declare const OrderSchema: mongoose.Schema<Order, mongoose.Model<Order, any, any, any, any, any, Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Order, mongoose.Document<unknown, {}, Order, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, {
    orderNumber?: mongoose.SchemaDefinitionProperty<string, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: mongoose.SchemaDefinitionProperty<Types.ObjectId | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    guestId?: mongoose.SchemaDefinitionProperty<string | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customer?: mongoose.SchemaDefinitionProperty<OrderCustomer, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    items?: mongoose.SchemaDefinitionProperty<OrderItem[], Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shippingAddress?: mongoose.SchemaDefinitionProperty<OrderAddress, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    billingAddress?: mongoose.SchemaDefinitionProperty<OrderAddress | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: mongoose.SchemaDefinitionProperty<OrderStatus, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentMethod?: mongoose.SchemaDefinitionProperty<PaymentMethod, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentStatus?: mongoose.SchemaDefinitionProperty<PaymentStatus, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    subtotal?: mongoose.SchemaDefinitionProperty<number, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    discount?: mongoose.SchemaDefinitionProperty<number, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shippingCharge?: mongoose.SchemaDefinitionProperty<number, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    total?: mongoose.SchemaDefinitionProperty<number, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentOrderId?: mongoose.SchemaDefinitionProperty<string | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    paymentId?: mongoose.SchemaDefinitionProperty<string | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    trackingNumber?: mongoose.SchemaDefinitionProperty<string | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    awb?: mongoose.SchemaDefinitionProperty<string | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shiprocketOrderId?: mongoose.SchemaDefinitionProperty<string | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shipmentCurrentStatus?: mongoose.SchemaDefinitionProperty<string | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shipmentStatus?: mongoose.SchemaDefinitionProperty<string | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shipmentStatusId?: mongoose.SchemaDefinitionProperty<number | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    courierName?: mongoose.SchemaDefinitionProperty<string | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shipmentEtd?: mongoose.SchemaDefinitionProperty<Date | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shipmentCurrentTimestamp?: mongoose.SchemaDefinitionProperty<Date | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    shipmentScans?: mongoose.SchemaDefinitionProperty<ShipmentScan[], Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    deliveredAt?: mongoose.SchemaDefinitionProperty<Date | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    cancelledAt?: mongoose.SchemaDefinitionProperty<Date | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    checkoutRequestId?: mongoose.SchemaDefinitionProperty<string, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    stockReleased?: mongoose.SchemaDefinitionProperty<boolean, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    reservationExpiresAt?: mongoose.SchemaDefinitionProperty<Date | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    refundAmount?: mongoose.SchemaDefinitionProperty<number, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    razorpayRefundId?: mongoose.SchemaDefinitionProperty<string | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    refundInitiatedAt?: mongoose.SchemaDefinitionProperty<Date | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    refundGatewayStatus?: mongoose.SchemaDefinitionProperty<string | null, Order, mongoose.Document<unknown, {}, Order, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & mongoose.HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Order>;
