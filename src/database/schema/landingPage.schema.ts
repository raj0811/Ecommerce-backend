import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument, Types } from 'mongoose';

export type LandingPageDocument = HydratedDocument<LandingPage>;

@Schema({
    _id: false,
})
export class LandingPageContent {
    @Prop({ trim: true, maxlength: 150 })
    heading?: string;

    @Prop({ trim: true, maxlength: 200 })
    tagline?: string;

    @Prop({ trim: true, maxlength: 2000 })
    description?: string;

    @Prop({ trim: true, maxlength: 300 })
    subheading?: string;

    @Prop({ trim: true, maxlength: 100 })
    ctaText?: string;

    @Prop({ trim: true, maxlength: 500 })
    ctaLink?: string;

    @Prop({ type: [String], default: [] })
    highlights: string[];

    @Prop({ type: [String], default: [] })
    benefits: string[];

    @Prop({ trim: true })
    heroImage?: string;

    @Prop({ trim: true })
    bannerImage?: string;
}

export const LandingPageContentSchema =
    SchemaFactory.createForClass(LandingPageContent);

@Schema({
    _id: false,
})
export class LandingPageSeo {
    @Prop({ trim: true, maxlength: 150 })
    metaTitle?: string;

    @Prop({ trim: true, maxlength: 300 })
    metaDescription?: string;

    @Prop({ trim: true })
    ogImage?: string;

    @Prop({ type: [String], default: [] })
    keywords: string[];
}

export const LandingPageSeoSchema =
    SchemaFactory.createForClass(LandingPageSeo);

@Schema({
    timestamps: true,
    collection: 'landing_pages',
})
export class LandingPage {
    @Prop({
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        default: 'home',
    })
    slug: string;

    @Prop({
        required: true,
        trim: true,
        maxlength: 150,
        default: 'Home',
    })
    title: string;


    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Product',
        default: null,
        index: true,
    })
    productId: Types.ObjectId | null;

    @Prop({
        type: LandingPageContentSchema,
        default: () => ({}),
    })
    content: LandingPageContent;

    @Prop({
        type: Boolean,
        default: true,
    })
    isPublished: boolean;

    @Prop({
        type: Boolean,
        default: false,
        index: true,
    })
    isDeleted: boolean;

    @Prop({
        type: [MongooseSchema.Types.Mixed],
        default: [],
    })
    sections: Record<string, any>[];

    @Prop({
        type: LandingPageSeoSchema,
        default: () => ({}),
    })
    seo: LandingPageSeo;
}

export const LandingPageSchema =
    SchemaFactory.createForClass(LandingPage);

LandingPageSchema.index({
    isPublished: 1,
    isDeleted: 1,
    slug: 1,
});

LandingPageSchema.index({
    productId: 1,
    isDeleted: 1,
});