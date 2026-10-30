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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportTicketController = void 0;
const common_1 = require("@nestjs/common");
const support_ticket_service_1 = require("./support-ticket.service");
const support_ticket_schema_1 = require("../database/schema/support-ticket.schema");
const user_AuthGuard_1 = require("../Guards/user.AuthGuard");
const admin_AuthGuard_1 = require("../Guards/admin.AuthGuard");
let SupportTicketController = class SupportTicketController {
    supportTicketService;
    constructor(supportTicketService) {
        this.supportTicketService = supportTicketService;
    }
    getActor(req, type) {
        const id = req.user?.id ?? req.user?._id;
        return {
            id,
            type,
            name: req.user?.name ?? req.user?.email ?? type,
        };
    }
    async createUserTicket(req, body) {
        const userId = req.user?.id ?? req.user?._id;
        if (!userId) {
            throw new Error("Authenticated user ID not found");
        }
        return this.supportTicketService.createTicket({
            ...body,
            userId,
            customerName: req.user.name ?? "",
            customerEmail: req.user.email ?? "",
        }, this.getActor(req, support_ticket_schema_1.TicketActorType.CUSTOMER));
    }
    async createGuestTicket(body) {
        const { guestId, ...ticketData } = body;
        return this.supportTicketService.createTicket({
            ...ticketData,
            guestId,
        }, {
            type: support_ticket_schema_1.TicketActorType.CUSTOMER,
            name: body.customerName,
        });
    }
    async getMyTickets(req, page, limit) {
        const userId = req.user?.id ?? req.user?._id;
        if (!userId) {
            throw new Error("Authenticated user ID not found");
        }
        return this.supportTicketService.getUserTickets(userId, page, limit);
    }
    async getGuestTickets(guestId, page, limit) {
        return this.supportTicketService.getGuestTickets(guestId, page, limit);
    }
    async getAllTickets(page, limit, status, priority, search) {
        return this.supportTicketService.getAllTickets(page, limit, status, priority, search);
    }
    async getTicketById(ticketId) {
        return this.supportTicketService.getTicketById(ticketId);
    }
    async updateTicket(ticketId, req, body) {
        return this.supportTicketService.updateTicket(ticketId, body, this.getActor(req, support_ticket_schema_1.TicketActorType.ADMIN));
    }
    async addMessage(ticketId, req, body) {
        return this.supportTicketService.addMessage(ticketId, body.message, this.getActor(req, support_ticket_schema_1.TicketActorType.CUSTOMER), body.attachments ?? [], false);
    }
    async addAdminMessage(ticketId, req, body) {
        return this.supportTicketService.addMessage(ticketId, body.message, this.getActor(req, support_ticket_schema_1.TicketActorType.ADMIN), body.attachments ?? [], body.isInternal ?? false);
    }
    async resolveTicket(ticketId, req, body) {
        return this.supportTicketService.resolveTicket(ticketId, body.resolutionSummary, this.getActor(req, support_ticket_schema_1.TicketActorType.ADMIN));
    }
    async closeTicket(ticketId, req) {
        return this.supportTicketService.closeTicket(ticketId, this.getActor(req, support_ticket_schema_1.TicketActorType.ADMIN));
    }
    async reopenTicket(ticketId, req) {
        return this.supportTicketService.reopenTicket(ticketId, this.getActor(req, support_ticket_schema_1.TicketActorType.ADMIN));
    }
};
exports.SupportTicketController = SupportTicketController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(user_AuthGuard_1.UserAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "createUserTicket", null);
__decorate([
    (0, common_1.Post)("guest"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "createGuestTicket", null);
__decorate([
    (0, common_1.Get)("my"),
    (0, common_1.UseGuards)(user_AuthGuard_1.UserAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("page", new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)("limit", new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "getMyTickets", null);
__decorate([
    (0, common_1.Get)("guest/:guestId"),
    __param(0, (0, common_1.Param)("guestId")),
    __param(1, (0, common_1.Query)("page", new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)("limit", new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "getGuestTickets", null);
__decorate([
    (0, common_1.Get)("admin/all"),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Query)("page", new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("limit", new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)("status")),
    __param(3, (0, common_1.Query)("priority")),
    __param(4, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "getAllTickets", null);
__decorate([
    (0, common_1.Get)("admin/:ticketId"),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)("ticketId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "getTicketById", null);
__decorate([
    (0, common_1.Patch)("admin/:ticketId"),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)("ticketId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "updateTicket", null);
__decorate([
    (0, common_1.Post)(":ticketId/messages"),
    (0, common_1.UseGuards)(user_AuthGuard_1.UserAuthGuard),
    __param(0, (0, common_1.Param)("ticketId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "addMessage", null);
__decorate([
    (0, common_1.Post)("admin/:ticketId/messages"),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)("ticketId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "addAdminMessage", null);
__decorate([
    (0, common_1.Patch)("admin/:ticketId/resolve"),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)("ticketId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "resolveTicket", null);
__decorate([
    (0, common_1.Patch)("admin/:ticketId/close"),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)("ticketId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "closeTicket", null);
__decorate([
    (0, common_1.Patch)("admin/:ticketId/reopen"),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)("ticketId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "reopenTicket", null);
exports.SupportTicketController = SupportTicketController = __decorate([
    (0, common_1.Controller)("support-tickets"),
    __metadata("design:paramtypes", [support_ticket_service_1.SupportTicketService])
], SupportTicketController);
//# sourceMappingURL=support-ticket.controller.js.map