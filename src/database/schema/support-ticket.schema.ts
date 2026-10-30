import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type SupportTicketDocument = HydratedDocument<SupportTicket>;

// ─── Enums ─────────────────────────────────────────────

export enum TicketStatus {
    OPEN = "OPEN",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    WAITING_FOR_CUSTOMER = "WAITING_FOR_CUSTOMER",
    WAITING_FOR_SUPPORT = "WAITING_FOR_SUPPORT",
    ESCALATED = "ESCALATED",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    REOPENED = "REOPENED",
}

export enum TicketPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
}

export enum TicketCategory {
    ORDER = "ORDER",
    PAYMENT = "PAYMENT",
    SHIPPING = "SHIPPING",
    RETURN = "RETURN",
    REFUND = "REFUND",
    PRODUCT = "PRODUCT",
    ACCOUNT = "ACCOUNT",
    TECHNICAL = "TECHNICAL",
    OTHER = "OTHER",
}

export enum TicketActorType {
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN",
    SUPPORT_AGENT = "SUPPORT_AGENT",
    SYSTEM = "SYSTEM",
}

export enum TicketEventType {
    TICKET_CREATED = "TICKET_CREATED",
    STATUS_CHANGED = "STATUS_CHANGED",
    PRIORITY_CHANGED = "PRIORITY_CHANGED",
    CATEGORY_CHANGED = "CATEGORY_CHANGED",
    ASSIGNED = "ASSIGNED",
    REASSIGNED = "REASSIGNED",
    MESSAGE_SENT = "MESSAGE_SENT",
    INTERNAL_NOTE_ADDED = "INTERNAL_NOTE_ADDED",
    ATTACHMENT_ADDED = "ATTACHMENT_ADDED",
    ESCALATED = "ESCALATED",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    REOPENED = "REOPENED",
    SLA_WARNING = "SLA_WARNING",
    SLA_BREACHED = "SLA_BREACHED",
}

// ─── Attachments ───────────────────────────────────────

@Schema({ timestamps: true })
export class TicketAttachment {
    @Prop({ type: String, required: true, trim: true })
    fileName: string;

    @Prop({ type: String, required: true, trim: true })
    fileUrl: string;

    @Prop({ type: String, default: null })
    mimeType?: string | null;

    @Prop({ type: Number, min: 0, default: null })
    sizeBytes?: number | null;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        default: null,
    })
    uploadedBy?: Types.ObjectId | null;

    @Prop({
        type: String,
        enum: TicketActorType,
        required: true,
    })
    uploadedByType: TicketActorType;
}

export const TicketAttachmentSchema =
    SchemaFactory.createForClass(TicketAttachment);

// ─── Conversation messages ─────────────────────────────

@Schema({ timestamps: true })
export class TicketMessage {
    @Prop({
        type: Types.ObjectId,
        ref: "User",
        default: null,
    })
    senderId?: Types.ObjectId | null;

    @Prop({
        type: String,
        enum: TicketActorType,
        required: true,
    })
    senderType: TicketActorType;

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    message: string;

    @Prop({
        type: [TicketAttachmentSchema],
        default: [],
    })
    attachments: TicketAttachment[];

    @Prop({ type: Boolean, default: false })
    isInternal: boolean;

    @Prop({ type: Boolean, default: false })
    edited: boolean;

    @Prop({ type: Date, default: null })
    editedAt?: Date | null;
}

export const TicketMessageSchema =
    SchemaFactory.createForClass(TicketMessage);

// ─── Timeline events ───────────────────────────────────

@Schema({
    timestamps: {
        createdAt: true,
        updatedAt: false,
    },
})
export class TicketTimelineEvent {
    @Prop({
        type: String,
        enum: TicketEventType,
        required: true,
    })
    eventType: TicketEventType;

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    description: string;

    @Prop({
        type: String,
        enum: TicketActorType,
        required: true,
    })
    actorType: TicketActorType;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        default: null,
    })
    actorId?: Types.ObjectId | null;

    @Prop({ type: String, default: null })
    actorName?: string | null;

    @Prop({
        type: String,
        enum: TicketStatus,
        default: null,
    })
    previousStatus?: TicketStatus | null;

    @Prop({
        type: String,
        enum: TicketStatus,
        default: null,
    })
    newStatus?: TicketStatus | null;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        default: null,
    })
    previousAssigneeId?: Types.ObjectId | null;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        default: null,
    })
    newAssigneeId?: Types.ObjectId | null;

    @Prop({ type: String, default: null })
    previousValue?: string | null;

    @Prop({ type: String, default: null })
    newValue?: string | null;

    @Prop({
        type: Object,
        default: {},
    })
    metadata: Record<string, unknown>;
}

export const TicketTimelineEventSchema =
    SchemaFactory.createForClass(TicketTimelineEvent);

// ─── Main Support Ticket ───────────────────────────────

@Schema({
    timestamps: true,
    versionKey: false,
})
export class SupportTicket {
    @Prop({
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
    })
    ticketNumber: string;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    })
    userId?: Types.ObjectId | null;

    @Prop({
        type: String,
        default: null,
        index: true,
    })
    guestId?: string | null;

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    customerName: string;

    @Prop({
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    })
    customerEmail: string;

    @Prop({ type: String, trim: true, default: null })
    customerPhone?: string | null;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    })
    subject: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    description: string;

    @Prop({
        type: String,
        enum: TicketCategory,
        default: TicketCategory.OTHER,
        index: true,
    })
    category: TicketCategory;

    @Prop({
        type: String,
        enum: TicketPriority,
        default: TicketPriority.MEDIUM,
        index: true,
    })
    priority: TicketPriority;

    @Prop({
        type: String,
        enum: TicketStatus,
        default: TicketStatus.OPEN,
        index: true,
    })
    status: TicketStatus;

    @Prop({
        type: Types.ObjectId,
        ref: "Order",
        default: null,
        index: true,
    })
    orderId?: Types.ObjectId | null;

    @Prop({ type: String, trim: true, default: null })
    orderNumber?: string | null;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    })
    assignedTo?: Types.ObjectId | null;

    @Prop({ type: String, default: null })
    assignedAgentName?: string | null;

    @Prop({ type: Date, default: null })
    assignedAt?: Date | null;

    @Prop({ type: Date, default: null })
    firstResponseAt?: Date | null;

    @Prop({ type: Date, default: null })
    resolvedAt?: Date | null;

    @Prop({
        type: Types.ObjectId,
        ref: "User",
        default: null,
    })
    resolvedBy?: Types.ObjectId | null;

    @Prop({ type: String, trim: true, default: null })
    resolutionSummary?: string | null;

    @Prop({ type: Date, default: null })
    closedAt?: Date | null;

    @Prop({ type: Date, default: null })
    reopenedAt?: Date | null;

    @Prop({ type: Number, default: 0, min: 0 })
    reopenCount: number;

    // SLA tracking
    @Prop({ type: Date, default: null })
    firstResponseDueAt?: Date | null;

    @Prop({ type: Date, default: null })
    resolutionDueAt?: Date | null;

    @Prop({ type: Date, default: null })
    slaBreachedAt?: Date | null;

    // Conversation history
    @Prop({
        type: [TicketMessageSchema],
        default: [],
    })
    messages: TicketMessage[];

    // Every status change and action has its own timestamp.
    @Prop({
        type: [TicketTimelineEventSchema],
        default: [],
    })
    timeline: TicketTimelineEvent[];

    @Prop({
        type: [TicketAttachmentSchema],
        default: [],
    })
    attachments: TicketAttachment[];

    // Customer feedback
    @Prop({
        type: Number,
        min: 1,
        max: 5,
        default: null,
    })
    satisfactionRating?: number | null;

    @Prop({ type: String, trim: true, default: null })
    satisfactionFeedback?: string | null;

    @Prop({ type: Date, default: null })
    feedbackSubmittedAt?: Date | null;

    @Prop({ type: Date, default: null, index: true })
    lastActivityAt?: Date | null;

    @Prop({ type: Date, default: null })
    deletedAt?: Date | null;
}

export const SupportTicketSchema =
    SchemaFactory.createForClass(SupportTicket);

// ─── Indexes ────────────────────────────────────────────

SupportTicketSchema.index({ userId: 1, createdAt: -1 });
SupportTicketSchema.index({ guestId: 1, createdAt: -1 });
SupportTicketSchema.index({
    status: 1,
    priority: -1,
    createdAt: -1,
});
SupportTicketSchema.index({ assignedTo: 1, status: 1 });
SupportTicketSchema.index({ orderId: 1 });
SupportTicketSchema.index({ lastActivityAt: -1 });
