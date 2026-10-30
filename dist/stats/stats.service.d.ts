import { DatabaseService } from '../database/database.service';
export declare class StatsService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    private get orderModel();
    private getDateRange;
    private get dateFilter();
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
