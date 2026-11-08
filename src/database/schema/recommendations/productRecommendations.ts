
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductRecommendationDocument =
    HydratedDocument<ProductRecommendation>;

export enum RecommendationType {
    FREQUENTLY_BOUGHT_TOGETHER =
    'FREQUENTLY_BOUGHT_TOGETHER',

    CUSTOMERS_ALSO_VIEWED =
    'CUSTOMERS_ALSO_VIEWED',

    SIMILAR_PRODUCTS =
    'SIMILAR_PRODUCTS',

    ALSO_BOUGHT =
    'ALSO_BOUGHT',
}

@Schema({
    _id: false,
})
export class RecommendedProduct {
    @Prop({
        type: Types.ObjectId,
        ref: 'Product',
        required: true,
    })
    productId: Types.ObjectId;

    // Overall recommendation ranking score
    @Prop({
        type: Number,
        required: true,
        min: 0,
    })
    score: number;

    // Number of orders in which both products appeared
    @Prop({
        type: Number,
        default: 0,
        min: 0,
    })
    purchaseCount: number;

    // Confidence: P(recommended product | source product)
    @Prop({
        type: Number,
        default: 0,
        min: 0,
    })
    confidence: number;

    // Association strength relative to chance
    @Prop({
        type: Number,
        default: 0,
        min: 0,
    })
    lift: number;
}

@Schema({
    timestamps: true,
    versionKey: false,
    collection: 'product_recommendations',
})
export class ProductRecommendation {
    @Prop({
        type: Types.ObjectId,
        ref: 'Product',
        required: true,
    })
    productId: Types.ObjectId;

    @Prop({
        type: String,
        enum: RecommendationType,
        required: true,
    })
    type: RecommendationType;

    @Prop({
        type: [RecommendedProduct],
        default: [],
    })
    recommendations: RecommendedProduct[];

    // Number of source orders/events used to generate this record
    @Prop({
        type: Number,
        default: 0,
    })
    sourceCount: number;

    // Version of the recommendation algorithm
    @Prop({
        type: Number,
        default: 1,
    })
    algorithmVersion: number;

    @Prop({
        type: Date,
        default: Date.now,
    })
    generatedAt: Date;
}

export const ProductRecommendationSchema =
    SchemaFactory.createForClass(ProductRecommendation);

// One document per source product and recommendation type
ProductRecommendationSchema.index(
    {
        productId: 1,
        type: 1,
    },
    {
        unique: true,
    },
);

// Fast lookup of recommended products
ProductRecommendationSchema.index({
    productId: 1,
    type: 1,
    'recommendations.score': -1,
});
