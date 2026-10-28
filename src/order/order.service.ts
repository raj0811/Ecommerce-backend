import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Types } from 'mongoose';

@Injectable()
export class OrderService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getOrderById(orderId: string) {
        if (!Types.ObjectId.isValid(orderId)) {
            throw new BadRequestException("Invalid order ID.");
        }
        return await this.databaseService.orderModel.findById(orderId);
    }

    async getGuestOrder(guest_id: string) {
        if (!Types.ObjectId.isValid(guest_id)) {
            throw new BadRequestException("Invalid guest ID.");
        }
        return await this.databaseService.orderModel.find({ guestId: guest_id });
    }
}
