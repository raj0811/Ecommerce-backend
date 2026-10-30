import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    DefaultValuePipe,
    ParseIntPipe,
} from "@nestjs/common";
import { Request } from "express";

import { SupportTicketService } from "./support-ticket.service";
import {
    TicketActorType,
    TicketCategory,
    TicketPriority,
    TicketStatus,
} from "src/database/schema/support-ticket.schema";

// Replace these imports with the guards used in your project.
import { UserAuthGuard } from "src/Guards/user.AuthGuard";
import { AdminAuthGuard } from "src/Guards/admin.AuthGuard";

interface AuthenticatedRequest extends Request {
    user: {
        id?: string;
        _id?: string;
        name?: string;
        email?: string;
        role?: string;
    };
}

@Controller("support-tickets")
export class SupportTicketController {
    constructor(
        private readonly supportTicketService: SupportTicketService,
    ) { }

    private getActor(
        req: AuthenticatedRequest,
        type: TicketActorType,
    ) {
        const id = req.user?.id ?? req.user?._id;

        return {
            id,
            type,
            name: req.user?.name ?? req.user?.email ?? type,
        };
    }

    // CUSTOMER: Create ticket
    @Post()
    @UseGuards(UserAuthGuard)
    async createUserTicket(
        @Req() req: AuthenticatedRequest,
        @Body()
        body: {
            subject: string;
            description: string;
            category?: TicketCategory;
            priority?: TicketPriority;
            orderId?: string;
            orderNumber?: string;
            customerPhone?: string;
        },
    ) {
        const userId = req.user?.id ?? req.user?._id;

        if (!userId) {
            throw new Error("Authenticated user ID not found");
        }

        return this.supportTicketService.createTicket(
            {
                ...body,
                userId,
                customerName: req.user.name ?? "new user",
                customerEmail: req.user.email ?? "new user",
            },
            this.getActor(req, TicketActorType.CUSTOMER),
        );
    }

    // GUEST: Create ticket without login
    @Post("guest")
    async createGuestTicket(
        @Body()
        body: {
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
        },
    ) {
        const { guestId, ...ticketData } = body;

        return this.supportTicketService.createTicket(
            {
                ...ticketData,
                guestId,
            },
            {
                type: TicketActorType.CUSTOMER,
                name: body.customerName,
            },
        );
    }

    // CUSTOMER: View own tickets
    @Get("my")
    @UseGuards(UserAuthGuard)
    async getMyTickets(
        @Req() req: AuthenticatedRequest,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe)
        page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe)
        limit: number,
    ) {
        const userId = req.user?.id ?? req.user?._id;

        if (!userId) {
            throw new Error("Authenticated user ID not found");
        }

        return this.supportTicketService.getUserTickets(
            userId,
            page,
            limit,
        );
    }

    // GUEST: View tickets
    @Get("guest/:guestId")
    async getGuestTickets(
        @Param("guestId") guestId: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe)
        page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe)
        limit: number,
    ) {
        return this.supportTicketService.getGuestTickets(
            guestId,
            page,
            limit,
        );
    }

    // ADMIN: View all tickets with filters and pagination
    @Get("admin/all")
    @UseGuards(AdminAuthGuard)
    async getAllTickets(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe)
        page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe)
        limit: number,
        @Query("status") status?: TicketStatus,
        @Query("priority") priority?: TicketPriority,
        @Query("search") search?: string,
    ) {
        return this.supportTicketService.getAllTickets(
            page,
            limit,
            status,
            priority,
            search,
        );
    }

    // ADMIN: View ticket and complete timeline
    @Get("admin/:ticketId")
    @UseGuards(AdminAuthGuard)
    async getTicketById(
        @Param("ticketId") ticketId: string,
    ) {
        return this.supportTicketService.getTicketById(ticketId);
    }

    // ADMIN: Update ticket fields/status/assignment
    @Patch("admin/:ticketId")
    @UseGuards(AdminAuthGuard)
    async updateTicket(
        @Param("ticketId") ticketId: string,
        @Req() req: AuthenticatedRequest,
        @Body()
        body: {
            subject?: string;
            description?: string;
            category?: TicketCategory;
            priority?: TicketPriority;
            status?: TicketStatus;
            assignedTo?: string | null;
            assignedAgentName?: string | null;
            resolutionSummary?: string;
        },
    ) {
        return this.supportTicketService.updateTicket(
            ticketId,
            body,
            this.getActor(req, TicketActorType.ADMIN),
        );
    }

    // CUSTOMER / SUPPORT: Add message
    @Post(":ticketId/messages")
    @UseGuards(UserAuthGuard)
    async addMessage(
        @Param("ticketId") ticketId: string,
        @Req() req: AuthenticatedRequest,
        @Body()
        body: {
            message: string;
            isInternal?: boolean;
            attachments?: Array<{
                fileName: string;
                fileUrl: string;
                mimeType?: string;
                sizeBytes?: number;
            }>;
        },
    ) {
        return this.supportTicketService.addMessage(
            ticketId,
            body.message,
            this.getActor(req, TicketActorType.CUSTOMER),
            body.attachments ?? [],
            false,
        );
    }

    // ADMIN: Add an internal note or support reply
    @Post("admin/:ticketId/messages")
    @UseGuards(AdminAuthGuard)
    async addAdminMessage(
        @Param("ticketId") ticketId: string,
        @Req() req: AuthenticatedRequest,
        @Body()
        body: {
            message: string;
            isInternal?: boolean;
            attachments?: Array<{
                fileName: string;
                fileUrl: string;
                mimeType?: string;
                sizeBytes?: number;
            }>;
        },
    ) {
        return this.supportTicketService.addMessage(
            ticketId,
            body.message,
            this.getActor(req, TicketActorType.ADMIN),
            body.attachments ?? [],
            body.isInternal ?? false,
        );
    }

    // ADMIN: Resolve ticket
    @Patch("admin/:ticketId/resolve")
    @UseGuards(AdminAuthGuard)
    async resolveTicket(
        @Param("ticketId") ticketId: string,
        @Req() req: AuthenticatedRequest,
        @Body() body: { resolutionSummary: string },
    ) {
        return this.supportTicketService.resolveTicket(
            ticketId,
            body.resolutionSummary,
            this.getActor(req, TicketActorType.ADMIN),
        );
    }

    // ADMIN: Close resolved ticket
    @Patch("admin/:ticketId/close")
    @UseGuards(AdminAuthGuard)
    async closeTicket(
        @Param("ticketId") ticketId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.supportTicketService.closeTicket(
            ticketId,
            this.getActor(req, TicketActorType.ADMIN),
        );
    }

    // ADMIN: Reopen ticket
    @Patch("admin/:ticketId/reopen")
    @UseGuards(AdminAuthGuard)
    async reopenTicket(
        @Param("ticketId") ticketId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.supportTicketService.reopenTicket(
            ticketId,
            this.getActor(req, TicketActorType.ADMIN),
        );
    }
}