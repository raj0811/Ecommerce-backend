
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

// Defines role-based access control (RBAC) for the application.
// SUPER_ADMIN: Full system access, including role and system configuration.
// ADMIN: Manages products, users, orders, and general operations.
// FINANCE: Handles payments, refunds, reconciliation, and financial reports.
// OPERATIONS: Manages order processing, packing, shipping, invoices, and returns.
// SALES_SUPPORT: Manages customer profiles, leads, follow-ups, and support tickets;
// restricted from accessing product management, prices, and sensitive payment details.
export enum AdminRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    FINANCE = 'finance',
    OPERATIONS = 'operations',
    SALES_SUPPORT = 'sales_support',
}

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
    _id: Types.ObjectId;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    email: string;

    @Prop({ required: true, trim: true })
    number: string;

    @Prop({
        required: true,
        enum: AdminRole,
        default: AdminRole.ADMIN,
    })
    role: AdminRole;

    @Prop({ required: true, select: false })
    password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});
