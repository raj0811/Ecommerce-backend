import { Schema as MongooseSchema, HydratedDocument, Types } from 'mongoose';
export type LandingPageDocument = HydratedDocument<LandingPage>;
export declare class LandingPageContent {
    heading?: string;
    tagline?: string;
    description?: string;
    subheading?: string;
    ctaText?: string;
    ctaLink?: string;
    highlights: string[];
    benefits: string[];
    heroImage?: string;
    bannerImage?: string;
}
export declare const LandingPageContentSchema: MongooseSchema<LandingPageContent, import("mongoose").Model<LandingPageContent, any, any, any, any, any, LandingPageContent & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LandingPageContent, import("mongoose").Document<unknown, {}, LandingPageContent, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageContent & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    heading?: import("mongoose").SchemaDefinitionProperty<string | undefined, LandingPageContent, import("mongoose").Document<unknown, {}, LandingPageContent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageContent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    tagline?: import("mongoose").SchemaDefinitionProperty<string | undefined, LandingPageContent, import("mongoose").Document<unknown, {}, LandingPageContent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageContent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, LandingPageContent, import("mongoose").Document<unknown, {}, LandingPageContent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageContent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    subheading?: import("mongoose").SchemaDefinitionProperty<string | undefined, LandingPageContent, import("mongoose").Document<unknown, {}, LandingPageContent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageContent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    ctaText?: import("mongoose").SchemaDefinitionProperty<string | undefined, LandingPageContent, import("mongoose").Document<unknown, {}, LandingPageContent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageContent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    ctaLink?: import("mongoose").SchemaDefinitionProperty<string | undefined, LandingPageContent, import("mongoose").Document<unknown, {}, LandingPageContent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageContent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    highlights?: import("mongoose").SchemaDefinitionProperty<string[], LandingPageContent, import("mongoose").Document<unknown, {}, LandingPageContent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageContent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    benefits?: import("mongoose").SchemaDefinitionProperty<string[], LandingPageContent, import("mongoose").Document<unknown, {}, LandingPageContent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageContent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    heroImage?: import("mongoose").SchemaDefinitionProperty<string | undefined, LandingPageContent, import("mongoose").Document<unknown, {}, LandingPageContent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageContent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    bannerImage?: import("mongoose").SchemaDefinitionProperty<string | undefined, LandingPageContent, import("mongoose").Document<unknown, {}, LandingPageContent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageContent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, LandingPageContent>;
export declare class LandingPageSeo {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    keywords: string[];
}
export declare const LandingPageSeoSchema: MongooseSchema<LandingPageSeo, import("mongoose").Model<LandingPageSeo, any, any, any, any, any, LandingPageSeo & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LandingPageSeo, import("mongoose").Document<unknown, {}, LandingPageSeo, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageSeo & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    metaTitle?: import("mongoose").SchemaDefinitionProperty<string | undefined, LandingPageSeo, import("mongoose").Document<unknown, {}, LandingPageSeo, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageSeo & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    metaDescription?: import("mongoose").SchemaDefinitionProperty<string | undefined, LandingPageSeo, import("mongoose").Document<unknown, {}, LandingPageSeo, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageSeo & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    ogImage?: import("mongoose").SchemaDefinitionProperty<string | undefined, LandingPageSeo, import("mongoose").Document<unknown, {}, LandingPageSeo, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageSeo & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    keywords?: import("mongoose").SchemaDefinitionProperty<string[], LandingPageSeo, import("mongoose").Document<unknown, {}, LandingPageSeo, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPageSeo & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, LandingPageSeo>;
export declare class LandingPage {
    slug: string;
    title: string;
    productId: Types.ObjectId | null;
    content: LandingPageContent;
    isPublished: boolean;
    isDeleted: boolean;
    sections: Record<string, any>[];
    seo: LandingPageSeo;
}
export declare const LandingPageSchema: MongooseSchema<LandingPage, import("mongoose").Model<LandingPage, any, any, any, any, any, LandingPage & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LandingPage, import("mongoose").Document<unknown, {}, LandingPage, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<LandingPage & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    slug?: import("mongoose").SchemaDefinitionProperty<string, LandingPage, import("mongoose").Document<unknown, {}, LandingPage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, LandingPage, import("mongoose").Document<unknown, {}, LandingPage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, LandingPage, import("mongoose").Document<unknown, {}, LandingPage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<LandingPageContent, LandingPage, import("mongoose").Document<unknown, {}, LandingPage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isPublished?: import("mongoose").SchemaDefinitionProperty<boolean, LandingPage, import("mongoose").Document<unknown, {}, LandingPage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isDeleted?: import("mongoose").SchemaDefinitionProperty<boolean, LandingPage, import("mongoose").Document<unknown, {}, LandingPage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sections?: import("mongoose").SchemaDefinitionProperty<Record<string, any>[], LandingPage, import("mongoose").Document<unknown, {}, LandingPage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    seo?: import("mongoose").SchemaDefinitionProperty<LandingPageSeo, LandingPage, import("mongoose").Document<unknown, {}, LandingPage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LandingPage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, LandingPage>;
