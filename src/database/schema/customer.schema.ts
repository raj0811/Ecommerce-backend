
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ _id: false })
export class CustomerAddress {
    @Prop({ required: true, trim: true })
    fullName: string;

    @Prop({ required: true, trim: true })
    phone: string;

    @Prop({ required: true, trim: true })
    addressLine1: string;

    @Prop({ trim: true })
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

@Schema({ timestamps: true })
export class Customer {
    _id: Types.ObjectId;

    // Optional link because customers can check out as guests.
    @Prop({ type: Types.ObjectId, ref: 'User', index: true })
    userId?: Types.ObjectId;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({
        required: true,
        trim: true,
        match: /^\d{10}$/,
        index: true,
    })
    phone: string;

    @Prop({
        lowercase: true,
        trim: true,
        index: true,
    })
    email?: string;

    @Prop({
        type: [CustomerAddressSchema],
        default: [],
    })
    addresses: CustomerAddress[];

    // First-touch campaign attribution.
    @Prop({ type: CustomerUtmSchema })
    firstUtm?: CustomerUtm;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: [String], default: [] })
    teamNotes: string[];

    // CRM summary fields, updated by trusted backend workflows.
    @Prop({ type: Number, default: 0, min: 0 })
    totalSpent: number;

    @Prop({ type: Number, default: 0, min: 0 })
    totalOrders: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// Useful for searching customers and their order history.
CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ createdAt: -1 });
