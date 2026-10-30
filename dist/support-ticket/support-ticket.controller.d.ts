import { Request } from "express";
import { SupportTicketService } from "./support-ticket.service";
import { TicketCategory, TicketPriority, TicketStatus } from "../database/schema/support-ticket.schema";
interface AuthenticatedRequest extends Request {
    user: {
        id?: string;
        _id?: string;
        name?: string;
        email?: string;
        role?: string;
    };
}
export declare class SupportTicketController {
    private readonly supportTicketService;
    constructor(supportTicketService: SupportTicketService);
    private getActor;
    createUserTicket(req: AuthenticatedRequest, body: {
        subject: string;
        description: string;
        category?: TicketCategory;
        priority?: TicketPriority;
        orderId?: string;
        orderNumber?: string;
        customerPhone?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    createGuestTicket(body: {
        guestId: string;
        customerName: string;
        customerEmail: string;
        customerPhone?: string;
        subject: string;
        description: string;
        category?: TicketCategory;
        priority?: TicketPriority;
        orderId?: string;
        orderNumber?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getMyTickets(req: AuthenticatedRequest, page: number, limit: number): Promise<{
        success: boolean;
        data: (import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
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
    getGuestTickets(guestId: string, page: number, limit: number): Promise<{
        success: boolean;
        data: (import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
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
    getAllTickets(page: number, limit: number, status?: TicketStatus, priority?: TicketPriority, search?: string): Promise<{
        success: boolean;
        data: (import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
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
    getTicketById(ticketId: string): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateTicket(ticketId: string, req: AuthenticatedRequest, body: {
        subject?: string;
        description?: string;
        category?: TicketCategory;
        priority?: TicketPriority;
        status?: TicketStatus;
        assignedTo?: string | null;
        assignedAgentName?: string | null;
        resolutionSummary?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    addMessage(ticketId: string, req: AuthenticatedRequest, body: {
        message: string;
        isInternal?: boolean;
        attachments?: Array<{
            fileName: string;
            fileUrl: string;
            mimeType?: string;
            sizeBytes?: number;
        }>;
    }): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    addAdminMessage(ticketId: string, req: AuthenticatedRequest, body: {
        message: string;
        isInternal?: boolean;
        attachments?: Array<{
            fileName: string;
            fileUrl: string;
            mimeType?: string;
            sizeBytes?: number;
        }>;
    }): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    resolveTicket(ticketId: string, req: AuthenticatedRequest, body: {
        resolutionSummary: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    closeTicket(ticketId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    reopenTicket(ticketId: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("src/database/schema/support-ticket.schema").SupportTicket, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/support-ticket.schema").SupportTicket & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
export {};
