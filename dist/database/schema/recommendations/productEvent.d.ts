import { HydratedDocument, Types } from 'mongoose';
export type ProductEventDocument = HydratedDocument<ProductEvent>;
export declare enum ProductEventType {
    PRODUCT_VIEWED = "PRODUCT_VIEWED",
    PRODUCT_CLICKED = "PRODUCT_CLICKED",
    ADDED_TO_CART = "ADDED_TO_CART",
    REMOVED_FROM_CART = "REMOVED_FROM_CART",
    PURCHASED = "PURCHASED"
}
export declare enum ProductEventSource {
    PRODUCT_PAGE = "PRODUCT_PAGE",
    CART_PAGE = "CART_PAGE",
    HOME_PAGE = "HOME_PAGE",
    CHECKOUT = "CHECKOUT",
    RECOMMENDATION = "RECOMMENDATION",
    OTHER = "OTHER"
}
export declare class ProductEvent {
    eventId: string;
    productId: Types.ObjectId;
    userId: Types.ObjectId | null;
    sessionId: string | null;
    eventType: ProductEventType;
    source: ProductEventSource;
    orderId: Types.ObjectId | null;
    quantity: number;
    price: number | null;
    recommendedFromProductId: Types.ObjectId | null;
    metadata: Record<string, any>;
}
export declare const ProductEventSchema: import("mongoose").Schema<ProductEvent, import("mongoose").Model<ProductEvent, any, any, any, any, any, ProductEvent & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    eventId?: import("mongoose").SchemaDefinitionProperty<string, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sessionId?: import("mongoose").SchemaDefinitionProperty<string | null, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    eventType?: import("mongoose").SchemaDefinitionProperty<ProductEventType, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<ProductEventSource, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    orderId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number | null, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    recommendedFromProductId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<Record<string, any>, ProductEvent, import("mongoose").Document<unknown, {}, ProductEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, ProductEvent>;
