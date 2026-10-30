import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Types } from "mongoose";
import { randomBytes } from "crypto";
import { DatabaseService } from "src/database/database.service";
import {
    TicketActorType,
    TicketCategory,
    TicketEventType,
    TicketPriority,
    TicketStatus,
} from "src/database/schema/support-ticket.schema";

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

@Injectable()
export class SupportTicketService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    private get ticketModel() {
        return this.databaseService.supportTicketModel;
    }

    // ─── Helpers ───────────────────────────────────────

    private generateTicketNumber(): string {
        return `TKT-${Date.now()}-${randomBytes(3)
            .toString("hex")
            .toUpperCase()}`;
    }

    private toObjectId(
        id?: string | null,
    ): Types.ObjectId | null {
        if (!id) return null;

        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException("Invalid ID");
        }

        return new Types.ObjectId(id);
    }

    private async findTicket(ticketId: string) {
        if (!Types.ObjectId.isValid(ticketId)) {
            throw new BadRequestException("Invalid ticket ID");
        }

        const ticket = await this.ticketModel.findOne({
            _id: new Types.ObjectId(ticketId),
            deletedAt: null,
        });

        if (!ticket) {
            throw new NotFoundException("Support ticket not found");
        }

        return ticket;
    }

    private addTimeline(
        ticket: any,
        event: {
            eventType: TicketEventType;
            description: string;
            actor: TicketActor;
            previousStatus?: TicketStatus | null;
            newStatus?: TicketStatus | null;
            previousValue?: string | null;
            newValue?: string | null;
            previousAssigneeId?: Types.ObjectId | null;
            newAssigneeId?: Types.ObjectId | null;
            metadata?: Record<string, unknown>;
        },
    ): void {
        ticket.timeline.push({
            eventType: event.eventType,
            description: event.description,
            actorType: event.actor.type,
            actorId: this.toObjectId(event.actor.id),
            actorName: event.actor.name ?? null,
            previousStatus: event.previousStatus ?? null,
            newStatus: event.newStatus ?? null,
            previousValue: event.previousValue ?? null,
            newValue: event.newValue ?? null,
            previousAssigneeId:
                event.previousAssigneeId ?? null,
            newAssigneeId: event.newAssigneeId ?? null,
            metadata: event.metadata ?? {},
            createdAt: new Date(),
        });
    }

    private normalizePagination(page = 1, limit = 10) {
        const currentPage = Math.max(1, Number(page) || 1);
        const perPage = Math.min(
            100,
            Math.max(1, Number(limit) || 10),
        );

        return {
            currentPage,
            perPage,
            skip: (currentPage - 1) * perPage,
        };
    }

    // ─── 1. Create Ticket ───────────────────────────────

    async createTicket(
        dto: CreateTicketDto,
        actor?: TicketActor,
    ) {
        if (!dto.userId && !dto.guestId?.trim()) {
            throw new BadRequestException(
                "A user ID or guest ID is required",
            );
        }

        if (dto.userId && !Types.ObjectId.isValid(dto.userId)) {
            throw new BadRequestException("Invalid user ID");
        }

        if (dto.orderId && !Types.ObjectId.isValid(dto.orderId)) {
            throw new BadRequestException("Invalid order ID");
        }

        if (!dto.customerName?.trim()) {
            throw new BadRequestException(
                "Customer name is required",
            );
        }

        if (!dto.customerEmail?.trim()) {
            throw new BadRequestException(
                "Customer email is required",
            );
        }

        if (!dto.subject?.trim() || !dto.description?.trim()) {
            throw new BadRequestException(
                "Subject and description are required",
            );
        }

        const now = new Date();
        const ticketNumber = this.generateTicketNumber();

        const ticket = new this.ticketModel({
            ticketNumber,
            userId: this.toObjectId(dto.userId),
            guestId: dto.userId ? null : dto.guestId?.trim(),
            customerName: dto.customerName.trim(),
            customerEmail: dto.customerEmail.trim().toLowerCase(),
            customerPhone: dto.customerPhone,
            subject: dto.subject.trim(),
            description: dto.description.trim(),
            category: dto.category ?? TicketCategory.OTHER,
            priority: dto.priority ?? TicketPriority.MEDIUM,
            status: TicketStatus.OPEN,
            orderId: this.toObjectId(dto.orderId),
            orderNumber: dto.orderNumber ?? null,
            messages: [],
            timeline: [],
            attachments: [],
            lastActivityAt: now,
        });

        this.addTimeline(ticket, {
            eventType: TicketEventType.TICKET_CREATED,
            description: "Support ticket created",
            actor: actor ?? {
                id: dto.userId,
                type: TicketActorType.CUSTOMER,
                name: dto.customerName,
            },
            newStatus: TicketStatus.OPEN,
            metadata: { ticketNumber },
        });

        await ticket.save();

        return {
            success: true,
            message: "Support ticket created successfully",
            data: ticket,
        };
    }

    // ─── 2. Get Ticket Details + Timeline ───────────────

    async getTicketById(ticketId: string) {
        const ticket = await this.findTicket(ticketId);

        return {
            success: true,
            data: ticket,
        };
    }

    // ─── 3. Get All Tickets (Admin Pagination) ──────────

    async getAllTickets(
        page = 1,
        limit = 10,
        status?: TicketStatus,
        priority?: TicketPriority,
        search?: string,
    ) {
        const { currentPage, perPage, skip } =
            this.normalizePagination(page, limit);

        const filter: Record<string, any> = {
            deletedAt: null,
        };

        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        if (search?.trim()) {
            const escaped = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&",
            );

            filter.$or = [
                {
                    ticketNumber: {
                        $regex: escaped,
                        $options: "i",
                    },
                },
                {
                    subject: {
                        $regex: escaped,
                        $options: "i",
                    },
                },
                {
                    customerName: {
                        $regex: escaped,
                        $options: "i",
                    },
                },
                {
                    customerEmail: {
                        $regex: escaped,
                        $options: "i",
                    },
                },
            ];
        }

        const [tickets, totalTickets] = await Promise.all([
            this.ticketModel
                .find(filter)
                .sort({ lastActivityAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(perPage)
                .lean()
                .exec(),

            this.ticketModel.countDocuments(filter).exec(),
        ]);

        const totalPages = Math.ceil(totalTickets / perPage);

        return {
            success: true,
            data: tickets,
            pagination: {
                currentPage,
                limit: perPage,
                totalTickets,
                totalPages,
                hasNextPage: currentPage < totalPages,
                hasPreviousPage: currentPage > 1,
            },
        };
    }

    // ─── 4. Get Logged-in User's Tickets ────────────────

    async getUserTickets(
        userId: string,
        page = 1,
        limit = 10,
    ) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException("Invalid user ID");
        }

        return this.getTicketsByOwner(
            { userId: new Types.ObjectId(userId) },
            page,
            limit,
        );
    }

    // ─── 5. Get Guest Tickets ───────────────────────────

    async getGuestTickets(
        guestId: string,
        page = 1,
        limit = 10,
    ) {
        if (!guestId?.trim()) {
            throw new BadRequestException("Guest ID is required");
        }

        return this.getTicketsByOwner(
            { guestId: guestId.trim() },
            page,
            limit,
        );
    }

    private async getTicketsByOwner(
        ownerFilter: Record<string, any>,
        page = 1,
        limit = 10,
    ) {
        const { currentPage, perPage, skip } =
            this.normalizePagination(page, limit);

        const filter = {
            ...ownerFilter,
            deletedAt: null,
        };

        const [tickets, totalTickets] = await Promise.all([
            this.ticketModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(perPage)
                .lean()
                .exec(),

            this.ticketModel.countDocuments(filter).exec(),
        ]);

        const totalPages = Math.ceil(totalTickets / perPage);

        return {
            success: true,
            data: tickets,
            pagination: {
                currentPage,
                limit: perPage,
                totalTickets,
                totalPages,
                hasNextPage: currentPage < totalPages,
                hasPreviousPage: currentPage > 1,
            },
        };
    }

    // ─── 6. Update Ticket ───────────────────────────────

    async updateTicket(
        ticketId: string,
        dto: UpdateTicketDto,
        actor: TicketActor,
    ) {
        const ticket = await this.findTicket(ticketId);
        const now = new Date();

        if (
            ticket.status === TicketStatus.CLOSED &&
            dto.status !== TicketStatus.REOPENED
        ) {
            throw new BadRequestException(
                "Reopen the closed ticket before updating it",
            );
        }

        if (
            dto.subject !== undefined &&
            dto.subject !== ticket.subject
        ) {
            const previousValue = ticket.subject;
            ticket.subject = dto.subject.trim();

            this.addTimeline(ticket, {
                eventType: TicketEventType.CATEGORY_CHANGED,
                description: "Ticket subject updated",
                actor,
                previousValue,
                newValue: ticket.subject,
            });
        }

        if (
            dto.description !== undefined &&
            dto.description !== ticket.description
        ) {
            const previousValue = ticket.description;
            ticket.description = dto.description.trim();

            this.addTimeline(ticket, {
                eventType: TicketEventType.MESSAGE_SENT,
                description: "Ticket description updated",
                actor,
                previousValue,
                newValue: ticket.description,
            });
        }

        if (
            dto.category !== undefined &&
            dto.category !== ticket.category
        ) {
            const previousValue = ticket.category;
            ticket.category = dto.category;

            this.addTimeline(ticket, {
                eventType: TicketEventType.CATEGORY_CHANGED,
                description: "Ticket category changed",
                actor,
                previousValue,
                newValue: dto.category,
            });
        }

        if (
            dto.priority !== undefined &&
            dto.priority !== ticket.priority
        ) {
            const previousValue = ticket.priority;
            ticket.priority = dto.priority;

            this.addTimeline(ticket, {
                eventType: TicketEventType.PRIORITY_CHANGED,
                description: "Ticket priority changed",
                actor,
                previousValue,
                newValue: dto.priority,
            });
        }

        if (dto.assignedTo !== undefined) {
            const oldAssigneeId = ticket.assignedTo
                ? ticket.assignedTo.toString()
                : null;

            const newAssignee = this.toObjectId(dto.assignedTo);
            const newAssigneeId = newAssignee?.toString() ?? null;

            if (oldAssigneeId !== newAssigneeId) {
                const previousAssigneeId =
                    ticket.assignedTo ?? null;

                ticket.assignedTo = newAssignee;
                ticket.assignedAgentName =
                    newAssignee
                        ? dto.assignedAgentName ?? null
                        : null;
                ticket.assignedAt = newAssignee ? now : null;

                this.addTimeline(ticket, {
                    eventType: newAssignee
                        ? oldAssigneeId
                            ? TicketEventType.REASSIGNED
                            : TicketEventType.ASSIGNED
                        : TicketEventType.REASSIGNED,
                    description: newAssignee
                        ? oldAssigneeId
                            ? "Ticket reassigned to another agent"
                            : "Ticket assigned to a support agent"
                        : "Ticket unassigned",
                    actor,
                    previousAssigneeId,
                    newAssigneeId: newAssignee,
                });
            }
        } else if (dto.assignedAgentName !== undefined) {
            ticket.assignedAgentName = dto.assignedAgentName;
        }

        if (dto.resolutionSummary !== undefined) {
            ticket.resolutionSummary = dto.resolutionSummary.trim();
        }

        if (
            dto.status !== undefined &&
            dto.status !== ticket.status
        ) {
            this.applyStatusChange(ticket, dto.status, actor);
        }

        ticket.lastActivityAt = now;
        await ticket.save();

        return {
            success: true,
            message: "Support ticket updated successfully",
            data: ticket,
        };
    }

    // ─── 7. Add Message / Internal Note ─────────────────

    async addMessage(
        ticketId: string,
        message: string,
        actor: TicketActor,
        attachments: TicketAttachmentInput[] = [],
        isInternal = false,
    ) {
        const ticket = await this.findTicket(ticketId);

        if (!message?.trim() && attachments.length === 0) {
            throw new BadRequestException(
                "Message or attachment is required",
            );
        }

        if (
            isInternal &&
            actor.type !== TicketActorType.ADMIN &&
            actor.type !== TicketActorType.SUPPORT_AGENT
        ) {
            throw new BadRequestException(
                "Only support staff can add internal notes",
            );
        }

        if (
            ticket.status === TicketStatus.CLOSED ||
            ticket.status === TicketStatus.RESOLVED
        ) {
            throw new BadRequestException(
                "Reopen the ticket before adding a message",
            );
        }

        const now = new Date();

        ticket.messages.push({
            senderId: this.toObjectId(actor.id),
            senderType: actor.type,
            message: message?.trim() ?? "",
            attachments: attachments.map((attachment) => ({
                fileName: attachment.fileName,
                fileUrl: attachment.fileUrl,
                mimeType: attachment.mimeType ?? null,
                sizeBytes: attachment.sizeBytes ?? null,
                uploadedBy: this.toObjectId(actor.id),
                uploadedByType: actor.type,
            })),
            isInternal,
            edited: false,
            editedAt: null,
        } as any);

        if (
            !isInternal &&
            actor.type !== TicketActorType.CUSTOMER &&
            !ticket.firstResponseAt
        ) {
            ticket.firstResponseAt = now;
        }

        this.addTimeline(ticket, {
            eventType: isInternal
                ? TicketEventType.INTERNAL_NOTE_ADDED
                : TicketEventType.MESSAGE_SENT,
            description: isInternal
                ? "Internal note added"
                : "Message added to ticket",
            actor,
            metadata: {
                messagePreview: message?.trim().slice(0, 150) ?? "",
                attachmentCount: attachments.length,
                isInternal,
            },
        });

        ticket.lastActivityAt = now;

        await ticket.save();

        return {
            success: true,
            message: isInternal
                ? "Internal note added successfully"
                : "Message added successfully",
            data: ticket,
        };
    }

    // ─── 8. Resolve Ticket ──────────────────────────────

    async resolveTicket(
        ticketId: string,
        resolutionSummary: string,
        actor: TicketActor,
    ) {
        if (!resolutionSummary?.trim()) {
            throw new BadRequestException(
                "Resolution summary is required",
            );
        }

        const ticket = await this.findTicket(ticketId);

        if (
            ticket.status === TicketStatus.RESOLVED ||
            ticket.status === TicketStatus.CLOSED
        ) {
            throw new BadRequestException(
                "Ticket is already resolved or closed",
            );
        }

        ticket.resolutionSummary = resolutionSummary.trim();

        this.applyStatusChange(
            ticket,
            TicketStatus.RESOLVED,
            actor,
        );

        await ticket.save();

        return {
            success: true,
            message: "Ticket resolved successfully",
            data: ticket,
        };
    }

    // ─── 9. Close Ticket ────────────────────────────────

    async closeTicket(
        ticketId: string,
        actor: TicketActor,
    ) {
        const ticket = await this.findTicket(ticketId);

        if (ticket.status === TicketStatus.CLOSED) {
            throw new BadRequestException(
                "Ticket is already closed",
            );
        }

        if (ticket.status !== TicketStatus.RESOLVED) {
            throw new BadRequestException(
                "Resolve the ticket before closing it",
            );
        }

        this.applyStatusChange(
            ticket,
            TicketStatus.CLOSED,
            actor,
        );

        await ticket.save();

        return {
            success: true,
            message: "Ticket closed successfully",
            data: ticket,
        };
    }

    // ─── 10. Reopen Ticket ──────────────────────────────

    async reopenTicket(
        ticketId: string,
        actor: TicketActor,
    ) {
        const ticket = await this.findTicket(ticketId);

        if (
            ticket.status !== TicketStatus.RESOLVED &&
            ticket.status !== TicketStatus.CLOSED
        ) {
            throw new BadRequestException(
                "Only resolved or closed tickets can be reopened",
            );
        }

        this.applyStatusChange(
            ticket,
            TicketStatus.REOPENED,
            actor,
        );

        ticket.reopenCount = (ticket.reopenCount ?? 0) + 1;
        ticket.reopenedAt = new Date();

        await ticket.save();

        return {
            success: true,
            message: "Ticket reopened successfully",
            data: ticket,
        };
    }

    // ─── 11. Status Changes + Timeline ──────────────────

    private applyStatusChange(
        ticket: any,
        newStatus: TicketStatus,
        actor: TicketActor,
    ) {
        const previousStatus = ticket.status as TicketStatus;

        const allowedTransitions: Record<string, TicketStatus[]> = {
            [TicketStatus.OPEN]: [
                TicketStatus.ASSIGNED,
                TicketStatus.IN_PROGRESS,
                TicketStatus.WAITING_FOR_CUSTOMER,
                TicketStatus.WAITING_FOR_SUPPORT,
                TicketStatus.ESCALATED,
                TicketStatus.RESOLVED,
            ],
            [TicketStatus.ASSIGNED]: [
                TicketStatus.IN_PROGRESS,
                TicketStatus.WAITING_FOR_CUSTOMER,
                TicketStatus.WAITING_FOR_SUPPORT,
                TicketStatus.ESCALATED,
                TicketStatus.RESOLVED,
            ],
            [TicketStatus.IN_PROGRESS]: [
                TicketStatus.WAITING_FOR_CUSTOMER,
                TicketStatus.WAITING_FOR_SUPPORT,
                TicketStatus.ESCALATED,
                TicketStatus.RESOLVED,
            ],
            [TicketStatus.WAITING_FOR_CUSTOMER]: [
                TicketStatus.IN_PROGRESS,
                TicketStatus.ESCALATED,
                TicketStatus.RESOLVED,
            ],
            [TicketStatus.WAITING_FOR_SUPPORT]: [
                TicketStatus.IN_PROGRESS,
                TicketStatus.ESCALATED,
                TicketStatus.RESOLVED,
            ],
            [TicketStatus.ESCALATED]: [
                TicketStatus.ASSIGNED,
                TicketStatus.IN_PROGRESS,
                TicketStatus.WAITING_FOR_CUSTOMER,
                TicketStatus.RESOLVED,
            ],
            [TicketStatus.RESOLVED]: [
                TicketStatus.CLOSED,
                TicketStatus.REOPENED,
            ],
            [TicketStatus.CLOSED]: [
                TicketStatus.REOPENED,
            ],
            [TicketStatus.REOPENED]: [
                TicketStatus.ASSIGNED,
                TicketStatus.IN_PROGRESS,
                TicketStatus.WAITING_FOR_CUSTOMER,
                TicketStatus.WAITING_FOR_SUPPORT,
                TicketStatus.ESCALATED,
                TicketStatus.RESOLVED,
            ],
        };

        if (
            previousStatus !== newStatus &&
            !allowedTransitions[previousStatus]?.includes(newStatus)
        ) {
            throw new BadRequestException(
                `Cannot change ticket status from ${previousStatus} to ${newStatus}`,
            );
        }

        if (previousStatus === newStatus) return;

        const now = new Date();

        ticket.status = newStatus;
        ticket.lastActivityAt = now;

        if (newStatus === TicketStatus.RESOLVED) {
            ticket.resolvedAt = now;
            ticket.resolvedBy = this.toObjectId(actor.id);
        }

        if (newStatus === TicketStatus.CLOSED) {
            ticket.closedAt = now;
        }

        if (newStatus === TicketStatus.REOPENED) {
            ticket.reopenedAt = now;
            ticket.resolvedAt = null;
            ticket.resolvedBy = null;
            ticket.closedAt = null;
        }

        let eventType = TicketEventType.STATUS_CHANGED;

        if (newStatus === TicketStatus.ESCALATED) {
            eventType = TicketEventType.ESCALATED;
        } else if (newStatus === TicketStatus.RESOLVED) {
            eventType = TicketEventType.RESOLVED;
        } else if (newStatus === TicketStatus.CLOSED) {
            eventType = TicketEventType.CLOSED;
        } else if (newStatus === TicketStatus.REOPENED) {
            eventType = TicketEventType.REOPENED;
        }

        this.addTimeline(ticket, {
            eventType,
            description: `Ticket status changed from ${previousStatus} to ${newStatus}`,
            actor,
            previousStatus,
            newStatus,
        });
    }
}