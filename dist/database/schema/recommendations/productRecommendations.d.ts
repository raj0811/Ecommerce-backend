import { HydratedDocument, Types } from 'mongoose';
export type ProductRecommendationDocument = HydratedDocument<ProductRecommendation>;
export declare enum RecommendationType {
    FREQUENTLY_BOUGHT_TOGETHER = "FREQUENTLY_BOUGHT_TOGETHER",
    CUSTOMERS_ALSO_VIEWED = "CUSTOMERS_ALSO_VIEWED",
    SIMILAR_PRODUCTS = "SIMILAR_PRODUCTS",
    ALSO_BOUGHT = "ALSO_BOUGHT"
}
export declare class RecommendedProduct {
    productId: Types.ObjectId;
    score: number;
    purchaseCount: number;
    confidence: number;
    lift: number;
}
export declare class ProductRecommendation {
    productId: Types.ObjectId;
    type: RecommendationType;
    recommendations: RecommendedProduct[];
    sourceCount: number;
    algorithmVersion: number;
    generatedAt: Date;
}
export declare const ProductRecommendationSchema: import("mongoose").Schema<ProductRecommendation, import("mongoose").Model<ProductRecommendation, any, any, any, any, any, ProductRecommendation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductRecommendation, import("mongoose").Document<unknown, {}, ProductRecommendation, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ProductRecommendation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ProductRecommendation, import("mongoose").Document<unknown, {}, ProductRecommendation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductRecommendation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<RecommendationType, ProductRecommendation, import("mongoose").Document<unknown, {}, ProductRecommendation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductRecommendation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    recommendations?: import("mongoose").SchemaDefinitionProperty<RecommendedProduct[], ProductRecommendation, import("mongoose").Document<unknown, {}, ProductRecommendation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductRecommendation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sourceCount?: import("mongoose").SchemaDefinitionProperty<number, ProductRecommendation, import("mongoose").Document<unknown, {}, ProductRecommendation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductRecommendation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    algorithmVersion?: import("mongoose").SchemaDefinitionProperty<number, ProductRecommendation, import("mongoose").Document<unknown, {}, ProductRecommendation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductRecommendation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    generatedAt?: import("mongoose").SchemaDefinitionProperty<Date, ProductRecommendation, import("mongoose").Document<unknown, {}, ProductRecommendation, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductRecommendation & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, ProductRecommendation>;
