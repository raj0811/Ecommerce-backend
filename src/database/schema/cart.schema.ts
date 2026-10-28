
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

export enum CartStatus {
    ACTIVE = 'active',
    CONVERTED = 'converted',
    ABANDONED = 'abandoned',
}

@Schema({ _id: false })
export class CartItem {
    @Prop({
        type: Types.ObjectId,
        ref: 'Product',
        required: true,
    })
    productId: Types.ObjectId;

    @Prop({
        type: Number,
        required: true,
        min: 1,
        default: 1,
    })
    quantity: number;

    @Prop({ type: Number, required: true, min: 0 })
    price: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ _id: false })
export class CartCustomer {
    @Prop({ type: String, trim: true, default: null })
    name: string | null;

    @Prop({ type: String, trim: true, lowercase: true, default: null })
    email: string | null;

    @Prop({ type: String, trim: true, default: null })
    phone: string | null;
}

export const CartCustomerSchema =
    SchemaFactory.createForClass(CartCustomer);

@Schema({
    timestamps: true,
    collection: 'carts',
})
export class Cart {
    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        default: null,
    })
    userId: Types.ObjectId | null;

    @Prop({
        type: String,
        default: null,
    })
    guestId: string | null;

    @Prop({
        type: CartCustomerSchema,
        default: () => ({}),
    })
    customer: CartCustomer;

    @Prop({
        type: [CartItemSchema],
        default: [],
    })
    items: CartItem[];

    @Prop({
        type: String,
        enum: CartStatus,
        default: CartStatus.ACTIVE,
        index: true,
    })
    status: CartStatus;

    @Prop({
        type: Date,
        default: Date.now,
        index: true,
    })
    lastActivityAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// A cart must belong to a user or a guest browser.
CartSchema.pre('validate', function () {
    if (!this.userId && !this.guestId) {
        this.invalidate(
            'guestId',
            'Either userId or guestId must be provided',
        );
    }
});

// Allow only one active cart per user.
CartSchema.index(
    { userId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            userId: { $type: 'objectId' },
            status: CartStatus.ACTIVE,
        },
    },
);

// Allow only one active cart per guest browser.
CartSchema.index(
    { guestId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            guestId: { $type: 'string' },
            status: CartStatus.ACTIVE,
        },
    },
);
