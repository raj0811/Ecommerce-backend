
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type ProcessedRecommendationOrderDocument =
    HydratedDocument<ProcessedRecommendationOrder>;

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'processed_recommendation_orders',
})
export class ProcessedRecommendationOrder {
    @Prop({
        type: Types.ObjectId,
        required: true,
    })
    orderId: Types.ObjectId;

    @Prop({
        type: String,
        required: true,
    })
    recommendationType: string;
}

export const ProcessedRecommendationOrderSchema =
    SchemaFactory.createForClass(ProcessedRecommendationOrder);

ProcessedRecommendationOrderSchema.index(
    {
        orderId: 1,
        recommendationType: 1,
    },
    {
        unique: true,
    },
);
