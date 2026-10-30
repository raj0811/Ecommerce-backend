import type { Response } from 'express';
import { DatabaseService } from "../database/database.service";
import { OrderService } from "../order/order.service";
export declare class WhatsappController {
    private readonly databaseService;
    private readonly ordersService;
    constructor(databaseService: DatabaseService, ordersService: OrderService);
    verifyWebhook(mode: string, token: string, challenge: string, res: Response, body: any): Promise<Response<any, Record<string, any>>>;
    receiveMessage(body: any, req: any): Promise<{
        received: boolean;
    }>;
}
