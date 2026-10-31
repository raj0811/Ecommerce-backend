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
exports.ShipRocketController = void 0;
const common_1 = require("@nestjs/common");
const ship_rocket_service_1 = require("./ship-rocket.service");
const admin_AuthGuard_1 = require("../Guards/admin.AuthGuard");
const database_service_1 = require("../database/database.service");
let ShipRocketController = class ShipRocketController {
    shipRocketService;
    databaseService;
    constructor(shipRocketService, databaseService) {
        this.shipRocketService = shipRocketService;
        this.databaseService = databaseService;
    }
    async testWebhook(body, req) {
        try {
            const headers = req.headers;
            await this.databaseService.webhookLogModel.create({
                log: JSON.stringify(body),
                headers: JSON.stringify(headers),
                event: "Ship Rocket"
            });
        }
        catch (e) {
            console.log('fail to save logs');
        }
        return true;
    }
    async getOrders(page, perPage, sort, sortBy, from, to, filterBy, filter, search) {
        const parsedPage = page === undefined ? 1 : Number(page);
        const parsedPerPage = perPage === undefined ? 10 : Number(perPage);
        if (!Number.isInteger(parsedPage) || parsedPage < 1) {
            throw new common_1.BadRequestException("page must be a positive integer");
        }
        if (!Number.isInteger(parsedPerPage) ||
            parsedPerPage < 1 ||
            parsedPerPage > 100) {
            throw new common_1.BadRequestException("per_page must be between 1 and 100");
        }
        if (sort && !["ASC", "DESC"].includes(sort)) {
            throw new common_1.BadRequestException("sort must be ASC or DESC");
        }
        if (sortBy && !["id", "status"].includes(sortBy)) {
            throw new common_1.BadRequestException("sort_by must be id or status");
        }
        if (from && Number.isNaN(Date.parse(from))) {
            throw new common_1.BadRequestException("Invalid from date");
        }
        if (to && Number.isNaN(Date.parse(to))) {
            throw new common_1.BadRequestException("Invalid to date");
        }
        if (from && to && new Date(from) > new Date(to)) {
            throw new common_1.BadRequestException("from date cannot be later than to date");
        }
        return this.shipRocketService.getOrders({
            page: parsedPage,
            per_page: parsedPerPage,
            sort,
            sort_by: sortBy,
            from,
            to,
            filter_by: filterBy,
            filter,
            search,
        });
    }
    async trackOrder(order_id) {
        return await this.shipRocketService.trackorder(order_id);
    }
};
exports.ShipRocketController = ShipRocketController;
__decorate([
    (0, common_1.Post)('/webhook'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShipRocketController.prototype, "testWebhook", null);
__decorate([
    (0, common_1.Get)("orders"),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("per_page")),
    __param(2, (0, common_1.Query)("sort")),
    __param(3, (0, common_1.Query)("sort_by")),
    __param(4, (0, common_1.Query)("from")),
    __param(5, (0, common_1.Query)("to")),
    __param(6, (0, common_1.Query)("filter_by")),
    __param(7, (0, common_1.Query)("filter")),
    __param(8, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ShipRocketController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)("/track"),
    __param(0, (0, common_1.Query)("order_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShipRocketController.prototype, "trackOrder", null);
exports.ShipRocketController = ShipRocketController = __decorate([
    (0, common_1.Controller)('ship-rocket'),
    __metadata("design:paramtypes", [ship_rocket_service_1.ShipRocketService,
        database_service_1.DatabaseService])
], ShipRocketController);
//# sourceMappingURL=ship-rocket.controller.js.map