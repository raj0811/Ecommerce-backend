import { DatabaseService } from "../database/database.service";
import { Types } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus } from "../database/schema/order.schema";
import { ShipRocketService } from "../ship-rocket/ship-rocket.service";
import { WhatsappService } from "../whatsapp/whatsapp.service";
import { PaymentService } from "../payment/payment.service";
export declare class OrderService {
    private readonly databaseService;
    private readonly shiprocketService;
    private readonly whatsappService;
    private readonly paymentService;
    constructor(databaseService: DatabaseService, shiprocketService: ShipRocketService, whatsappService: WhatsappService, paymentService: PaymentService);
    getAllOrders(page?: number, limit?: number, status?: string): Promise<{
        data: {
            paymentDetails: (import("../database/schema/transaction.schema").Transaction & {
                _id: Types.ObjectId;
            } & {
                __v: number;
            })[];
            orderNumber: string;
            userId: Types.ObjectId | null;
            guestId: string | null;
            customer: import("src/database/schema/order.schema").OrderCustomer;
            items: import("src/database/schema/order.schema").OrderItem[];
            shippingAddress: import("src/database/schema/order.schema").OrderAddress;
            billingAddress: import("src/database/schema/order.schema").OrderAddress | null;
            status: OrderStatus;
            paymentMethod: PaymentMethod;
            paymentStatus: PaymentStatus;
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
            _id: Types.ObjectId;
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
    updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string): Promise<{
        message: string;
        order: import("mongoose").Document<unknown, {}, import("src/database/schema/order.schema").Order, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/order.schema").Order & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getOrderById(orderId: string, userId: string): Promise<{
        paymentDetails: (import("../database/schema/transaction.schema").Transaction & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        orderNumber: string;
        userId: Types.ObjectId | null;
        guestId: string | null;
        customer: import("src/database/schema/order.schema").OrderCustomer;
        items: import("src/database/schema/order.schema").OrderItem[];
        shippingAddress: import("src/database/schema/order.schema").OrderAddress;
        billingAddress: import("src/database/schema/order.schema").OrderAddress | null;
        status: OrderStatus;
        paymentMethod: PaymentMethod;
        paymentStatus: PaymentStatus;
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
        _id: Types.ObjectId;
        __v: number;
    }>;
    getGuestOrder(guest_id: string, page?: number, limit?: number): Promise<{
        data: {
            paymentDetails: (import("../database/schema/transaction.schema").Transaction & {
                _id: Types.ObjectId;
            } & {
                __v: number;
            })[];
            orderNumber: string;
            userId: Types.ObjectId | null;
            guestId: string | null;
            customer: import("src/database/schema/order.schema").OrderCustomer;
            items: import("src/database/schema/order.schema").OrderItem[];
            shippingAddress: import("src/database/schema/order.schema").OrderAddress;
            billingAddress: import("src/database/schema/order.schema").OrderAddress | null;
            status: OrderStatus;
            paymentMethod: PaymentMethod;
            paymentStatus: PaymentStatus;
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
            _id: Types.ObjectId;
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
    getUserOrder(userId: string, page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data: (import("src/database/schema/order.schema").Order & {
            _id: Types.ObjectId;
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
    handleCodConfirmationReply(customerPhone: string, buttonId: string): Promise<{
        success: boolean;
        message: string;
        orderId?: undefined;
        status?: undefined;
    } | {
        success: boolean;
        message: string;
        orderId: string;
        status: OrderStatus;
    }>;
    initiateOrderRefund(orderId: string, refundAmount: number): Promise<{
        message: string;
        refundId: any;
        refundAmount: number;
        refundStatus: any;
        order: import("mongoose").Document<unknown, {}, import("src/database/schema/order.schema").Order, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/order.schema").Order & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
