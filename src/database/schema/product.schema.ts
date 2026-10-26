
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
    timestamps: true,
    collection: 'products',
})
export class Product {
    @Prop({
        required: true,
        trim: true,
        maxlength: 150,
    })
    name: string;

    @Prop({
        required: true,
        trim: true,
        lowercase: true,
    })
    slug: string;

    @Prop({
        required: true,
        trim: true,
        unique: true,
        uppercase: true,
    })
    sku: string;

    @Prop({
        required: true,
        trim: true,
        maxlength: 5000,
    })
    description: string;

    @Prop({
        required: true,
        min: 0,
    })
    price: number;

    @Prop({
        min: 0,
        default: null,
        type: Number,
    })
    compareAtPrice?: number | null;

    @Prop({
        type: [String],
        default: [],
    })
    images: string[];

    @Prop({
        required: true,
        trim: true,
        lowercase: true,
        index: true,
    })
    category: string;

    @Prop({
        type: Number,
        required: true,
        min: 0,
        default: 0,
        validate: {
            validator: (value: number) => Number.isInteger(value),
            message: 'Stock must be a non-negative integer',
        },
    })
    stock: number;

    @Prop({
        type: Boolean,
        default: true,
        index: true,
    })
    isActive: boolean;

    @Prop({
        type: Boolean,
        default: false,
    })
    isFeatured: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Unique indexes
ProductSchema.index({ slug: 1 }, { unique: true });
// ProductSchema.index({ sku: 1 }, { unique: true });

// Catalog queries
ProductSchema.index({ isActive: 1, createdAt: -1 });
ProductSchema.index({ isActive: 1, category: 1, price: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });
