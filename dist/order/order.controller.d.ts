import { OrderService } from './order.service';
import { OrderStatus } from "../database/schema/order.schema";
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getAllOrders(req: any, page: number, limit: number, status?: string): Promise<{
        data: {
            paymentDetails: (import("../database/schema/transaction.schema").Transaction & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            orderNumber: string;
            userId: import("mongoose").Types.ObjectId | null;
            guestId: string | null;
            customer: import("src/database/schema/order.schema").OrderCustomer;
            items: import("src/database/schema/order.schema").OrderItem[];
            shippingAddress: import("src/database/schema/order.schema").OrderAddress;
            billingAddress: import("src/database/schema/order.schema").OrderAddress | null;
            status: OrderStatus;
            paymentMethod: import("src/database/schema/order.schema").PaymentMethod;
            paymentStatus: import("src/database/schema/order.schema").PaymentStatus;
            subtotal: number;
            discount: number;
            shippingCharge: number;
            total: number;
            paymentOrderId: string | null;
            paymentId: string | null;
            trackingNumber: string | null;
            awb: string | null;
            shiprocketOrderId: string | null;
            shipmentCurrentStatus: string | null;
            shipmentStatus: string | null;
            shipmentStatusId: number | null;
            courierName: string | null;
            shipmentEtd: Date | null;
            shipmentCurrentTimestamp: Date | null;
            shipmentScans: import("src/database/schema/order.schema").ShipmentScan[];
            deliveredAt: Date | null;
            cancelledAt: Date | null;
            checkoutRequestId: string;
            stockReleased: boolean;
            reservationExpiresAt: Date | null;
            refundAmount: number;
            razorpayRefundId: string | null;
            refundInitiatedAt: Date | null;
            refundGatewayStatus: string | null;
            _id: import("mongoose").Types.ObjectId;
            __v: number;
        }[];
        pagination: {
            totalOrders: number;
            currentPage: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    updateOrderStatus(req: any, orderId: string, body: {
        status: OrderStatus;
        trackingNumber?: string;
        refundAmount?: number;
    }): Promise<{
        message: string;
        order: import("mongoose").Document<unknown, {}, import("src/database/schema/order.schema").Order, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/order.schema").Order & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateOrderStatusUser(orderId: string, body: {
        status: OrderStatus;
    }): Promise<{
        message: string;
        order: import("mongoose").Document<unknown, {}, import("src/database/schema/order.schema").Order, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/order.schema").Order & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getOrderById(orderId: string, req: any): Promise<{
        paymentDetails: (import("../database/schema/transaction.schema").Transaction & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        orderNumber: string;
        userId: import("mongoose").Types.ObjectId | null;
        guestId: string | null;
        customer: import("src/database/schema/order.schema").OrderCustomer;
        items: import("src/database/schema/order.schema").OrderItem[];
        shippingAddress: import("src/database/schema/order.schema").OrderAddress;
        billingAddress: import("src/database/schema/order.schema").OrderAddress | null;
        status: OrderStatus;
        paymentMethod: import("src/database/schema/order.schema").PaymentMethod;
        paymentStatus: import("src/database/schema/order.schema").PaymentStatus;
        subtotal: number;
        discount: number;
        shippingCharge: number;
        total: number;
        paymentOrderId: string | null;
        paymentId: string | null;
        trackingNumber: string | null;
        awb: string | null;
        shiprocketOrderId: string | null;
        shipmentCurrentStatus: string | null;
        shipmentStatus: string | null;
        shipmentStatusId: number | null;
        courierName: string | null;
        shipmentEtd: Date | null;
        shipmentCurrentTimestamp: Date | null;
        shipmentScans: import("src/database/schema/order.schema").ShipmentScan[];
        deliveredAt: Date | null;
        cancelledAt: Date | null;
        checkoutRequestId: string;
        stockReleased: boolean;
        reservationExpiresAt: Date | null;
        refundAmount: number;
        razorpayRefundId: string | null;
        refundInitiatedAt: Date | null;
        refundGatewayStatus: string | null;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    }>;
    getGuestOrders(guestId: string, page: number, limit: number): Promise<{
        data: {
            paymentDetails: (import("../database/schema/transaction.schema").Transaction & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            })[];
            orderNumber: string;
            userId: import("mongoose").Types.ObjectId | null;
            guestId: string | null;
            customer: import("src/database/schema/order.schema").OrderCustomer;
            items: import("src/database/schema/order.schema").OrderItem[];
            shippingAddress: import("src/database/schema/order.schema").OrderAddress;
            billingAddress: import("src/database/schema/order.schema").OrderAddress | null;
            status: OrderStatus;
            paymentMethod: import("src/database/schema/order.schema").PaymentMethod;
            paymentStatus: import("src/database/schema/order.schema").PaymentStatus;
            subtotal: number;
            discount: number;
            shippingCharge: number;
            total: number;
            paymentOrderId: string | null;
            paymentId: string | null;
            trackingNumber: string | null;
            awb: string | null;
            shiprocketOrderId: string | null;
            shipmentCurrentStatus: string | null;
            shipmentStatus: string | null;
            shipmentStatusId: number | null;
            courierName: string | null;
            shipmentEtd: Date | null;
            shipmentCurrentTimestamp: Date | null;
            shipmentScans: import("src/database/schema/order.schema").ShipmentScan[];
            deliveredAt: Date | null;
            cancelledAt: Date | null;
            checkoutRequestId: string;
            stockReleased: boolean;
            reservationExpiresAt: Date | null;
            refundAmount: number;
            razorpayRefundId: string | null;
            refundInitiatedAt: Date | null;
            refundGatewayStatus: string | null;
            _id: import("mongoose").Types.ObjectId;
            __v: number;
        }[];
        pagination: {
            totalOrders: number;
            currentPage: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getUserOrders(req: any, page?: string, limit?: string): Promise<{
        success: boolean;
        message: string;
        data: (import("src/database/schema/order.schema").Order & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            currentPage: number;
            perPage: number;
            totalOrders: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
}
