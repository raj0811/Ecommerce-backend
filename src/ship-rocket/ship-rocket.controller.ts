import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ShipRocketService } from './ship-rocket.service';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';

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
        private shipRocketService: ShipRocketService
    ) { }

    @Post('/webhook')
    async testWebhook(@Body() body: any) {
        console.log(body);
        return true

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
