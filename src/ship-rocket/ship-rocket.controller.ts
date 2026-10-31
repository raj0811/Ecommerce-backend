import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ShipRocketService } from './ship-rocket.service';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';
import { DatabaseService } from 'src/database/database.service';
import { timingSafeEqual } from 'crypto';
import { OrderStatus } from 'src/database/schema/order.schema';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

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

@Controller('ship-rocket')
export class ShipRocketController {
    constructor(
        private shipRocketService: ShipRocketService,
        private readonly databaseService: DatabaseService,
        private readonly whatsappService: WhatsappService
    ) { }

    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async webhook(
        @Body() body: any,
        @Req() req: any,
    ) {
        try {

            const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;

            if (!secret) {
                throw new InternalServerErrorException(
                    'Webhook security is not configured',
                );
            }


            const authorization = req.headers['authorization'];

            if (!authorization || typeof authorization !== 'string') {
                throw new UnauthorizedException(
                    'Authorization header missing',
                );
            }


            const expected = Buffer.from(secret, 'utf8');
            const received = Buffer.from(authorization, 'utf8');

            const isValid =
                expected.length === received.length &&
                timingSafeEqual(expected, received);

            if (!isValid) {

                throw new UnauthorizedException(
                    'Invalid webhook authorization',
                );
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

            const {
                order_id,
                sr_order_id,
                shipment_status,
                shipment_status_id,
                current_status,
                current_timestamp,
                scans,
                pickup_scheduled_date,
                awb,
                courier_name,
                etd,
            } = body;

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

            const normalizedStatus =
                normalizedShipmentStatus || normalizedCurrentStatus;


            const conditions: any[] = [];

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


            if (
                normalizedStatus === 'CANCELLED' ||
                normalizedCurrentStatus === 'CANCELED' ||
                normalizedCurrentStatus === 'CANCELLED'
            ) {
                if (order.status === OrderStatus.CANCELLED) {


                    return {
                        success: true,
                        message: 'Cancellation already processed',
                        ignored: true,
                    };
                }
            }


            let orderStatus: OrderStatus | undefined;

            if (
                normalizedStatus === 'DELIVERED' ||
                normalizedCurrentStatus === 'DELIVERED'
            ) {
                order.deliveredAt = new Date();
                await this.whatsappService.sendOrderDelivered({
                    phone: process.env.WHATSAPP_NUMBER!,
                    customerName: order.customer.firstName,
                    orderNumber: order.orderNumber,
                });
                orderStatus = OrderStatus.DELIVERED;
            } else if (
                normalizedStatus === 'CANCELLED' ||
                normalizedStatus === 'CANCELED' ||
                normalizedCurrentStatus === 'CANCELLED' ||
                normalizedCurrentStatus === 'CANCELED'
            ) {

                orderStatus = OrderStatus.CANCELLED;
                order.cancelledAt = new Date();
                await this.whatsappService.sendOrderCancelled({
                    phone: order.customer.phone,
                    customerName: order.customer.firstName,
                    orderNumber: order.orderNumber,
                });
            } else if (
                normalizedStatus === 'IN TRANSIT' ||
                normalizedStatus === 'IN_TRANSIT' ||
                normalizedCurrentStatus === 'IN TRANSIT' ||
                normalizedCurrentStatus === 'IN_TRANSIT'
            ) {
                orderStatus = OrderStatus.IN_TRANSIT;
            } else if (
                normalizedStatus === 'SHIPPED' ||
                normalizedStatus === 'PICKED UP'
            ) {
                await this.whatsappService.sendOrderShipped({
                    phone: process.env.WHATSAPP_NUMBER!,
                    customerName: order.customer.firstName,
                    orderNumber: order.orderNumber,
                    trackingUrl: `${process.env.URL}/track-order?order_id=${order.orderNumber}`,
                });
                orderStatus = OrderStatus.SHIPPED;
            }


            const parseShiprocketDate = (value: any): Date | null => {
                if (!value || typeof value !== 'string') return null;

                const trimmed = value.trim();

                if (!trimmed) return null;


                const match = trimmed.match(
                    /^(\d{2}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):(\d{2})$/,
                );

                if (match) {
                    const [, day, month, year, hour, minute, second] = match;

                    const date = new Date(
                        Number(year),
                        Number(month) - 1,
                        Number(day),
                        Number(hour),
                        Number(minute),
                        Number(second),
                    );

                    return Number.isNaN(date.getTime()) ? null : date;
                }

                const date = new Date(trimmed);

                return Number.isNaN(date.getTime()) ? null : date;
            };


            const update: any = {
                shipmentCurrentStatus: current_status || null,
                shipmentStatus: shipment_status || null,
                shipmentStatusId:
                    shipment_status_id != null
                        ? Number(shipment_status_id)
                        : null,
                shipmentCurrentTimestamp:
                    parseShiprocketDate(current_timestamp),
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

                update.scans = scans.map((scan: any) => ({
                    date: scan.date || '',
                    status: scan.status || '',
                    activity: scan.activity || '',
                    location: scan.location || '',
                    'sr-status': scan['sr-status'] != null
                        ? String(scan['sr-status'])
                        : '',
                    'sr-status-label': scan['sr-status-label'] || '',
                }));


                update.shipmentScans = scans.map((scan: any) => ({
                    date: scan.date || '',
                    activity: scan.activity || '',
                    location: scan.location || '',
                }));
            }

            if (orderStatus) {

                if (order.status !== OrderStatus.DELIVERED) {
                    update.status = orderStatus;
                }
            }

            if (orderStatus === OrderStatus.DELIVERED) {
                update.deliveredAt = new Date();
            }

            if (orderStatus === OrderStatus.CANCELLED) {
                update.cancelledAt = new Date();
            }


            await this.databaseService.orderModel.findByIdAndUpdate(
                order._id,
                { $set: update },
                { new: true, runValidators: true },
            );


            return {
                success: true,
                message: 'Shiprocket webhook processed successfully',
                orderNumber: order.orderNumber,
                shipmentStatus: normalizedStatus,
            };

        } catch (error) {

            throw error;
        }
    }

    @Get("orders")
    @UseGuards(AdminAuthGuard)
    async getOrders(
        @Query("page") page?: string,
        @Query("per_page") perPage?: string,
        @Query("sort") sort?: "ASC" | "DESC",
        @Query("sort_by") sortBy?: "id" | "status",
        @Query("from") from?: string,
        @Query("to") to?: string,
        @Query("filter_by") filterBy?: string,
        @Query("filter") filter?: string,
        @Query("search") search?: string,
    ) {
        const parsedPage = page === undefined ? 1 : Number(page);
        const parsedPerPage =
            perPage === undefined ? 10 : Number(perPage);

        if (!Number.isInteger(parsedPage) || parsedPage < 1) {
            throw new BadRequestException(
                "page must be a positive integer",
            );
        }

        if (
            !Number.isInteger(parsedPerPage) ||
            parsedPerPage < 1 ||
            parsedPerPage > 100
        ) {
            throw new BadRequestException(
                "per_page must be between 1 and 100",
            );
        }

        if (sort && !["ASC", "DESC"].includes(sort)) {
            throw new BadRequestException(
                "sort must be ASC or DESC",
            );
        }

        if (sortBy && !["id", "status"].includes(sortBy)) {
            throw new BadRequestException(
                "sort_by must be id or status",
            );
        }

        if (from && Number.isNaN(Date.parse(from))) {
            throw new BadRequestException("Invalid from date");
        }

        if (to && Number.isNaN(Date.parse(to))) {
            throw new BadRequestException("Invalid to date");
        }

        if (from && to && new Date(from) > new Date(to)) {
            throw new BadRequestException(
                "from date cannot be later than to date",
            );
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

    @Get("/track")
    async trackOrder(@Query("order_id") order_id: string) {
        return await this.shipRocketService.trackorder(order_id)
    }
}
