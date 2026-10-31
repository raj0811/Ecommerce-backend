
import {
    Injectable,
    InternalServerErrorException,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

type OrderItem = {
    name: string;
    sku?: string;
    quantity: number;
    price: number; // INR
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

@Injectable()
export class MailerService implements OnModuleInit {
    private readonly logger = new Logger(MailerService.name);
    private transporter: nodemailer.Transporter;

    async onModuleInit() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await this.transporter.verify();
        this.logger.log('Mailer SMTP connection established');
    }

    private escapeHtml(value: unknown): string {
        return String(value ?? '').replace(
            /[&<>"']/g,
            (char) =>
                ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                })[char]!,
        );
    }

    private formatPrice(amount: number): string {
        return `₹${Number(amount || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    private formatDate(date?: Date | string): string {
        if (!date) return new Date().toLocaleString('en-IN');

        return new Date(date).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    }

    private getAddress(address?: Address): string {
        if (!address) return 'Address information unavailable';

        return [
            address.name,
            address.address,
            address.apartment,
            address.city,
            address.state,
            address.pincode,
            address.country || 'India',
            address.phone ? `Phone: ${address.phone}` : '',
        ]
            .filter(Boolean)
            .map((value) => this.escapeHtml(value))
            .join('<br/>');
    }

    private getItems(items: OrderItem[]): string {
        return items
            .map(
                (item) => `
                    <tr>
                        <td style="padding:12px 8px;border-bottom:1px solid #eee;">
                            <strong>${this.escapeHtml(item.name)}</strong>
                            ${item.sku
                        ? `<br/><small style="color:#777;">SKU: ${this.escapeHtml(item.sku)}</small>`
                        : ''
                    }
                        </td>
                        <td style="padding:12px 8px;text-align:center;border-bottom:1px solid #eee;">
                            ${item.quantity}
                        </td>
                        <td style="padding:12px 8px;text-align:right;border-bottom:1px solid #eee;">
                            ${this.formatPrice(item.price)}
                        </td>
                        <td style="padding:12px 8px;text-align:right;border-bottom:1px solid #eee;">
                            ${this.formatPrice(item.price * item.quantity)}
                        </td>
                    </tr>
                `,
            )
            .join('');
    }

    private getOrderSummary(order: OrderMailData): string {
        return `
            <div style="margin-top:25px;">
                <h3 style="color:#222;">Order Summary</h3>

                <table width="100%" cellspacing="0" cellpadding="0"
                    style="border-collapse:collapse;font-size:13px;">
                    <thead>
                        <tr style="background:#f5f5f5;">
                            <th align="left" style="padding:12px 8px;">Product</th>
                            <th style="padding:12px 8px;">Qty</th>
                            <th align="right" style="padding:12px 8px;">Price</th>
                            <th align="right" style="padding:12px 8px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.getItems(order.items)}
                    </tbody>
                </table>

                <table width="100%" style="margin-top:15px;font-size:14px;">
                    <tr>
                        <td style="padding:5px;">Subtotal</td>
                        <td align="right">${this.formatPrice(order.subtotal)}</td>
                    </tr>
                    <tr>
                        <td style="padding:5px;">Discount</td>
                        <td align="right">-${this.formatPrice(order.discount || 0)}</td>
                    </tr>
                    <tr>
                        <td style="padding:5px;">Shipping</td>
                        <td align="right">${this.formatPrice(order.shippingCharge || 0)}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 5px;border-top:1px solid #ddd;">
                            <strong>Grand Total</strong>
                        </td>
                        <td align="right" style="padding:12px 5px;border-top:1px solid #ddd;">
                            <strong>${this.formatPrice(order.total)}</strong>
                        </td>
                    </tr>
                </table>
            </div>
        `;
    }

    private getEmailTemplate(
        title: string,
        message: string,
        order: OrderMailData,
        extraContent = '',
    ): string {
        return `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;color:#222;">
            <div style="max-width:650px;margin:30px auto;background:#fff;border-radius:10px;overflow:hidden;">

                <div style="background:#111;color:#fff;padding:25px;text-align:center;">
                    <h1 style="margin:0;letter-spacing:2px;">ALPHA MALE</h1>
                    <p style="margin:8px 0 0;color:#ccc;font-size:12px;">
                        STYLE THAT DEFINES YOU
                    </p>
                </div>

                <div style="padding:30px;">
                    <h2 style="margin-top:0;">${this.escapeHtml(title)}</h2>

                    <p>Hello ${this.escapeHtml(order.customerName)},</p>

                    <p style="line-height:1.7;">${message}</p>

                    <div style="background:#f7f7f7;padding:15px;border-radius:6px;margin:20px 0;">
                        <p style="margin:5px 0;">
                            <strong>Order Number:</strong>
                            ${this.escapeHtml(order.orderNumber)}
                        </p>
                        <p style="margin:5px 0;">
                            <strong>Order Date:</strong>
                            ${this.escapeHtml(this.formatDate(order.orderDate))}
                        </p>
                        <p style="margin:5px 0;">
                            <strong>Payment Method:</strong>
                            ${this.escapeHtml(order.paymentMethod)}
                        </p>
                        ${order.paymentStatus
                ? `<p style="margin:5px 0;"><strong>Payment Status:</strong> ${this.escapeHtml(order.paymentStatus)}</p>`
                : ''
            }
                    </div>

                    ${extraContent}

                    ${this.getOrderSummary(order)}

                    ${order.shippingAddress
                ? `
                            <div style="margin-top:25px;">
                                <h3>Shipping Address</h3>
                                <p style="line-height:1.8;color:#555;">
                                    ${this.getAddress(order.shippingAddress)}
                                </p>
                            </div>
                            `
                : ''
            }

                    <p style="margin-top:30px;">
                        Thank you for shopping with Alpha Male.
                    </p>
                </div>

                <div style="background:#111;color:#aaa;text-align:center;padding:20px;font-size:12px;">
                    <p>Alpha Male | All Rights Reserved</p>
                    <p>
                        <a href="${this.escapeHtml(process.env.FRONTEND_URL || '#')}"
                           style="color:#fff;text-decoration:none;">
                            Visit Our Store
                        </a>
                    </p>
                    <p>For assistance, please contact our support team.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    private async sendMail(
        email: string,
        subject: string,
        html: string,
    ) {
        try {
            return await this.transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: email,
                subject,
                html,
                text: `${subject} - Alpha Male. Please view this email in an HTML-compatible email client.`,
            });
        } catch (error) {
            this.logger.error(
                `Email sending failed: ${error.message}`,
                error.stack,
            );

            throw new InternalServerErrorException(
                'Unable to send email.',
            );
        }
    }

    // 1. Order Received
    async sendOrderReceived(order: OrderMailData) {
        return this.sendMail(
            order.email,
            `Order Received - ${order.orderNumber}`,
            this.getEmailTemplate(
                'We received your order!',
                'Your order has been successfully placed. We have received your order details and it is being reviewed.',
                order,
            ),
        );
    }

    // 2. Order Confirmed
    async sendOrderConfirmed(order: OrderMailData) {
        return this.sendMail(
            order.email,
            `Order Confirmed - ${order.orderNumber}`,
            this.getEmailTemplate(
                'Your order is confirmed!',
                'Great news! Your order has been confirmed and is being prepared for shipment.',
                order,
            ),
        );
    }

    // 3. Order Shipped
    async sendOrderShipped(order: ShipmentMailData) {
        const extra = `
            <div style="background:#eef6ff;padding:18px;border-radius:6px;margin:20px 0;">
                <h3 style="margin-top:0;">Your shipment is on its way!</h3>
                <p><strong>Tracking Number:</strong> ${this.escapeHtml(order.trackingNumber)}</p>
                ${order.courierName ? `<p><strong>Courier:</strong> ${this.escapeHtml(order.courierName)}</p>` : ''}
                ${order.estimatedDelivery ? `<p><strong>Expected Delivery:</strong> ${this.escapeHtml(order.estimatedDelivery)}</p>` : ''}
                ${order.trackingUrl
                ? `<a href="${this.escapeHtml(order.trackingUrl)}"
                            style="display:inline-block;background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:5px;">
                            Track Your Order
                           </a>`
                : ''
            }
            </div>
        `;

        return this.sendMail(
            order.email,
            `Your Order Has Shipped - ${order.orderNumber}`,
            this.getEmailTemplate(
                'Your order is on its way!',
                'Your order has been shipped. You can use the tracking details below to follow its journey.',
                order,
                extra,
            ),
        );
    }

    // 4. Order Delivered
    async sendOrderDelivered(order: OrderMailData) {
        return this.sendMail(
            order.email,
            `Order Delivered - ${order.orderNumber}`,
            this.getEmailTemplate(
                'Your order has been delivered!',
                'Your order has been successfully delivered. We hope you love your purchase!',
                order,
            ),
        );
    }

    // 5. Order Cancelled
    async sendOrderCancelled(
        order: OrderMailData & { cancellationReason?: string },
    ) {
        const extra = `
            <div style="background:#fff3f3;padding:15px;border-radius:6px;margin:20px 0;">
                <h3 style="color:#b42318;margin-top:0;">Order Cancelled</h3>
                ${order.cancellationReason
                ? `<p><strong>Reason:</strong> ${this.escapeHtml(order.cancellationReason)}</p>`
                : ''
            }
            </div>
        `;

        return this.sendMail(
            order.email,
            `Order Cancelled - ${order.orderNumber}`,
            this.getEmailTemplate(
                'Your order has been cancelled',
                'Your order cancellation has been confirmed. If a payment was already made, any applicable refund will be processed separately.',
                order,
                extra,
            ),
        );
    }

    // 6. Return Initiated
    async sendReturnInitiated(order: ReturnMailData) {
        const extra = `
            <div style="background:#fff8e8;padding:15px;border-radius:6px;margin:20px 0;">
                <h3 style="margin-top:0;">Return Request Initiated</h3>
                ${order.returnId ? `<p><strong>Return ID:</strong> ${this.escapeHtml(order.returnId)}</p>` : ''}
                ${order.returnReason ? `<p><strong>Reason:</strong> ${this.escapeHtml(order.returnReason)}</p>` : ''}
                <p>We will update you once the returned product is received and inspected.</p>
            </div>
        `;

        return this.sendMail(
            order.email,
            `Return Initiated - ${order.orderNumber}`,
            this.getEmailTemplate(
                'Your return has been initiated',
                'Your return request has been accepted for processing. Please follow the return instructions shared by our team.',
                order,
                extra,
            ),
        );
    }

    // 7. Return Completed
    async sendReturnCompleted(order: ReturnMailData) {
        const extra = `
            <div style="background:#eef6ff;padding:15px;border-radius:6px;margin:20px 0;">
                <h3 style="margin-top:0;">Return Completed</h3>
                ${order.returnId ? `<p><strong>Return ID:</strong> ${this.escapeHtml(order.returnId)}</p>` : ''}
                <p>Your returned product has been received and the return process is complete.</p>
            </div>
        `;

        return this.sendMail(
            order.email,
            `Return Completed - ${order.orderNumber}`,
            this.getEmailTemplate(
                'Your return is complete',
                'We have successfully completed the return process for your order.',
                order,
                extra,
            ),
        );
    }

    // 8. Refund Completed
    async sendRefundCompleted(order: RefundMailData) {
        const extra = `
            <div style="background:#edfff3;padding:18px;border-radius:6px;margin:20px 0;">
                <h3 style="color:#16803c;margin-top:0;">Refund Successfully Processed</h3>
                <p><strong>Refund ID:</strong> ${this.escapeHtml(order.refundId)}</p>
                <p><strong>Refund Amount:</strong> ${this.formatPrice(order.refundAmount)}</p>
                ${order.refundMethod ? `<p><strong>Refund Method:</strong> ${this.escapeHtml(order.refundMethod)}</p>` : ''}
                ${order.refundDate ? `<p><strong>Refund Date:</strong> ${this.escapeHtml(this.formatDate(order.refundDate))}</p>` : ''}
                <p>Your bank or payment provider may take additional time to reflect the amount in your account.</p>
            </div>
        `;

        return this.sendMail(
            order.email,
            `Refund Completed - ${order.orderNumber}`,
            this.getEmailTemplate(
                'Your refund has been processed!',
                'Good news! Your refund has been successfully processed.',
                order,
                extra,
            ),
        );
    }

    async sendOtp(email: string, otp: string): Promise<boolean> {
        try {
            await this.transporter.sendMail({
                from: `"Alpha Male" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Your Alpha Male Login Verification Code',
                text: `Your OTP is ${otp}. It is valid for 5 minutes. Do not share this code with anyone.`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <body style="margin:0;padding:30px;background:#f5f5f5;font-family:Arial,sans-serif;">
                        <div style="max-width:500px;margin:auto;background:#ffffff;padding:30px;border-radius:12px;">
                            <h2 style="color:#111;text-align:center;">
                                Alpha <span style="color:#ea580c;">Male</span>
                            </h2>

                            <h3 style="color:#222;">Login Verification</h3>

                            <p style="color:#555;">
                                Use the following OTP to complete your login.
                            </p>

                            <div style="background:#fff7ed;padding:20px;text-align:center;border-radius:8px;margin:25px 0;">
                                <h1 style="letter-spacing:10px;color:#ea580c;margin:0;">
                                    ${otp}
                                </h1>
                            </div>

                            <p style="color:#666;">
                                This OTP expires in <strong>5 minutes</strong>.
                            </p>

                            <p style="color:#999;font-size:12px;">
                                Never share this OTP with anyone. If you did not
                                request this login, you can safely ignore this email.
                            </p>

                            <hr style="border:none;border-top:1px solid #eee;margin:25px 0;" />

                            <p style="color:#999;font-size:12px;text-align:center;">
                                © ${new Date().getFullYear()} Alpha Male. All rights reserved.
                            </p>
                        </div>
                    </body>
                    </html>
                `,
            });

            return true;
        } catch (error) {
            console.error('OTP email sending failed:', error);

            throw new InternalServerErrorException(
                'Unable to send OTP email. Please try again.',
            );
        }
    }


}
