"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportTicketSchema = exports.SupportTicket = exports.TicketTimelineEventSchema = exports.TicketTimelineEvent = exports.TicketMessageSchema = exports.TicketMessage = exports.TicketAttachmentSchema = exports.TicketAttachment = exports.TicketEventType = exports.TicketActorType = exports.TicketCategory = exports.TicketPriority = exports.TicketStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "OPEN";
    TicketStatus["ASSIGNED"] = "ASSIGNED";
    TicketStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatus["WAITING_FOR_CUSTOMER"] = "WAITING_FOR_CUSTOMER";
    TicketStatus["WAITING_FOR_SUPPORT"] = "WAITING_FOR_SUPPORT";
    TicketStatus["ESCALATED"] = "ESCALATED";
    TicketStatus["RESOLVED"] = "RESOLVED";
    TicketStatus["CLOSED"] = "CLOSED";
    TicketStatus["REOPENED"] = "REOPENED";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketPriority;
(function (TicketPriority) {
    TicketPriority["LOW"] = "LOW";
    TicketPriority["MEDIUM"] = "MEDIUM";
    TicketPriority["HIGH"] = "HIGH";
    TicketPriority["URGENT"] = "URGENT";
})(TicketPriority || (exports.TicketPriority = TicketPriority = {}));
var TicketCategory;
(function (TicketCategory) {
    TicketCategory["ORDER"] = "ORDER";
    TicketCategory["PAYMENT"] = "PAYMENT";
    TicketCategory["SHIPPING"] = "SHIPPING";
    TicketCategory["RETURN"] = "RETURN";
    TicketCategory["REFUND"] = "REFUND";
    TicketCategory["PRODUCT"] = "PRODUCT";
    TicketCategory["ACCOUNT"] = "ACCOUNT";
    TicketCategory["TECHNICAL"] = "TECHNICAL";
    TicketCategory["OTHER"] = "OTHER";
})(TicketCategory || (exports.TicketCategory = TicketCategory = {}));
var TicketActorType;
(function (TicketActorType) {
    TicketActorType["CUSTOMER"] = "CUSTOMER";
    TicketActorType["ADMIN"] = "ADMIN";
    TicketActorType["SUPPORT_AGENT"] = "SUPPORT_AGENT";
    TicketActorType["SYSTEM"] = "SYSTEM";
})(TicketActorType || (exports.TicketActorType = TicketActorType = {}));
var TicketEventType;
(function (TicketEventType) {
    TicketEventType["TICKET_CREATED"] = "TICKET_CREATED";
    TicketEventType["STATUS_CHANGED"] = "STATUS_CHANGED";
    TicketEventType["PRIORITY_CHANGED"] = "PRIORITY_CHANGED";
    TicketEventType["CATEGORY_CHANGED"] = "CATEGORY_CHANGED";
    TicketEventType["ASSIGNED"] = "ASSIGNED";
    TicketEventType["REASSIGNED"] = "REASSIGNED";
    TicketEventType["MESSAGE_SENT"] = "MESSAGE_SENT";
    TicketEventType["INTERNAL_NOTE_ADDED"] = "INTERNAL_NOTE_ADDED";
    TicketEventType["ATTACHMENT_ADDED"] = "ATTACHMENT_ADDED";
    TicketEventType["ESCALATED"] = "ESCALATED";
    TicketEventType["RESOLVED"] = "RESOLVED";
    TicketEventType["CLOSED"] = "CLOSED";
    TicketEventType["REOPENED"] = "REOPENED";
    TicketEventType["SLA_WARNING"] = "SLA_WARNING";
    TicketEventType["SLA_BREACHED"] = "SLA_BREACHED";
})(TicketEventType || (exports.TicketEventType = TicketEventType = {}));
let TicketAttachment = class TicketAttachment {
    fileName;
    fileUrl;
    mimeType;
    sizeBytes;
    uploadedBy;
    uploadedByType;
};
exports.TicketAttachment = TicketAttachment;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], TicketAttachment.prototype, "fileName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], TicketAttachment.prototype, "fileUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], TicketAttachment.prototype, "mimeType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, default: null }),
    __metadata("design:type", Object)
], TicketAttachment.prototype, "sizeBytes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "User",
        default: null,
    }),
    __metadata("design:type", Object)
], TicketAttachment.prototype, "uploadedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: TicketActorType,
        required: true,
    }),
    __metadata("design:type", String)
], TicketAttachment.prototype, "uploadedByType", void 0);
exports.TicketAttachment = TicketAttachment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TicketAttachment);
exports.TicketAttachmentSchema = mongoose_1.SchemaFactory.createForClass(TicketAttachment);
let TicketMessage = class TicketMessage {
    senderId;
    senderType;
    message;
    attachments;
    isInternal;
    edited;
    editedAt;
};
exports.TicketMessage = TicketMessage;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "User",
        default: null,
    }),
    __metadata("design:type", Object)
], TicketMessage.prototype, "senderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: TicketActorType,
        required: true,
    }),
    __metadata("design:type", String)
], TicketMessage.prototype, "senderType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        trim: true,
    }),
    __metadata("design:type", String)
], TicketMessage.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [exports.TicketAttachmentSchema],
        default: [],
    }),
    __metadata("design:type", Array)
], TicketMessage.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], TicketMessage.prototype, "isInternal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], TicketMessage.prototype, "edited", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], TicketMessage.prototype, "editedAt", void 0);
exports.TicketMessage = TicketMessage = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TicketMessage);
exports.TicketMessageSchema = mongoose_1.SchemaFactory.createForClass(TicketMessage);
let TicketTimelineEvent = class TicketTimelineEvent {
    eventType;
    description;
    actorType;
    actorId;
    actorName;
    previousStatus;
    newStatus;
    previousAssigneeId;
    newAssigneeId;
    previousValue;
    newValue;
    metadata;
};
exports.TicketTimelineEvent = TicketTimelineEvent;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: TicketEventType,
        required: true,
    }),
    __metadata("design:type", String)
], TicketTimelineEvent.prototype, "eventType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        trim: true,
    }),
    __metadata("design:type", String)
], TicketTimelineEvent.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: TicketActorType,
        required: true,
    }),
    __metadata("design:type", String)
], TicketTimelineEvent.prototype, "actorType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "User",
        default: null,
    }),
    __metadata("design:type", Object)
], TicketTimelineEvent.prototype, "actorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], TicketTimelineEvent.prototype, "actorName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: TicketStatus,
        default: null,
    }),
    __metadata("design:type", Object)
], TicketTimelineEvent.prototype, "previousStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: TicketStatus,
        default: null,
    }),
    __metadata("design:type", Object)
], TicketTimelineEvent.prototype, "newStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "User",
        default: null,
    }),
    __metadata("design:type", Object)
], TicketTimelineEvent.prototype, "previousAssigneeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "User",
        default: null,
    }),
    __metadata("design:type", Object)
], TicketTimelineEvent.prototype, "newAssigneeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], TicketTimelineEvent.prototype, "previousValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], TicketTimelineEvent.prototype, "newValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {},
    }),
    __metadata("design:type", Object)
], TicketTimelineEvent.prototype, "metadata", void 0);
exports.TicketTimelineEvent = TicketTimelineEvent = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    })
], TicketTimelineEvent);
exports.TicketTimelineEventSchema = mongoose_1.SchemaFactory.createForClass(TicketTimelineEvent);
let SupportTicket = class SupportTicket {
    ticketNumber;
    userId;
    guestId;
    customerName;
    customerEmail;
    customerPhone;
    subject;
    description;
    category;
    priority;
    status;
    orderId;
    orderNumber;
    assignedTo;
    assignedAgentName;
    assignedAt;
    firstResponseAt;
    resolvedAt;
    resolvedBy;
    resolutionSummary;
    closedAt;
    reopenedAt;
    reopenCount;
    firstResponseDueAt;
    resolutionDueAt;
    slaBreachedAt;
    messages;
    timeline;
    attachments;
    satisfactionRating;
    satisfactionFeedback;
    feedbackSubmittedAt;
    lastActivityAt;
    deletedAt;
};
exports.SupportTicket = SupportTicket;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
    }),
    __metadata("design:type", String)
], SupportTicket.prototype, "ticketNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
        index: true,
    }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "guestId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        trim: true,
    }),
    __metadata("design:type", String)
], SupportTicket.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    }),
    __metadata("design:type", String)
], SupportTicket.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "customerPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    }),
    __metadata("design:type", String)
], SupportTicket.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        trim: true,
    }),
    __metadata("design:type", String)
], SupportTicket.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: TicketCategory,
        default: TicketCategory.OTHER,
        index: true,
    }),
    __metadata("design:type", String)
], SupportTicket.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: TicketPriority,
        default: TicketPriority.MEDIUM,
        index: true,
    }),
    __metadata("design:type", String)
], SupportTicket.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: TicketStatus,
        default: TicketStatus.OPEN,
        index: true,
    }),
    __metadata("design:type", String)
], SupportTicket.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "Order",
        default: null,
        index: true,
    }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "orderNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "assignedTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "assignedAgentName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "assignedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "firstResponseAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "resolvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "User",
        default: null,
    }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "resolvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "resolutionSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "closedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "reopenedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], SupportTicket.prototype, "reopenCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "firstResponseDueAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "resolutionDueAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "slaBreachedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [exports.TicketMessageSchema],
        default: [],
    }),
    __metadata("design:type", Array)
], SupportTicket.prototype, "messages", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [exports.TicketTimelineEventSchema],
        default: [],
    }),
    __metadata("design:type", Array)
], SupportTicket.prototype, "timeline", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [exports.TicketAttachmentSchema],
        default: [],
    }),
    __metadata("design:type", Array)
], SupportTicket.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        min: 1,
        max: 5,
        default: null,
    }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "satisfactionRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "satisfactionFeedback", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "feedbackSubmittedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null, index: true }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "lastActivityAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "deletedAt", void 0);
exports.SupportTicket = SupportTicket = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        versionKey: false,
    })
], SupportTicket);
exports.SupportTicketSchema = mongoose_1.SchemaFactory.createForClass(SupportTicket);
exports.SupportTicketSchema.index({ userId: 1, createdAt: -1 });
exports.SupportTicketSchema.index({ guestId: 1, createdAt: -1 });
exports.SupportTicketSchema.index({
    status: 1,
    priority: -1,
    createdAt: -1,
});
exports.SupportTicketSchema.index({ assignedTo: 1, status: 1 });
exports.SupportTicketSchema.index({ orderId: 1 });
exports.SupportTicketSchema.index({ lastActivityAt: -1 });
//# sourceMappingURL=support-ticket.schema.js.map