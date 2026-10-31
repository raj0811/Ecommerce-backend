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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const order_schema_1 = require("../database/schema/order.schema");
const user_AuthGuard_1 = require("../Guards/user.AuthGuard");
const admin_AuthGuard_1 = require("../Guards/admin.AuthGuard");
const admin_schema_1 = require("../database/schema/admin.schema");
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    async getAllOrders(req, page, limit, status) {
        const allowedRoles = [
            admin_schema_1.AdminRole.SUPER_ADMIN,
            admin_schema_1.AdminRole.ADMIN,
            admin_schema_1.AdminRole.OPERATIONS,
        ];
        if (!allowedRoles.includes(req.user?.role)) {
            throw new common_1.ForbiddenException('You do not have permission to add products');
        }
        return this.orderService.getAllOrders(page, limit, status);
    }
    async updateOrderStatus(req, orderId, body) {
        const allowedRoles = [
            admin_schema_1.AdminRole.SUPER_ADMIN,
            admin_schema_1.AdminRole.ADMIN,
            admin_schema_1.AdminRole.OPERATIONS,
        ];
        if (!allowedRoles.includes(req.user?.role)) {
            throw new common_1.ForbiddenException('You do not have permission to add products');
        }
        if (body.status === order_schema_1.OrderStatus.REFUND_INITIATED) {
            if (body.refundAmount === undefined) {
                throw new common_1.BadRequestException("Refund amount is required.");
            }
            return this.orderService.initiateOrderRefund(orderId, body.refundAmount);
        }
        return this.orderService.updateOrderStatus(orderId, body.status, body.trackingNumber);
    }
    async updateOrderStatusUser(orderId, body) {
        let { status } = body;
        if (status === "CANCELLED") {
            status = order_schema_1.OrderStatus.CANCELLATION_REQUESTED;
        }
        return this.orderService.updateOrderStatus(orderId, status);
    }
    async getOrderById(orderId, req) {
        const userId = req.user.id;
        return this.orderService.getOrderById(orderId, userId);
    }
    async getGuestOrders(guestId, page, limit) {
        return this.orderService.getGuestOrder(guestId, page, limit);
    }
    async getUserOrders(req, page = "1", limit = "10") {
        return this.orderService.getUserOrder(req.user.id, Number(page), Number(limit));
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Patch)('admin/:orderId/status'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("orderId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Patch)('user/:orderId/status'),
    (0, common_1.UseGuards)(user_AuthGuard_1.UserAuthGuard),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateOrderStatusUser", null);
__decorate([
    (0, common_1.Get)('info/:orderId'),
    (0, common_1.UseGuards)(user_AuthGuard_1.UserAuthGuard),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Get)('guest/:guestId'),
    __param(0, (0, common_1.Param)('guestId')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getGuestOrders", null);
__decorate([
    (0, common_1.Get)("my-orders"),
    (0, common_1.UseGuards)(user_AuthGuard_1.UserAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getUserOrders", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map