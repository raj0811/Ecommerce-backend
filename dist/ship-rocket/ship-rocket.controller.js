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
const crypto_1 = require("crypto");
const order_schema_1 = require("../database/schema/order.schema");
let ShipRocketController = class ShipRocketController {
    shipRocketService;
    databaseService;
    constructor(shipRocketService, databaseService) {
        this.shipRocketService = shipRocketService;
        this.databaseService = databaseService;
    }
    async webhook(body, req) {
        try {
            const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;
            if (!secret) {
                throw new common_1.InternalServerErrorException('Webhook security is not configured');
            }
            const authorization = req.headers['authorization'];
            if (!authorization || typeof authorization !== 'string') {
                throw new common_1.UnauthorizedException('Authorization header missing');
            }
            const expected = Buffer.from(secret, 'utf8');
            const received = Buffer.from(authorization, 'utf8');
            const isValid = expected.length === received.length &&
                (0, crypto_1.timingSafeEqual)(expected, received);
            if (!isValid) {
                throw new common_1.UnauthorizedException('Invalid webhook authorization');
            }
            await this.databaseService.webhookLogModel.create({
                log: JSON.stringify(body),
                headers: JSON.stringify({
                    'user-agent': req.headers['user-agent'],
                    'content-type': req.headers['content-type'],
                    'x-forwarded-for': req.headers['x-forwarded-for'],
                }),
                event: 'Shiprocket',
            });
            const { order_id, sr_order_id, shipment_status, shipment_status_id, current_status, current_timestamp, scans, pickup_scheduled_date, awb, courier_name, etd, } = body;
            if (!order_id && !sr_order_id) {
                return {
                    success: false,
                    message: 'Order identifier missing',
                };
            }
            const normalizedCurrentStatus = String(current_status || '')
                .trim()
                .toUpperCase();
            const normalizedShipmentStatus = String(shipment_status || '')
                .trim()
                .toUpperCase();
            const normalizedStatus = normalizedShipmentStatus || normalizedCurrentStatus;
            const conditions = [];
            if (order_id) {
                conditions.push({ orderNumber: String(order_id) });
            }
            if (sr_order_id) {
                conditions.push({
                    shiprocketOrderId: String(sr_order_id),
                });
            }
            const order = await this.databaseService.orderModel.findOne({
                $or: conditions,
            });
            if (!order) {
                return {
                    success: false,
                    message: 'Order not found',
                };
            }
            if (normalizedStatus === 'CANCELLED' ||
                normalizedCurrentStatus === 'CANCELED' ||
                normalizedCurrentStatus === 'CANCELLED') {
                if (order.status === order_schema_1.OrderStatus.CANCELLED) {
                    return {
                        success: true,
                        message: 'Cancellation already processed',
                        ignored: true,
                    };
                }
            }
            let orderStatus;
            if (normalizedStatus === 'DELIVERED' ||
                normalizedCurrentStatus === 'DELIVERED') {
                orderStatus = order_schema_1.OrderStatus.DELIVERED;
            }
            else if (normalizedStatus === 'CANCELLED' ||
                normalizedStatus === 'CANCELED' ||
                normalizedCurrentStatus === 'CANCELLED' ||
                normalizedCurrentStatus === 'CANCELED') {
                orderStatus = order_schema_1.OrderStatus.CANCELLED;
            }
            else if (normalizedStatus === 'IN TRANSIT' ||
                normalizedStatus === 'IN_TRANSIT' ||
                normalizedCurrentStatus === 'IN TRANSIT' ||
                normalizedCurrentStatus === 'IN_TRANSIT') {
                orderStatus = order_schema_1.OrderStatus.IN_TRANSIT;
            }
            else if (normalizedStatus === 'SHIPPED' ||
                normalizedStatus === 'PICKED UP') {
                orderStatus = order_schema_1.OrderStatus.SHIPPED;
            }
            const parseShiprocketDate = (value) => {
                if (!value || typeof value !== 'string')
                    return null;
                const trimmed = value.trim();
                if (!trimmed)
                    return null;
                const match = trimmed.match(/^(\d{2}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
                if (match) {
                    const [, day, month, year, hour, minute, second] = match;
                    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
                    return Number.isNaN(date.getTime()) ? null : date;
                }
                const date = new Date(trimmed);
                return Number.isNaN(date.getTime()) ? null : date;
            };
            const update = {
                shipmentCurrentStatus: current_status || null,
                shipmentStatus: shipment_status || null,
                shipmentStatusId: shipment_status_id != null
                    ? Number(shipment_status_id)
                    : null,
                shipmentCurrentTimestamp: parseShiprocketDate(current_timestamp),
            };
            if (sr_order_id != null) {
                update.shiprocketOrderId = String(sr_order_id);
            }
            if (awb) {
                update.awb = String(awb);
                update.trackingNumber = String(awb);
            }
            if (courier_name) {
                update.courierName = courier_name;
            }
            if (etd && String(etd).trim()) {
                update.shipmentEtd = parseShiprocketDate(etd);
            }
            if (Array.isArray(scans)) {
                update.scans = scans.map((scan) => ({
                    date: scan.date || '',
                    status: scan.status || '',
                    activity: scan.activity || '',
                    location: scan.location || '',
                    'sr-status': scan['sr-status'] != null
                        ? String(scan['sr-status'])
                        : '',
                    'sr-status-label': scan['sr-status-label'] || '',
                }));
                update.shipmentScans = scans.map((scan) => ({
                    date: scan.date || '',
                    activity: scan.activity || '',
                    location: scan.location || '',
                }));
            }
            if (orderStatus) {
                if (order.status !== order_schema_1.OrderStatus.DELIVERED) {
                    update.status = orderStatus;
                }
            }
            if (orderStatus === order_schema_1.OrderStatus.DELIVERED) {
                update.deliveredAt = new Date();
            }
            if (orderStatus === order_schema_1.OrderStatus.CANCELLED) {
                update.cancelledAt = new Date();
            }
            await this.databaseService.orderModel.findByIdAndUpdate(order._id, { $set: update }, { new: true, runValidators: true });
            return {
                success: true,
                message: 'Shiprocket webhook processed successfully',
                orderNumber: order.orderNumber,
                shipmentStatus: normalizedStatus,
            };
        }
        catch (error) {
            throw error;
        }
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
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShipRocketController.prototype, "webhook", null);
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