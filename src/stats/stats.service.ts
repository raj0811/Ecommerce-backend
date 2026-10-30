
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Types } from 'mongoose';

@Injectable()
export class StatsService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    private get orderModel() {
        return this.databaseService.orderModel;
    }

    private getDateRange(from?: string, to?: string) {
        const start = from
            ? new Date(from)
            : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const end = to ? new Date(to) : new Date();

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            start > end
        ) {
            throw new Error('Invalid analytics date range');
        }

        end.setHours(23, 59, 59, 999);

        return { start, end };
    }

    private get dateFilter() {
        return {};
    }

    async getOverview(from?: string, to?: string) {
        const { start, end } = this.getDateRange(from, to);

        const dateMatch = {
            createdAt: { $gte: start, $lte: end },
        };

        const [
            orderStats,
            paymentStats,
            statusStats,
            returnStats,
            dailyStats,
            paymentMethodStats,
            topProducts,
        ] = await Promise.all([
            // Orders and revenue
            this.orderModel.aggregate([
                { $match: dateMatch },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalSales: { $sum: '$total' },
                        paidRevenue: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$paymentStatus', 'PAID'] },
                                    '$total',
                                    0,
                                ],
                            },
                        },
                        totalDiscount: { $sum: '$discount' },
                        totalShipping: { $sum: '$shippingCharge' },
                        averageOrderValue: { $avg: '$total' },
                    },
                },
            ]),

            // Payment status breakdown
            this.orderModel.aggregate([
                { $match: dateMatch },
                {
                    $group: {
                        _id: '$paymentStatus',
                        count: { $sum: 1 },
                        amount: { $sum: '$total' },
                    },
                },
            ]),

            // Order status breakdown
            this.orderModel.aggregate([
                { $match: dateMatch },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]),

            // Return analytics
            this.orderModel.aggregate([
                {
                    $match: {
                        ...dateMatch,
                        status: {
                            $in: [
                                'RETURN_REQUESTED',
                                'RETURN_INITIATED',
                                'RETURN_COMPLETED',
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        amount: { $sum: '$total' },
                    },
                },
            ]),

            // Daily orders and paid revenue
            this.orderModel.aggregate([
                { $match: dateMatch },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$createdAt',
                            },
                        },
                        orders: { $sum: 1 },
                        revenue: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$paymentStatus', 'PAID'] },
                                    '$total',
                                    0,
                                ],
                            },
                        },
                    },
                },
                { $sort: { _id: 1 } },
            ]),

            // Payment method breakdown
            this.orderModel.aggregate([
                { $match: dateMatch },
                {
                    $group: {
                        _id: '$paymentMethod',
                        orders: { $sum: 1 },
                        amount: { $sum: '$total' },
                    },
                },
            ]),

            // Best-selling products
            this.orderModel.aggregate([
                { $match: dateMatch },
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.productId',
                        name: { $first: '$items.name' },
                        quantitySold: { $sum: '$items.quantity' },
                        revenue: {
                            $sum: {
                                $ifNull: [
                                    '$items.lineTotal',
                                    {
                                        $multiply: [
                                            '$items.price',
                                            '$items.quantity',
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                },
                { $sort: { quantitySold: -1 } },
                { $limit: 10 },
            ]),
        ]);

        const overview = orderStats[0] ?? {
            totalOrders: 0,
            totalSales: 0,
            paidRevenue: 0,
            totalDiscount: 0,
            totalShipping: 0,
            averageOrderValue: 0,
        };

        const statusCount = (status: string) =>
            statusStats.find((item) => item._id === status)?.count ?? 0;

        const returnCount = returnStats.reduce(
            (total, item) => total + item.count,
            0,
        );

        return {
            period: { from: start, to: end },

            overview: {
                totalOrders: overview.totalOrders,
                totalSales: overview.totalSales,
                revenue: overview.paidRevenue,
                averageOrderValue: overview.averageOrderValue,
                totalDiscount: overview.totalDiscount,
                totalShipping: overview.totalShipping,
            },

            orders: {
                pending: statusCount('PENDING'),
                confirmed: statusCount('CONFIRMED'),
                processing: statusCount('PROCESSING'),
                shipped: statusCount('SHIPPED'),
                outForDelivery: statusCount('OUT_FOR_DELIVERY'),
                delivered: statusCount('DELIVERED'),
                cancelled: statusCount('CANCELLED'),
                returnCount,
                statusBreakdown: statusStats,
            },

            payments: {
                breakdown: paymentStats,
                methods: paymentMethodStats,
            },

            returns: {
                total: returnCount,
                breakdown: returnStats,
            },

            salesChart: dailyStats.map((item) => ({
                date: item._id,
                orders: item.orders,
                revenue: item.revenue,
            })),

            topProducts,
        };
    }
}
