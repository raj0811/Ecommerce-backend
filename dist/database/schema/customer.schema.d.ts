import { HydratedDocument, Types } from 'mongoose';
export type CustomerDocument = HydratedDocument<Customer>;
export declare class CustomerAddress {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}
export declare const CustomerAddressSchema: import("mongoose").Schema<CustomerAddress, import("mongoose").Model<CustomerAddress, any, any, any, any, any, CustomerAddress & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CustomerAddress, import("mongoose").Document<unknown, {}, CustomerAddress, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CustomerAddress & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    fullName?: import("mongoose").SchemaDefinitionProperty<string, CustomerAddress, import("mongoose").Document<unknown, {}, CustomerAddress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomerAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, CustomerAddress, import("mongoose").Document<unknown, {}, CustomerAddress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomerAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    addressLine1?: import("mongoose").SchemaDefinitionProperty<string, CustomerAddress, import("mongoose").Document<unknown, {}, CustomerAddress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomerAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    addressLine2?: import("mongoose").SchemaDefinitionProperty<string | undefined, CustomerAddress, import("mongoose").Document<unknown, {}, CustomerAddress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomerAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    city?: import("mongoose").SchemaDefinitionProperty<string, CustomerAddress, import("mongoose").Document<unknown, {}, CustomerAddress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomerAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    state?: import("mongoose").SchemaDefinitionProperty<string, CustomerAddress, import("mongoose").Document<unknown, {}, CustomerAddress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomerAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    pincode?: import("mongoose").SchemaDefinitionProperty<string, CustomerAddress, import("mongoose").Document<unknown, {}, CustomerAddress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomerAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isDefault?: import("mongoose").SchemaDefinitionProperty<boolean, CustomerAddress, import("mongoose").Document<unknown, {}, CustomerAddress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomerAddress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, CustomerAddress>;
export declare class CustomerUtm {
    source?: string;
    medium?: string;
    campaign?: string;
}
export declare const CustomerUtmSchema: import("mongoose").Schema<CustomerUtm, import("mongoose").Model<CustomerUtm, any, any, any, any, any, CustomerUtm & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CustomerUtm, import("mongoose").Document<unknown, {}, CustomerUtm, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CustomerUtm & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    source?: import("mongoose").SchemaDefinitionProperty<string | undefined, CustomerUtm, import("mongoose").Document<unknown, {}, CustomerUtm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomerUtm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    medium?: import("mongoose").SchemaDefinitionProperty<string | undefined, CustomerUtm, import("mongoose").Document<unknown, {}, CustomerUtm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomerUtm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    campaign?: import("mongoose").SchemaDefinitionProperty<string | undefined, CustomerUtm, import("mongoose").Document<unknown, {}, CustomerUtm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomerUtm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, CustomerUtm>;
export declare class Customer {
    userId?: Types.ObjectId;
    name: string;
    phone: string;
    email?: string;
    addresses: CustomerAddress[];
    firstUtm?: CustomerUtm;
    tags: string[];
    teamNotes: string[];
    totalSpent: number;
    totalOrders: number;
}
export declare const CustomerSchema: import("mongoose").Schema<Customer, import("mongoose").Model<Customer, any, any, any, any, any, Customer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Customer, import("mongoose").Document<unknown, {}, Customer, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Customer, import("mongoose").Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Customer, import("mongoose").Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Customer, import("mongoose").Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string | undefined, Customer, import("mongoose").Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    addresses?: import("mongoose").SchemaDefinitionProperty<CustomerAddress[], Customer, import("mongoose").Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    firstUtm?: import("mongoose").SchemaDefinitionProperty<CustomerUtm | undefined, Customer, import("mongoose").Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[], Customer, import("mongoose").Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    teamNotes?: import("mongoose").SchemaDefinitionProperty<string[], Customer, import("mongoose").Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalSpent?: import("mongoose").SchemaDefinitionProperty<number, Customer, import("mongoose").Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalOrders?: import("mongoose").SchemaDefinitionProperty<number, Customer, import("mongoose").Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Customer>;
