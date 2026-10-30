"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var MailerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let MailerService = MailerService_1 = class MailerService {
    logger = new common_1.Logger(MailerService_1.name);
    transporter;
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
    escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        })[char]);
    }
    formatPrice(amount) {
        return `₹${Number(amount || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }
    formatDate(date) {
        if (!date)
            return new Date().toLocaleString('en-IN');
        return new Date(date).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    }
    getAddress(address) {
        if (!address)
            return 'Address information unavailable';
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
    getItems(items) {
        return items
            .map((item) => `
                    <tr>
                        <td style="padding:12px 8px;border-bottom:1px solid #eee;">
                            <strong>${this.escapeHtml(item.name)}</strong>
                            ${item.sku
            ? `<br/><small style="color:#777;">SKU: ${this.escapeHtml(item.sku)}</small>`
            : ''}
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
                `)
            .join('');
    }
    getOrderSummary(order) {
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
    getEmailTemplate(title, message, order, extraContent = '') {
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
            : ''}
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
            : ''}

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
    async sendMail(email, subject, html) {
        try {
            return await this.transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: email,
                subject,
                html,
                text: `${subject} - Alpha Male. Please view this email in an HTML-compatible email client.`,
            });
        }
        catch (error) {
            this.logger.error(`Email sending failed: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Unable to send email.');
        }
    }
    async sendOrderReceived(order) {
        return this.sendMail(order.email, `Order Received - ${order.orderNumber}`, this.getEmailTemplate('We received your order!', 'Your order has been successfully placed. We have received your order details and it is being reviewed.', order));
    }
    async sendOrderConfirmed(order) {
        return this.sendMail(order.email, `Order Confirmed - ${order.orderNumber}`, this.getEmailTemplate('Your order is confirmed!', 'Great news! Your order has been confirmed and is being prepared for shipment.', order));
    }
    async sendOrderShipped(order) {
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
            : ''}
            </div>
        `;
        return this.sendMail(order.email, `Your Order Has Shipped - ${order.orderNumber}`, this.getEmailTemplate('Your order is on its way!', 'Your order has been shipped. You can use the tracking details below to follow its journey.', order, extra));
    }
    async sendOrderDelivered(order) {
        return this.sendMail(order.email, `Order Delivered - ${order.orderNumber}`, this.getEmailTemplate('Your order has been delivered!', 'Your order has been successfully delivered. We hope you love your purchase!', order));
    }
    async sendOrderCancelled(order) {
        const extra = `
            <div style="background:#fff3f3;padding:15px;border-radius:6px;margin:20px 0;">
                <h3 style="color:#b42318;margin-top:0;">Order Cancelled</h3>
                ${order.cancellationReason
            ? `<p><strong>Reason:</strong> ${this.escapeHtml(order.cancellationReason)}</p>`
            : ''}
            </div>
        `;
        return this.sendMail(order.email, `Order Cancelled - ${order.orderNumber}`, this.getEmailTemplate('Your order has been cancelled', 'Your order cancellation has been confirmed. If a payment was already made, any applicable refund will be processed separately.', order, extra));
    }
    async sendReturnInitiated(order) {
        const extra = `
            <div style="background:#fff8e8;padding:15px;border-radius:6px;margin:20px 0;">
                <h3 style="margin-top:0;">Return Request Initiated</h3>
                ${order.returnId ? `<p><strong>Return ID:</strong> ${this.escapeHtml(order.returnId)}</p>` : ''}
                ${order.returnReason ? `<p><strong>Reason:</strong> ${this.escapeHtml(order.returnReason)}</p>` : ''}
                <p>We will update you once the returned product is received and inspected.</p>
            </div>
        `;
        return this.sendMail(order.email, `Return Initiated - ${order.orderNumber}`, this.getEmailTemplate('Your return has been initiated', 'Your return request has been accepted for processing. Please follow the return instructions shared by our team.', order, extra));
    }
    async sendReturnCompleted(order) {
        const extra = `
            <div style="background:#eef6ff;padding:15px;border-radius:6px;margin:20px 0;">
                <h3 style="margin-top:0;">Return Completed</h3>
                ${order.returnId ? `<p><strong>Return ID:</strong> ${this.escapeHtml(order.returnId)}</p>` : ''}
                <p>Your returned product has been received and the return process is complete.</p>
            </div>
        `;
        return this.sendMail(order.email, `Return Completed - ${order.orderNumber}`, this.getEmailTemplate('Your return is complete', 'We have successfully completed the return process for your order.', order, extra));
    }
    async sendRefundCompleted(order) {
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
        return this.sendMail(order.email, `Refund Completed - ${order.orderNumber}`, this.getEmailTemplate('Your refund has been processed!', 'Good news! Your refund has been successfully processed.', order, extra));
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = MailerService_1 = __decorate([
    (0, common_1.Injectable)()
], MailerService);
//# sourceMappingURL=mailer.service.js.map