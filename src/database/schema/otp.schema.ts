
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
    _id: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    })
    userId: Types.ObjectId;

    @Prop({
        type: String,
        required: true,
        unique: true,
    })
    challengeId: string;

    @Prop({
        type: String,
        required: true,
        select: false,
    })
    otpHash: string;

    @Prop({
        type: String,
        enum: ['email', 'sms'],
        default: 'email',
        required: true,
    })
    method: string;

    @Prop({
        type: Date,
        required: true,
    })
    expiresAt: Date;

    @Prop({
        type: Number,
        default: 0,
    })
    attempts: number;

    @Prop({
        type: Boolean,
        default: false,
    })
    verified: boolean;

    // Mongoose timestamps
    createdAt: Date;
    updatedAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Automatically delete expired OTP documents.
OtpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 },
);
