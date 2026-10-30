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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let StatsService = class StatsService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    get orderModel() {
        return this.databaseService.orderModel;
    }
    getDateRange(from, to) {
        const start = from
            ? new Date(from)
            : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const end = to ? new Date(to) : new Date();
        if (Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            start > end) {
            throw new Error('Invalid analytics date range');
        }
        end.setHours(23, 59, 59, 999);
        return { start, end };
    }
    get dateFilter() {
        return {};
    }
    async getOverview(from, to) {
        const { start, end } = this.getDateRange(from, to);
        const dateMatch = {
            createdAt: { $gte: start, $lte: end },
        };
        const [orderStats, paymentStats, statusStats, returnStats, dailyStats, paymentMethodStats, topProducts,] = await Promise.all([
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
            this.orderModel.aggregate([
                { $match: dateMatch },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]),
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
        const statusCount = (status) => statusStats.find((item) => item._id === status)?.count ?? 0;
        const returnCount = returnStats.reduce((total, item) => total + item.count, 0);
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
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], StatsService);
//# sourceMappingURL=stats.service.js.map