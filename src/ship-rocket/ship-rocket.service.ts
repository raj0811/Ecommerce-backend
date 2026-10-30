
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { ShiprocketWebhookPayload } from './ship-rocket.controller';
import { DatabaseService } from 'src/database/database.service';

const SHIPROCKET_BASE_URL =
    'https://apiv2.shiprocket.in/v1/external';

@Injectable()
export class ShipRocketService {
    private token: string | null = null;
    private tokenExpiresAt = 0;

    constructor(
        private readonly databaseService: DatabaseService
    ) { }

    private async authenticate(): Promise<string> {
        if (this.token && Date.now() < this.tokenExpiresAt) {
            return this.token;
        }

        const email = process.env.SHIPROCKET_EMAIL
        const password = process.env.SHIPROCKET_PASSWORD

        if (!email || !password) {
            throw new InternalServerErrorException(
                'Shiprocket API credentials are not configured.',
            );
        }

        try {
            const { data } = await axios.post(
                `${SHIPROCKET_BASE_URL}/auth/login`,
                { email, password },
            );

            if (!data?.token) {
                throw new Error('Shiprocket did not return an auth token.');
            }

            this.token = data.token;

            // Cache the token for slightly less than 10 days.
            this.tokenExpiresAt =
                Date.now() + 9 * 24 * 60 * 60 * 1000;

            return this.token!;
        } catch {
            this.token = null;
            this.tokenExpiresAt = 0;

            throw new InternalServerErrorException(
                'Unable to authenticate with Shiprocket.',
            );
        }
    }

    private async post<T>(
        path: string,
        payload: Record<string, unknown>,
    ): Promise<T> {
        const token = await this.authenticate();

        try {
            const { data } = await axios.post<T>(
                `${SHIPROCKET_BASE_URL}${path}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 15000,
                },
            );

            return data;
        } catch (error) {
            console.log(error?.response, 'error11');


            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.log(error.response);

                this.token = null;
                this.tokenExpiresAt = 0;
            }

            throw new InternalServerErrorException(
                'Shiprocket API request failed.',
            );
        }
    }

    /**
     * Create an order in Shiprocket.
     * Payload must match Shiprocket's documented API schema.
     */
    async createShipmentOrder(
        payload: Record<string, unknown>,
    ) {
        console.log(payload);

        return this.post(
            '/orders/create/adhoc',
            payload,
        );
    }


    async handleWebhook(payload: ShiprocketWebhookPayload) {
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
                .filter(
                    (scan) =>
                        scan &&
                        typeof scan.date === "string" &&
                        typeof scan.activity === "string",
                )
                .map((scan) => ({
                    date: scan.date,
                    activity: scan.activity,
                    location: scan.location ?? "",
                }))
            : [];

        // Match the AWB saved when the shipment was created.
        // Never assume Shiprocket's order_id is MongoDB's _id.
        const order = await this.databaseService.orderModel.findOne({
            awb,
        });

        if (!order) {


            // Return a result so the controller can acknowledge receipt.
            // Consider persisting unmatched events for later reconciliation.
            return {
                success: true,
                matched: false,
                message: "Webhook received; no matching order found",
                awb,
            };
        }

        const update: Record<string, unknown> = {
            shipmentStatus:
                payload.shipment_status ??
                payload.current_status ??
                null,
            shipmentCurrentStatus:
                payload.current_status ??
                payload.shipment_status ??
                null,
        };

        if (payload.order_id !== undefined) {
            update.shiprocketOrderId = String(payload.order_id);
        }

        if (payload.shipment_status_id !== undefined) {
            update.shipmentStatusId = payload.shipment_status_id;
        } else if (payload.current_status_id !== undefined) {
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

        // Update the latest status and add new scan records.
        // $addToSet prevents exact duplicate scan objects.
        const updatedOrder =
            await this.databaseService.orderModel.findOneAndUpdate(
                { _id: order._id, awb },
                {
                    $set: update,
                    ...(scans.length > 0
                        ? {
                            $addToSet: {
                                shipmentScans: { $each: scans },
                            },
                        }
                        : {}),
                },
                {
                    new: true,
                    runValidators: true,
                },
            );

        if (!updatedOrder) {
            throw new NotFoundException(
                "Order was not found while processing the webhook",
            );
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

    async getOrders(params?: {
        page?: number;
        per_page?: number;
        sort?: "ASC" | "DESC";
        sort_by?: "id" | "status";
        from?: string;
        to?: string;
        filter_by?: string;
        filter?: string;
        search?: string;
    }) {
        const token = await this.authenticate();

        const page = params?.page ?? 1;
        const perPage = params?.per_page ?? 10;

        if (!Number.isInteger(page) || page < 1) {
            throw new BadRequestException("page must be a positive integer");
        }

        if (
            !Number.isInteger(perPage) ||
            perPage < 1 ||
            perPage > 100
        ) {
            throw new BadRequestException(
                "per_page must be between 1 and 100",
            );
        }

        const queryParams: Record<string, string | number> = {
            page,
            per_page: perPage,
            sort: params?.sort ?? "DESC",
            sort_by: params?.sort_by ?? "id",
        };

        if (params?.from) queryParams.from = params.from;
        if (params?.to) queryParams.to = params.to;
        if (params?.filter_by) queryParams.filter_by = params.filter_by;
        if (params?.filter) queryParams.filter = params.filter;
        if (params?.search?.trim()) {
            queryParams.search = params.search.trim();
        }

        try {
            const response = await axios.get(
                "https://apiv2.shiprocket.in/v1/external/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: queryParams,
                    timeout: 15000,
                },
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new BadRequestException(
                    error.response?.data?.message ??
                    "Failed to fetch Shiprocket orders",
                );
            }

            throw error;
        }
    }

    async trackorder(
        order_id: string
    ) {
        const token = await this.authenticate();
        const config = {
            url: `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${order_id}`,
            method: "Get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        const { data: response } = await axios.request(config)
        return response
    }
}
