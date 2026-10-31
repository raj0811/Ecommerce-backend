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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipRocketService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const database_service_1 = require("../database/database.service");
const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';
let ShipRocketService = class ShipRocketService {
    databaseService;
    token = null;
    tokenExpiresAt = 0;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async authenticate() {
        if (this.token && Date.now() < this.tokenExpiresAt) {
            return this.token;
        }
        const email = process.env.SHIPROCKET_EMAIL;
        const password = process.env.SHIPROCKET_PASSWORD;
        if (!email || !password) {
            throw new common_1.InternalServerErrorException('Shiprocket API credentials are not configured.');
        }
        try {
            const { data } = await axios_1.default.post(`${SHIPROCKET_BASE_URL}/auth/login`, { email, password });
            if (!data?.token) {
                throw new Error('Shiprocket did not return an auth token.');
            }
            this.token = data.token;
            this.tokenExpiresAt =
                Date.now() + 9 * 24 * 60 * 60 * 1000;
            return this.token;
        }
        catch {
            this.token = null;
            this.tokenExpiresAt = 0;
            throw new common_1.InternalServerErrorException('Unable to authenticate with Shiprocket.');
        }
    }
    async post(path, payload) {
        const token = await this.authenticate();
        try {
            const { data } = await axios_1.default.post(`${SHIPROCKET_BASE_URL}${path}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                timeout: 15000,
            });
            return data;
        }
        catch (error) {
            console.log(error?.response, 'error11');
            if (axios_1.default.isAxiosError(error) && error.response?.status === 401) {
                this.token = null;
                this.tokenExpiresAt = 0;
            }
            throw new common_1.InternalServerErrorException('Shiprocket API request failed.');
        }
    }
    async createShipmentOrder(payload) {
        return this.post('/orders/create/adhoc', payload);
    }
    async handleWebhook(payload) {
        if (payload.awb === undefined || payload.awb === null) {
            return {
                success: false,
                message: "AWB is missing",
            };
        }
        const awb = String(payload.awb).trim();
        if (!awb) {
            return {
                success: false,
                message: "AWB is invalid",
            };
        }
        const scans = Array.isArray(payload.scans)
            ? payload.scans
                .filter((scan) => scan &&
                typeof scan.date === "string" &&
                typeof scan.activity === "string")
                .map((scan) => ({
                date: scan.date,
                activity: scan.activity,
                location: scan.location ?? "",
            }))
            : [];
        const order = await this.databaseService.orderModel.findOne({
            awb,
        });
        if (!order) {
            return {
                success: true,
                matched: false,
                message: "Webhook received; no matching order found",
                awb,
            };
        }
        const update = {
            shipmentStatus: payload.shipment_status ??
                payload.current_status ??
                null,
            shipmentCurrentStatus: payload.current_status ??
                payload.shipment_status ??
                null,
        };
        if (payload.order_id !== undefined) {
            update.shiprocketOrderId = String(payload.order_id);
        }
        if (payload.shipment_status_id !== undefined) {
            update.shipmentStatusId = payload.shipment_status_id;
        }
        else if (payload.current_status_id !== undefined) {
            update.shipmentStatusId = payload.current_status_id;
        }
        if (payload.courier_name !== undefined) {
            update.courierName = payload.courier_name;
        }
        if (payload.etd) {
            const etd = new Date(payload.etd);
            if (!Number.isNaN(etd.getTime())) {
                update.shipmentEtd = etd;
            }
        }
        const updatedOrder = await this.databaseService.orderModel.findOneAndUpdate({ _id: order._id, awb }, {
            $set: update,
            ...(scans.length > 0
                ? {
                    $addToSet: {
                        shipmentScans: { $each: scans },
                    },
                }
                : {}),
        }, {
            new: true,
            runValidators: true,
        });
        if (!updatedOrder) {
            throw new common_1.NotFoundException("Order was not found while processing the webhook");
        }
        return {
            success: true,
            matched: true,
            message: "Shipment tracking updated",
            awb,
            orderId: updatedOrder._id,
            shipmentStatus: updatedOrder.shipmentStatus,
            scansReceived: scans.length,
        };
    }
    async getOrders(params) {
        const token = await this.authenticate();
        const page = params?.page ?? 1;
        const perPage = params?.per_page ?? 10;
        if (!Number.isInteger(page) || page < 1) {
            throw new common_1.BadRequestException("page must be a positive integer");
        }
        if (!Number.isInteger(perPage) ||
            perPage < 1 ||
            perPage > 100) {
            throw new common_1.BadRequestException("per_page must be between 1 and 100");
        }
        const queryParams = {
            page,
            per_page: perPage,
            sort: params?.sort ?? "DESC",
            sort_by: params?.sort_by ?? "id",
        };
        if (params?.from)
            queryParams.from = params.from;
        if (params?.to)
            queryParams.to = params.to;
        if (params?.filter_by)
            queryParams.filter_by = params.filter_by;
        if (params?.filter)
            queryParams.filter = params.filter;
        if (params?.search?.trim()) {
            queryParams.search = params.search.trim();
        }
        try {
            const response = await axios_1.default.get("https://apiv2.shiprocket.in/v1/external/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: queryParams,
                timeout: 15000,
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new common_1.BadRequestException(error.response?.data?.message ??
                    "Failed to fetch Shiprocket orders");
            }
            throw error;
        }
    }
    async trackorder(order_id) {
        const token = await this.authenticate();
        const config = {
            url: `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${order_id}`,
            method: "Get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        };
        const { data: response } = await axios_1.default.request(config);
        return response;
    }
};
exports.ShipRocketService = ShipRocketService;
exports.ShipRocketService = ShipRocketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ShipRocketService);
//# sourceMappingURL=ship-rocket.service.js.map