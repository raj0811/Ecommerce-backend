import { PaymentService } from "./payment.service";
import { DatabaseService } from "../database/database.service";
import { CartService } from "../cart/cart.service";
type CheckoutItemDto = {
    product_id: string;
    qty: number;
};
type CheckoutDto = {
    checkoutRequestId: string;
    items: CheckoutItemDto[];
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
type VerifyPaymentDto = {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
};
export declare class PaymentController {
    private readonly paymentService;
    private readonly databaseService;
    private readonly cartService;
    constructor(paymentService: PaymentService, databaseService: DatabaseService, cartService: CartService);
    createOrder(body: CheckoutDto, request: any): Promise<{
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
    createCodOrder(body: CheckoutDto, request: any): Promise<{
        orderId: import("mongoose").Types.ObjectId;
        orderNumber: string;
        paymentMethod: import("../database/schema/order.schema").PaymentMethod;
        subtotal: number;
        discount: number;
        total: number;
        currency: string;
        status: string;
        paymentStatus: import("../database/schema/order.schema").PaymentStatus;
        transaction_id?: undefined;
    } | {
        orderId: import("mongoose").Types.ObjectId;
        orderNumber: string;
        transaction_id: string | undefined;
        paymentMethod: import("../database/schema/order.schema").PaymentMethod;
        subtotal: number;
        discount: number;
        total: number;
        currency: string;
        status: string;
        paymentStatus: import("../database/schema/order.schema").PaymentStatus;
    }>;
    verifyPayment(body: VerifyPaymentDto): {
        success: boolean;
        message: string;
    };
    initRazorpay(req: any, res: any): Promise<any>;
    callback(req: any, res: any): Promise<any>;
    callbackPost(req: any, res: any, body: any): Promise<any>;
    webhook(req: any, body: any): Promise<{
        received: boolean;
        message?: undefined;
    } | {
        received: boolean;
        message: string;
    }>;
    refundWebhook(req: any, body: any): Promise<{
        received: boolean;
        message: string;
    }>;
    getAllTransactions(req: any, page?: string, limit?: string, status?: string, paymentMethod?: string, search?: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: (import("src/database/schema/transaction.schema").Transaction & {
            _id: import("mongoose").Types.ObjectId;
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
}
export {};
