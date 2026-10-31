import { ShipRocketService } from './ship-rocket.service';
import { DatabaseService } from "../database/database.service";
export interface ShiprocketWebhookPayload {
    awb: string | number;
    current_status?: string;
    order_id?: string | number;
    current_timestamp?: string;
    etd?: string | null;
    current_status_id?: number;
    shipment_status?: string;
    shipment_status_id?: number;
    channel_order_id?: string;
    channel?: string;
    courier_name?: string;
    scans?: Array<{
        date: string;
        activity: string;
        location: string;
    }>;
}
export declare class ShipRocketController {
    private shipRocketService;
    private readonly databaseService;
    constructor(shipRocketService: ShipRocketService, databaseService: DatabaseService);
    testWebhook(body: any, req: any): Promise<boolean>;
    getOrders(page?: string, perPage?: string, sort?: "ASC" | "DESC", sortBy?: "id" | "status", from?: string, to?: string, filterBy?: string, filter?: string, search?: string): Promise<any>;
    trackOrder(order_id: string): Promise<any>;
}
