import { HydratedDocument, Types } from "mongoose";
export type SupportTicketDocument = HydratedDocument<SupportTicket>;
export declare enum TicketStatus {
    OPEN = "OPEN",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    WAITING_FOR_CUSTOMER = "WAITING_FOR_CUSTOMER",
    WAITING_FOR_SUPPORT = "WAITING_FOR_SUPPORT",
    ESCALATED = "ESCALATED",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    REOPENED = "REOPENED"
}
export declare enum TicketPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare enum TicketCategory {
    ORDER = "ORDER",
    PAYMENT = "PAYMENT",
    SHIPPING = "SHIPPING",
    RETURN = "RETURN",
    REFUND = "REFUND",
    PRODUCT = "PRODUCT",
    ACCOUNT = "ACCOUNT",
    TECHNICAL = "TECHNICAL",
    OTHER = "OTHER"
}
export declare enum TicketActorType {
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN",
    SUPPORT_AGENT = "SUPPORT_AGENT",
    SYSTEM = "SYSTEM"
}
export declare enum TicketEventType {
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
    SLA_BREACHED = "SLA_BREACHED"
}
export declare class TicketAttachment {
    fileName: string;
    fileUrl: string;
    mimeType?: string | null;
    sizeBytes?: number | null;
    uploadedBy?: Types.ObjectId | null;
    uploadedByType: TicketActorType;
}
export declare const TicketAttachmentSchema: import("mongoose").Schema<TicketAttachment, import("mongoose").Model<TicketAttachment, any, any, any, any, any, TicketAttachment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TicketAttachment, import("mongoose").Document<unknown, {}, TicketAttachment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TicketAttachment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    fileName?: import("mongoose").SchemaDefinitionProperty<string, TicketAttachment, import("mongoose").Document<unknown, {}, TicketAttachment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketAttachment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fileUrl?: import("mongoose").SchemaDefinitionProperty<string, TicketAttachment, import("mongoose").Document<unknown, {}, TicketAttachment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketAttachment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mimeType?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, TicketAttachment, import("mongoose").Document<unknown, {}, TicketAttachment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketAttachment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sizeBytes?: import("mongoose").SchemaDefinitionProperty<number | null | undefined, TicketAttachment, import("mongoose").Document<unknown, {}, TicketAttachment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketAttachment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    uploadedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null | undefined, TicketAttachment, import("mongoose").Document<unknown, {}, TicketAttachment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketAttachment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    uploadedByType?: import("mongoose").SchemaDefinitionProperty<TicketActorType, TicketAttachment, import("mongoose").Document<unknown, {}, TicketAttachment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketAttachment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, TicketAttachment>;
export declare class TicketMessage {
    senderId?: Types.ObjectId | null;
    senderType: TicketActorType;
    message: string;
    attachments: TicketAttachment[];
    isInternal: boolean;
    edited: boolean;
    editedAt?: Date | null;
}
export declare const TicketMessageSchema: import("mongoose").Schema<TicketMessage, import("mongoose").Model<TicketMessage, any, any, any, any, any, TicketMessage & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TicketMessage, import("mongoose").Document<unknown, {}, TicketMessage, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TicketMessage & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    senderId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null | undefined, TicketMessage, import("mongoose").Document<unknown, {}, TicketMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketMessage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    senderType?: import("mongoose").SchemaDefinitionProperty<TicketActorType, TicketMessage, import("mongoose").Document<unknown, {}, TicketMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketMessage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    message?: import("mongoose").SchemaDefinitionProperty<string, TicketMessage, import("mongoose").Document<unknown, {}, TicketMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketMessage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    attachments?: import("mongoose").SchemaDefinitionProperty<TicketAttachment[], TicketMessage, import("mongoose").Document<unknown, {}, TicketMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketMessage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isInternal?: import("mongoose").SchemaDefinitionProperty<boolean, TicketMessage, import("mongoose").Document<unknown, {}, TicketMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketMessage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    edited?: import("mongoose").SchemaDefinitionProperty<boolean, TicketMessage, import("mongoose").Document<unknown, {}, TicketMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketMessage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    editedAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, TicketMessage, import("mongoose").Document<unknown, {}, TicketMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketMessage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, TicketMessage>;
export declare class TicketTimelineEvent {
    eventType: TicketEventType;
    description: string;
    actorType: TicketActorType;
    actorId?: Types.ObjectId | null;
    actorName?: string | null;
    previousStatus?: TicketStatus | null;
    newStatus?: TicketStatus | null;
    previousAssigneeId?: Types.ObjectId | null;
    newAssigneeId?: Types.ObjectId | null;
    previousValue?: string | null;
    newValue?: string | null;
    metadata: Record<string, unknown>;
}
export declare const TicketTimelineEventSchema: import("mongoose").Schema<TicketTimelineEvent, import("mongoose").Model<TicketTimelineEvent, any, any, any, any, any, TicketTimelineEvent & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    eventType?: import("mongoose").SchemaDefinitionProperty<TicketEventType, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    actorType?: import("mongoose").SchemaDefinitionProperty<TicketActorType, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    actorId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null | undefined, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    actorName?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    previousStatus?: import("mongoose").SchemaDefinitionProperty<TicketStatus | null | undefined, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    newStatus?: import("mongoose").SchemaDefinitionProperty<TicketStatus | null | undefined, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    previousAssigneeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null | undefined, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    newAssigneeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null | undefined, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    previousValue?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    newValue?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<Record<string, unknown>, TicketTimelineEvent, import("mongoose").Document<unknown, {}, TicketTimelineEvent, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TicketTimelineEvent & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, TicketTimelineEvent>;
export declare class SupportTicket {
    ticketNumber: string;
    userId?: Types.ObjectId | null;
    guestId?: string | null;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    subject: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;
    orderId?: Types.ObjectId | null;
    orderNumber?: string | null;
    assignedTo?: Types.ObjectId | null;
    assignedAgentName?: string | null;
    assignedAt?: Date | null;
    firstResponseAt?: Date | null;
    resolvedAt?: Date | null;
    resolvedBy?: Types.ObjectId | null;
    resolutionSummary?: string | null;
    closedAt?: Date | null;
    reopenedAt?: Date | null;
    reopenCount: number;
    firstResponseDueAt?: Date | null;
    resolutionDueAt?: Date | null;
    slaBreachedAt?: Date | null;
    messages: TicketMessage[];
    timeline: TicketTimelineEvent[];
    attachments: TicketAttachment[];
    satisfactionRating?: number | null;
    satisfactionFeedback?: string | null;
    feedbackSubmittedAt?: Date | null;
    lastActivityAt?: Date | null;
    deletedAt?: Date | null;
}
export declare const SupportTicketSchema: import("mongoose").Schema<SupportTicket, import("mongoose").Model<SupportTicket, any, any, any, any, any, SupportTicket & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    ticketNumber?: import("mongoose").SchemaDefinitionProperty<string, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    guestId?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerName?: import("mongoose").SchemaDefinitionProperty<string, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerEmail?: import("mongoose").SchemaDefinitionProperty<string, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerPhone?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    subject?: import("mongoose").SchemaDefinitionProperty<string, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<TicketCategory, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    priority?: import("mongoose").SchemaDefinitionProperty<TicketPriority, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<TicketStatus, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    orderId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    orderNumber?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedTo?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedAgentName?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    firstResponseAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resolvedAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resolvedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resolutionSummary?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    closedAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    reopenedAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    reopenCount?: import("mongoose").SchemaDefinitionProperty<number, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    firstResponseDueAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    resolutionDueAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    slaBreachedAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    messages?: import("mongoose").SchemaDefinitionProperty<TicketMessage[], SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    timeline?: import("mongoose").SchemaDefinitionProperty<TicketTimelineEvent[], SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    attachments?: import("mongoose").SchemaDefinitionProperty<TicketAttachment[], SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    satisfactionRating?: import("mongoose").SchemaDefinitionProperty<number | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    satisfactionFeedback?: import("mongoose").SchemaDefinitionProperty<string | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    feedbackSubmittedAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lastActivityAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, SupportTicket, import("mongoose").Document<unknown, {}, SupportTicket, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SupportTicket & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, SupportTicket>;
