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
exports.SupportTicketService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const crypto_1 = require("crypto");
const database_service_1 = require("../database/database.service");
const support_ticket_schema_1 = require("../database/schema/support-ticket.schema");
let SupportTicketService = class SupportTicketService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    get ticketModel() {
        return this.databaseService.supportTicketModel;
    }
    generateTicketNumber() {
        return `TKT-${Date.now()}-${(0, crypto_1.randomBytes)(3)
            .toString("hex")
            .toUpperCase()}`;
    }
    toObjectId(id) {
        if (!id)
            return null;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException("Invalid ID");
        }
        return new mongoose_1.Types.ObjectId(id);
    }
    async findTicket(ticketId) {
        if (!mongoose_1.Types.ObjectId.isValid(ticketId)) {
            throw new common_1.BadRequestException("Invalid ticket ID");
        }
        const ticket = await this.ticketModel.findOne({
            _id: new mongoose_1.Types.ObjectId(ticketId),
            deletedAt: null,
        });
        if (!ticket) {
            throw new common_1.NotFoundException("Support ticket not found");
        }
        return ticket;
    }
    addTimeline(ticket, event) {
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
            previousAssigneeId: event.previousAssigneeId ?? null,
            newAssigneeId: event.newAssigneeId ?? null,
            metadata: event.metadata ?? {},
            createdAt: new Date(),
        });
    }
    normalizePagination(page = 1, limit = 10) {
        const currentPage = Math.max(1, Number(page) || 1);
        const perPage = Math.min(100, Math.max(1, Number(limit) || 10));
        return {
            currentPage,
            perPage,
            skip: (currentPage - 1) * perPage,
        };
    }
    async createTicket(dto, actor) {
        if (!dto.userId && !dto.guestId?.trim()) {
            throw new common_1.BadRequestException("A user ID or guest ID is required");
        }
        if (dto.userId && !mongoose_1.Types.ObjectId.isValid(dto.userId)) {
            throw new common_1.BadRequestException("Invalid user ID");
        }
        if (dto.orderId && !mongoose_1.Types.ObjectId.isValid(dto.orderId)) {
            throw new common_1.BadRequestException("Invalid order ID");
        }
        if (!dto.customerName?.trim()) {
            throw new common_1.BadRequestException("Customer name is required");
        }
        if (!dto.customerEmail?.trim()) {
            throw new common_1.BadRequestException("Customer email is required");
        }
        if (!dto.subject?.trim() || !dto.description?.trim()) {
            throw new common_1.BadRequestException("Subject and description are required");
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
            category: dto.category ?? support_ticket_schema_1.TicketCategory.OTHER,
            priority: dto.priority ?? support_ticket_schema_1.TicketPriority.MEDIUM,
            status: support_ticket_schema_1.TicketStatus.OPEN,
            orderId: this.toObjectId(dto.orderId),
            orderNumber: dto.orderNumber ?? null,
            messages: [],
            timeline: [],
            attachments: [],
            lastActivityAt: now,
        });
        this.addTimeline(ticket, {
            eventType: support_ticket_schema_1.TicketEventType.TICKET_CREATED,
            description: "Support ticket created",
            actor: actor ?? {
                id: dto.userId,
                type: support_ticket_schema_1.TicketActorType.CUSTOMER,
                name: dto.customerName,
            },
            newStatus: support_ticket_schema_1.TicketStatus.OPEN,
            metadata: { ticketNumber },
        });
        await ticket.save();
        return {
            success: true,
            message: "Support ticket created successfully",
            data: ticket,
        };
    }
    async getTicketById(ticketId) {
        const ticket = await this.findTicket(ticketId);
        return {
            success: true,
            data: ticket,
        };
    }
    async getAllTickets(page = 1, limit = 10, status, priority, search) {
        const { currentPage, perPage, skip } = this.normalizePagination(page, limit);
        const filter = {
            deletedAt: null,
        };
        if (status)
            filter.status = status;
        if (priority)
            filter.priority = priority;
        if (search?.trim()) {
            const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
    async getUserTickets(userId, page = 1, limit = 10) {
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException("Invalid user ID");
        }
        return this.getTicketsByOwner({ userId: new mongoose_1.Types.ObjectId(userId) }, page, limit);
    }
    async getGuestTickets(guestId, page = 1, limit = 10) {
        if (!guestId?.trim()) {
            throw new common_1.BadRequestException("Guest ID is required");
        }
        return this.getTicketsByOwner({ guestId: guestId.trim() }, page, limit);
    }
    async getTicketsByOwner(ownerFilter, page = 1, limit = 10) {
        const { currentPage, perPage, skip } = this.normalizePagination(page, limit);
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
    async updateTicket(ticketId, dto, actor) {
        const ticket = await this.findTicket(ticketId);
        const now = new Date();
        if (ticket.status === support_ticket_schema_1.TicketStatus.CLOSED &&
            dto.status !== support_ticket_schema_1.TicketStatus.REOPENED) {
            throw new common_1.BadRequestException("Reopen the closed ticket before updating it");
        }
        if (dto.subject !== undefined &&
            dto.subject !== ticket.subject) {
            const previousValue = ticket.subject;
            ticket.subject = dto.subject.trim();
            this.addTimeline(ticket, {
                eventType: support_ticket_schema_1.TicketEventType.CATEGORY_CHANGED,
                description: "Ticket subject updated",
                actor,
                previousValue,
                newValue: ticket.subject,
            });
        }
        if (dto.description !== undefined &&
            dto.description !== ticket.description) {
            const previousValue = ticket.description;
            ticket.description = dto.description.trim();
            this.addTimeline(ticket, {
                eventType: support_ticket_schema_1.TicketEventType.MESSAGE_SENT,
                description: "Ticket description updated",
                actor,
                previousValue,
                newValue: ticket.description,
            });
        }
        if (dto.category !== undefined &&
            dto.category !== ticket.category) {
            const previousValue = ticket.category;
            ticket.category = dto.category;
            this.addTimeline(ticket, {
                eventType: support_ticket_schema_1.TicketEventType.CATEGORY_CHANGED,
                description: "Ticket category changed",
                actor,
                previousValue,
                newValue: dto.category,
            });
        }
        if (dto.priority !== undefined &&
            dto.priority !== ticket.priority) {
            const previousValue = ticket.priority;
            ticket.priority = dto.priority;
            this.addTimeline(ticket, {
                eventType: support_ticket_schema_1.TicketEventType.PRIORITY_CHANGED,
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
                const previousAssigneeId = ticket.assignedTo ?? null;
                ticket.assignedTo = newAssignee;
                ticket.assignedAgentName =
                    newAssignee
                        ? dto.assignedAgentName ?? null
                        : null;
                ticket.assignedAt = newAssignee ? now : null;
                this.addTimeline(ticket, {
                    eventType: newAssignee
                        ? oldAssigneeId
                            ? support_ticket_schema_1.TicketEventType.REASSIGNED
                            : support_ticket_schema_1.TicketEventType.ASSIGNED
                        : support_ticket_schema_1.TicketEventType.REASSIGNED,
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
        }
        else if (dto.assignedAgentName !== undefined) {
            ticket.assignedAgentName = dto.assignedAgentName;
        }
        if (dto.resolutionSummary !== undefined) {
            ticket.resolutionSummary = dto.resolutionSummary.trim();
        }
        if (dto.status !== undefined &&
            dto.status !== ticket.status) {
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
    async addMessage(ticketId, message, actor, attachments = [], isInternal = false) {
        const ticket = await this.findTicket(ticketId);
        if (!message?.trim() && attachments.length === 0) {
            throw new common_1.BadRequestException("Message or attachment is required");
        }
        if (isInternal &&
            actor.type !== support_ticket_schema_1.TicketActorType.ADMIN &&
            actor.type !== support_ticket_schema_1.TicketActorType.SUPPORT_AGENT) {
            throw new common_1.BadRequestException("Only support staff can add internal notes");
        }
        if (ticket.status === support_ticket_schema_1.TicketStatus.CLOSED ||
            ticket.status === support_ticket_schema_1.TicketStatus.RESOLVED) {
            throw new common_1.BadRequestException("Reopen the ticket before adding a message");
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
        });
        if (!isInternal &&
            actor.type !== support_ticket_schema_1.TicketActorType.CUSTOMER &&
            !ticket.firstResponseAt) {
            ticket.firstResponseAt = now;
        }
        this.addTimeline(ticket, {
            eventType: isInternal
                ? support_ticket_schema_1.TicketEventType.INTERNAL_NOTE_ADDED
                : support_ticket_schema_1.TicketEventType.MESSAGE_SENT,
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
    async resolveTicket(ticketId, resolutionSummary, actor) {
        if (!resolutionSummary?.trim()) {
            throw new common_1.BadRequestException("Resolution summary is required");
        }
        const ticket = await this.findTicket(ticketId);
        if (ticket.status === support_ticket_schema_1.TicketStatus.RESOLVED ||
            ticket.status === support_ticket_schema_1.TicketStatus.CLOSED) {
            throw new common_1.BadRequestException("Ticket is already resolved or closed");
        }
        ticket.resolutionSummary = resolutionSummary.trim();
        this.applyStatusChange(ticket, support_ticket_schema_1.TicketStatus.RESOLVED, actor);
        await ticket.save();
        return {
            success: true,
            message: "Ticket resolved successfully",
            data: ticket,
        };
    }
    async closeTicket(ticketId, actor) {
        const ticket = await this.findTicket(ticketId);
        if (ticket.status === support_ticket_schema_1.TicketStatus.CLOSED) {
            throw new common_1.BadRequestException("Ticket is already closed");
        }
        if (ticket.status !== support_ticket_schema_1.TicketStatus.RESOLVED) {
            throw new common_1.BadRequestException("Resolve the ticket before closing it");
        }
        this.applyStatusChange(ticket, support_ticket_schema_1.TicketStatus.CLOSED, actor);
        await ticket.save();
        return {
            success: true,
            message: "Ticket closed successfully",
            data: ticket,
        };
    }
    async reopenTicket(ticketId, actor) {
        const ticket = await this.findTicket(ticketId);
        if (ticket.status !== support_ticket_schema_1.TicketStatus.RESOLVED &&
            ticket.status !== support_ticket_schema_1.TicketStatus.CLOSED) {
            throw new common_1.BadRequestException("Only resolved or closed tickets can be reopened");
        }
        this.applyStatusChange(ticket, support_ticket_schema_1.TicketStatus.REOPENED, actor);
        ticket.reopenCount = (ticket.reopenCount ?? 0) + 1;
        ticket.reopenedAt = new Date();
        await ticket.save();
        return {
            success: true,
            message: "Ticket reopened successfully",
            data: ticket,
        };
    }
    applyStatusChange(ticket, newStatus, actor) {
        const previousStatus = ticket.status;
        const allowedTransitions = {
            [support_ticket_schema_1.TicketStatus.OPEN]: [
                support_ticket_schema_1.TicketStatus.ASSIGNED,
                support_ticket_schema_1.TicketStatus.IN_PROGRESS,
                support_ticket_schema_1.TicketStatus.WAITING_FOR_CUSTOMER,
                support_ticket_schema_1.TicketStatus.WAITING_FOR_SUPPORT,
                support_ticket_schema_1.TicketStatus.ESCALATED,
                support_ticket_schema_1.TicketStatus.RESOLVED,
            ],
            [support_ticket_schema_1.TicketStatus.ASSIGNED]: [
                support_ticket_schema_1.TicketStatus.IN_PROGRESS,
                support_ticket_schema_1.TicketStatus.WAITING_FOR_CUSTOMER,
                support_ticket_schema_1.TicketStatus.WAITING_FOR_SUPPORT,
                support_ticket_schema_1.TicketStatus.ESCALATED,
                support_ticket_schema_1.TicketStatus.RESOLVED,
            ],
            [support_ticket_schema_1.TicketStatus.IN_PROGRESS]: [
                support_ticket_schema_1.TicketStatus.WAITING_FOR_CUSTOMER,
                support_ticket_schema_1.TicketStatus.WAITING_FOR_SUPPORT,
                support_ticket_schema_1.TicketStatus.ESCALATED,
                support_ticket_schema_1.TicketStatus.RESOLVED,
            ],
            [support_ticket_schema_1.TicketStatus.WAITING_FOR_CUSTOMER]: [
                support_ticket_schema_1.TicketStatus.IN_PROGRESS,
                support_ticket_schema_1.TicketStatus.ESCALATED,
                support_ticket_schema_1.TicketStatus.RESOLVED,
            ],
            [support_ticket_schema_1.TicketStatus.WAITING_FOR_SUPPORT]: [
                support_ticket_schema_1.TicketStatus.IN_PROGRESS,
                support_ticket_schema_1.TicketStatus.ESCALATED,
                support_ticket_schema_1.TicketStatus.RESOLVED,
            ],
            [support_ticket_schema_1.TicketStatus.ESCALATED]: [
                support_ticket_schema_1.TicketStatus.ASSIGNED,
                support_ticket_schema_1.TicketStatus.IN_PROGRESS,
                support_ticket_schema_1.TicketStatus.WAITING_FOR_CUSTOMER,
                support_ticket_schema_1.TicketStatus.RESOLVED,
            ],
            [support_ticket_schema_1.TicketStatus.RESOLVED]: [
                support_ticket_schema_1.TicketStatus.CLOSED,
                support_ticket_schema_1.TicketStatus.REOPENED,
            ],
            [support_ticket_schema_1.TicketStatus.CLOSED]: [
                support_ticket_schema_1.TicketStatus.REOPENED,
            ],
            [support_ticket_schema_1.TicketStatus.REOPENED]: [
                support_ticket_schema_1.TicketStatus.ASSIGNED,
                support_ticket_schema_1.TicketStatus.IN_PROGRESS,
                support_ticket_schema_1.TicketStatus.WAITING_FOR_CUSTOMER,
                support_ticket_schema_1.TicketStatus.WAITING_FOR_SUPPORT,
                support_ticket_schema_1.TicketStatus.ESCALATED,
                support_ticket_schema_1.TicketStatus.RESOLVED,
            ],
        };
        if (previousStatus !== newStatus &&
            !allowedTransitions[previousStatus]?.includes(newStatus)) {
            throw new common_1.BadRequestException(`Cannot change ticket status from ${previousStatus} to ${newStatus}`);
        }
        if (previousStatus === newStatus)
            return;
        const now = new Date();
        ticket.status = newStatus;
        ticket.lastActivityAt = now;
        if (newStatus === support_ticket_schema_1.TicketStatus.RESOLVED) {
            ticket.resolvedAt = now;
            ticket.resolvedBy = this.toObjectId(actor.id);
        }
        if (newStatus === support_ticket_schema_1.TicketStatus.CLOSED) {
            ticket.closedAt = now;
        }
        if (newStatus === support_ticket_schema_1.TicketStatus.REOPENED) {
            ticket.reopenedAt = now;
            ticket.resolvedAt = null;
            ticket.resolvedBy = null;
            ticket.closedAt = null;
        }
        let eventType = support_ticket_schema_1.TicketEventType.STATUS_CHANGED;
        if (newStatus === support_ticket_schema_1.TicketStatus.ESCALATED) {
            eventType = support_ticket_schema_1.TicketEventType.ESCALATED;
        }
        else if (newStatus === support_ticket_schema_1.TicketStatus.RESOLVED) {
            eventType = support_ticket_schema_1.TicketEventType.RESOLVED;
        }
        else if (newStatus === support_ticket_schema_1.TicketStatus.CLOSED) {
            eventType = support_ticket_schema_1.TicketEventType.CLOSED;
        }
        else if (newStatus === support_ticket_schema_1.TicketStatus.REOPENED) {
            eventType = support_ticket_schema_1.TicketEventType.REOPENED;
        }
        this.addTimeline(ticket, {
            eventType,
            description: `Ticket status changed from ${previousStatus} to ${newStatus}`,
            actor,
            previousStatus,
            newStatus,
        });
    }
};
exports.SupportTicketService = SupportTicketService;
exports.SupportTicketService = SupportTicketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], SupportTicketService);
//# sourceMappingURL=support-ticket.service.js.map