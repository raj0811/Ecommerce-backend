import { Types, HydratedDocument } from 'mongoose';
export type ProcessedRecommendationOrderDocument = HydratedDocument<ProcessedRecommendationOrder>;
export declare class ProcessedRecommendationOrder {
    orderId: Types.ObjectId;
    recommendationType: string;
}
export declare const ProcessedRecommendationOrderSchema: import("mongoose").Schema<ProcessedRecommendationOrder, import("mongoose").Model<ProcessedRecommendationOrder, any, any, any, any, any, ProcessedRecommendationOrder & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProcessedRecommendationOrder, import("mongoose").Document<unknown, {}, ProcessedRecommendationOrder, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ProcessedRecommendationOrder & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    orderId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ProcessedRecommendationOrder, import("mongoose").Document<unknown, {}, ProcessedRecommendationOrder, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProcessedRecommendationOrder & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    recommendationType?: import("mongoose").SchemaDefinitionProperty<string, ProcessedRecommendationOrder, import("mongoose").Document<unknown, {}, ProcessedRecommendationOrder, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProcessedRecommendationOrder & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, ProcessedRecommendationOrder>;
