import { Types } from "mongoose";
import { DatabaseService } from "../database/database.service";
import { TicketActorType, TicketCategory, TicketPriority, TicketStatus } from "../database/schema/support-ticket.schema";
interface CreateTicketDto {
    userId?: string;
    guestId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    subject: string;
    description: string;
    category?: TicketCategory;
    priority?: TicketPriority;
    orderId?: string;
    orderNumber?: string;
}
interface UpdateTicketDto {
    subject?: string;
    description?: string;
    category?: TicketCategory;
    priority?: TicketPriority;
    status?: TicketStatus;
    assignedTo?: string | null;
    assignedAgentName?: string | null;
    resolutionSummary?: string;
}
interface TicketActor {
    id?: string;
    type: TicketActorType;
    name?: string;
}
interface TicketAttachmentInput {
    fileName: string;
    fileUrl: string;
    mimeType?: string;
    sizeBytes?: number;
}
export declare class SupportTicketService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    private get ticketModel();
    private generateTicketNumber;
    private toObjectId;
    private findTicket;
    private addTimeline;
    private normalizePagination;
    createTicket(dto: CreateTicketDto, actor?: TicketActor): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getTicketById(ticketId: string): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getAllTickets(page?: number, limit?: number, status?: TicketStatus, priority?: TicketPriority, search?: string): Promise<{
        success: boolean;
        data: (import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            currentPage: number;
            limit: number;
            totalTickets: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getUserTickets(userId: string, page?: number, limit?: number): Promise<{
        success: boolean;
        data: (import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            currentPage: number;
            limit: number;
            totalTickets: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getGuestTickets(guestId: string, page?: number, limit?: number): Promise<{
        success: boolean;
        data: (import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            currentPage: number;
            limit: number;
            totalTickets: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    private getTicketsByOwner;
    updateTicket(ticketId: string, dto: UpdateTicketDto, actor: TicketActor): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    addMessage(ticketId: string, message: string, actor: TicketActor, attachments?: TicketAttachmentInput[], isInternal?: boolean): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    resolveTicket(ticketId: string, resolutionSummary: string, actor: TicketActor): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    closeTicket(ticketId: string, actor: TicketActor): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    reopenTicket(ticketId: string, actor: TicketActor): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    private applyStatusChange;
}
export {};
