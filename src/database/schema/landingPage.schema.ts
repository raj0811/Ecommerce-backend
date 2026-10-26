
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';

export type LandingPageDocument = HydratedDocument<LandingPage>;

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
        type: MongooseSchema.Types.Mixed,
        default: {},
    })
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        ogImage?: string;
    };
}

export const LandingPageSchema =
    SchemaFactory.createForClass(LandingPage);

LandingPageSchema.index({ isPublished: 1, isDeleted: 1, slug: 1 });
