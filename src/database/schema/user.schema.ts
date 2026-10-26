
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    _id: Types.ObjectId;

    @Prop({
        required: true,
        trim: true,
    })
    name: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    email: string;

    @Prop({
        required: true,
        trim: true,
    })
    number: string;

    @Prop({
        required: true,
        select: false,
    })
    password: string;


}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash the password before saving; never store plain-text passwords.
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});
