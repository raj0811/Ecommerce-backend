import { OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
type OrderItem = {
    name: string;
    sku?: string;
    quantity: number;
    price: number;
    image?: string;
};
type Address = {
    name?: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    phone?: string;
};
type OrderMailData = {
    email: string;
    customerName: string;
    orderNumber: string;
    items: OrderItem[];
    subtotal: number;
    discount?: number;
    shippingCharge?: number;
    total: number;
    paymentMethod: string;
    paymentStatus?: string;
    shippingAddress?: Address;
    orderDate?: Date | string;
};
type ShipmentMailData = OrderMailData & {
    trackingNumber: string;
    courierName?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
};
type ReturnMailData = OrderMailData & {
    returnId?: string;
    returnReason?: string;
};
type RefundMailData = OrderMailData & {
    refundId: string;
    refundAmount: number;
    refundMethod?: string;
    refundDate?: Date | string;
};
export declare class MailerService implements OnModuleInit {
    private readonly logger;
    private transporter;
    onModuleInit(): Promise<void>;
    private escapeHtml;
    private formatPrice;
    private formatDate;
    private getAddress;
    private getItems;
    private getOrderSummary;
    private getEmailTemplate;
    private sendMail;
    sendOrderReceived(order: OrderMailData): Promise<nodemailer.SentMessageInfo>;
    sendOrderConfirmed(order: OrderMailData): Promise<nodemailer.SentMessageInfo>;
    sendOrderShipped(order: ShipmentMailData): Promise<nodemailer.SentMessageInfo>;
    sendOrderDelivered(order: OrderMailData): Promise<nodemailer.SentMessageInfo>;
    sendOrderCancelled(order: OrderMailData & {
        cancellationReason?: string;
    }): Promise<nodemailer.SentMessageInfo>;
    sendReturnInitiated(order: ReturnMailData): Promise<nodemailer.SentMessageInfo>;
    sendReturnCompleted(order: ReturnMailData): Promise<nodemailer.SentMessageInfo>;
    sendRefundCompleted(order: RefundMailData): Promise<nodemailer.SentMessageInfo>;
    sendOtp(email: string, otp: string): Promise<boolean>;
}
export {};
