
import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Query,
    ParseIntPipe,
    DefaultValuePipe,
    Req,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from 'src/database/schema/order.schema';
import { UserAuthGuard } from 'src/Guards/user.AuthGuard';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';

@Controller('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
    ) { }

    /**
     * Admin: Get all orders.
     * GET /orders/admin?page=1&limit=10&status=PENDING
     */
    @Get('admin')
    async getAllOrders(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number,
        @Query('status')
        status?: string,
    ) {
        return this.orderService.getAllOrders(
            page,
            limit,
            status,
        );
    }

    /**
     * Admin: Update order status.
     * PATCH /orders/admin/:orderId/status
     *
     * Body:
     * { "status": "SHIPPED", "trackingNumber": "TRACK123" }
     */
    @Patch('admin/:orderId/status')
    @UseGuards(AdminAuthGuard)
    async updateOrderStatus(
        @Param("orderId") orderId: string,
        @Body() body: {
            status: OrderStatus;
            trackingNumber?: string;
            refundAmount?: number;
        },
    ) {
        if (body.status === OrderStatus.REFUND_INITIATED) {
            if (body.refundAmount === undefined) {
                throw new BadRequestException(
                    "Refund amount is required.",
                );
            }

            return this.orderService.initiateOrderRefund(
                orderId,
                body.refundAmount,
            );
        }

        return this.orderService.updateOrderStatus(
            orderId,
            body.status,
            body.trackingNumber,
        );
    }

    @Patch('user/:orderId/status')
    async updateOrderStatusUser(
        @Param('orderId') orderId: string,
        @Body()
        body: {
            status: OrderStatus;
        },
    ) {
        let { status } = body
        if (status === "CANCELLED") {
            status = OrderStatus.CANCELLATION_REQUESTED
        }
        return this.orderService.updateOrderStatus(
            orderId,
            status
        );
    }

    /**
     * Get a single order.
     * GET /orders/:orderId
     */
    @Get('info/:orderId')
    async getOrderById(
        @Param('orderId') orderId: string,
    ) {
        return this.orderService.getOrderById(orderId);
    }

    /**
     * Get guest orders.
     * GET /orders/guest/:guestId?page=1&limit=10
     */
    @Get('guest/:guestId')
    async getGuestOrders(
        @Param('guestId') guestId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number,
    ) {
        return this.orderService.getGuestOrder(
            guestId,
            page,
            limit,
        );
    }

    @Get("my-orders")
    @UseGuards(UserAuthGuard)
    async getUserOrders(
        @Req() req: any,
        @Query("page") page = "1",
        @Query("limit") limit = "10",
    ) {
        console.log('ttte');

        return this.orderService.getUserOrder(
            req.user.id,
            Number(page),
            Number(limit),
        );
    }
}
