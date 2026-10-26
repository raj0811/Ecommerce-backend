
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ _id: false })
export class CustomerAddress {
    @Prop({ required: true, trim: true })
    fullName: string;

    @Prop({ required: true, trim: true, match: /^\d{10}$/ })
    phone: string;

    @Prop({ required: true, trim: true })
    addressLine1: string;

    @Prop({ trim: true, default: '' })
    addressLine2?: string;

    @Prop({ required: true, trim: true })
    city: string;

    @Prop({ required: true, trim: true })
    state: string;

    @Prop({ required: true, trim: true, match: /^\d{6}$/ })
    pincode: string;

    @Prop({ default: false })
    isDefault: boolean;
}

export const CustomerAddressSchema =
    SchemaFactory.createForClass(CustomerAddress);

@Schema({ _id: false })
export class CustomerUtm {
    @Prop({ trim: true })
    source?: string;

    @Prop({ trim: true })
    medium?: string;

    @Prop({ trim: true })
    campaign?: string;
}

export const CustomerUtmSchema =
    SchemaFactory.createForClass(CustomerUtm);

@Schema({
    timestamps: true,
    collection: 'customers',
})
export class Customer {
    // Optional: guest customers do not need a User account.
    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        default: undefined,
    })
    userId?: Types.ObjectId;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({
        required: true,
        trim: true,
        match: /^\d{10}$/,
    })
    phone: string;

    @Prop({
        type: String,
        lowercase: true,
        trim: true,
        default: undefined,
    })
    email?: string;

    @Prop({
        type: [CustomerAddressSchema],
        default: [],
    })
    addresses: CustomerAddress[];

    // First-touch marketing attribution.
    @Prop({ type: CustomerUtmSchema, default: undefined })
    firstUtm?: CustomerUtm;

    @Prop({ type: [String], default: [] })
    tags: string[];

    // Internal CRM notes.
    @Prop({ type: [String], default: [] })
    teamNotes: string[];

    // Updated by trusted backend order workflows.
    @Prop({ type: Number, default: 0, min: 0 })
    totalSpent: number;

    @Prop({ type: Number, default: 0, min: 0 })
    totalOrders: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// Query optimization indexes.
CustomerSchema.index({ userId: 1 });
CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ createdAt: -1 });
