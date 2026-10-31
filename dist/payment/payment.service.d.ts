import { DatabaseService } from "../database/database.service";
import { Types } from "mongoose";
import { PaymentMethod, PaymentStatus } from "../database/schema/order.schema";
import { WhatsappService } from "../whatsapp/whatsapp.service";
import { UserService } from "../user/user.service";
type CheckoutItem = {
    product_id: string;
    qty: number;
};
type CheckoutInput = {
    checkoutRequestId: string;
    items: CheckoutItem[];
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    shippingAddress: {
        address: string;
        apartment?: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
    };
    billingAddress?: {
        address: string;
        apartment?: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
    };
    userId?: string;
    guestId?: string;
};
export declare class PaymentService {
    private readonly databaseService;
    private readonly whatsappService;
    private readonly userService;
    private readonly reservationMinutes;
    constructor(databaseService: DatabaseService, whatsappService: WhatsappService, userService: UserService);
    generateOrderNumber(): string;
    private createRazorpayOrder;
    processOrder(input: CheckoutInput): Promise<{
        payment_url: string;
        orderId: any;
        orderNumber: any;
        razorpayOrderId: string | null;
        razorpayKeyId: string | undefined;
        amount: number;
        currency: string;
        subtotal: any;
        discount: any;
        total: any;
        reservationExpiresAt: any;
        status: string;
    } | {
        payment_url: string;
        orderId: any;
        orderNumber: string;
        razorpayOrderId: string;
        razorpayKeyId: string | undefined;
        transaction_id: string;
        amount: number;
        currency: string;
        subtotal: number;
        discount: number;
        total: number;
        status: string;
    }>;
    processCodOrder(input: CheckoutInput): Promise<{
        orderId: Types.ObjectId;
        orderNumber: string;
        paymentMethod: PaymentMethod;
        subtotal: number;
        discount: number;
        total: number;
        currency: string;
        status: string;
        paymentStatus: PaymentStatus;
        transaction_id?: undefined;
    } | {
        orderId: Types.ObjectId;
        orderNumber: string;
        transaction_id: string | undefined;
        paymentMethod: PaymentMethod;
        subtotal: number;
        discount: number;
        total: number;
        currency: string;
        status: string;
        paymentStatus: PaymentStatus;
    }>;
    private getExistingPayment;
    verifyPaymentSignature(input: {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
    }): boolean;
    checkPaymentStatus(razorpay_order_id: string): Promise<any>;
    getAllTransactions(query: {
        page?: string;
        limit?: string;
        status?: string;
        paymentMethod?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        success: boolean;
        data: (import("src/database/schema/transaction.schema").Transaction & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    private escapeRegex;
    createRefund(paymentId: string, amount?: number): Promise<any>;
}
export {};
