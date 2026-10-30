import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getOverview(from?: string, to?: string): Promise<{
        period: {
            from: Date;
            to: Date;
        };
        overview: {
            totalOrders: any;
            totalSales: any;
            revenue: any;
            averageOrderValue: any;
            totalDiscount: any;
            totalShipping: any;
        };
        orders: {
            pending: any;
            confirmed: any;
            processing: any;
            shipped: any;
            outForDelivery: any;
            delivered: any;
            cancelled: any;
            returnCount: any;
            statusBreakdown: any[];
        };
        payments: {
            breakdown: any[];
            methods: any[];
        };
        returns: {
            total: any;
            breakdown: any[];
        };
        salesChart: {
            date: any;
            orders: any;
            revenue: any;
        }[];
        topProducts: any[];
    }>;
}
