import { HydratedDocument, Types } from 'mongoose';
export type CartDocument = HydratedDocument<Cart>;
export declare enum CartStatus {
    ACTIVE = "active",
    CONVERTED = "converted",
    ABANDONED = "abandoned"
}
export declare class CartItem {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
}
export declare const CartItemSchema: import("mongoose").Schema<CartItem, import("mongoose").Model<CartItem, any, any, any, any, any, CartItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CartItem, import("mongoose").Document<unknown, {}, CartItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, CartItem, import("mongoose").Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, CartItem, import("mongoose").Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, CartItem, import("mongoose").Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, CartItem>;
export declare class CartCustomer {
    name: string | null;
    email: string | null;
    phone: string | null;
}
export declare const CartCustomerSchema: import("mongoose").Schema<CartCustomer, import("mongoose").Model<CartCustomer, any, any, any, any, any, CartCustomer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CartCustomer, import("mongoose").Document<unknown, {}, CartCustomer, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CartCustomer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string | null, CartCustomer, import("mongoose").Document<unknown, {}, CartCustomer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartCustomer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string | null, CartCustomer, import("mongoose").Document<unknown, {}, CartCustomer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartCustomer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string | null, CartCustomer, import("mongoose").Document<unknown, {}, CartCustomer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartCustomer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, CartCustomer>;
export declare class Cart {
    userId: Types.ObjectId | null;
    guestId: string | null;
    customer: CartCustomer;
    items: CartItem[];
    status: CartStatus;
    lastActivityAt: Date;
}
export declare const CartSchema: import("mongoose").Schema<Cart, import("mongoose").Model<Cart, any, any, any, any, any, Cart & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, import("mongoose").Document<unknown, {}, Cart, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, Cart, import("mongoose").Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    guestId?: import("mongoose").SchemaDefinitionProperty<string | null, Cart, import("mongoose").Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customer?: import("mongoose").SchemaDefinitionProperty<CartCustomer, Cart, import("mongoose").Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<CartItem[], Cart, import("mongoose").Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<CartStatus, Cart, import("mongoose").Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lastActivityAt?: import("mongoose").SchemaDefinitionProperty<Date, Cart, import("mongoose").Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Cart>;
