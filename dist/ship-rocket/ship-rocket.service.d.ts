import { ShiprocketWebhookPayload } from './ship-rocket.controller';
import { DatabaseService } from "../database/database.service";
export declare class ShipRocketService {
    private readonly databaseService;
    private token;
    private tokenExpiresAt;
    constructor(databaseService: DatabaseService);
    private authenticate;
    private post;
    createShipmentOrder(payload: Record<string, unknown>): Promise<unknown>;
    handleWebhook(payload: ShiprocketWebhookPayload): Promise<{
        success: boolean;
        message: string;
        matched?: undefined;
        awb?: undefined;
        orderId?: undefined;
        shipmentStatus?: undefined;
        scansReceived?: undefined;
    } | {
        success: boolean;
        matched: boolean;
        message: string;
        awb: string;
        orderId?: undefined;
        shipmentStatus?: undefined;
        scansReceived?: undefined;
    } | {
        success: boolean;
        matched: boolean;
        message: string;
        awb: string;
        orderId: import("mongoose").Types.ObjectId;
        shipmentStatus: string | null;
        scansReceived: number;
    }>;
    getOrders(params?: {
        page?: number;
        per_page?: number;
        sort?: "ASC" | "DESC";
        sort_by?: "id" | "status";
        from?: string;
        to?: string;
        filter_by?: string;
        filter?: string;
        search?: string;
    }): Promise<any>;
    trackorder(order_id: string): Promise<any>;
}
