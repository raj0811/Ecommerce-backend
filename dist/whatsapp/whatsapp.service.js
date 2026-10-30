"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let WhatsappService = class WhatsappService {
    async sendMessage(to, message) {
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const token = process.env.WHATSAPP_ACCESS_TOKEN;
        const version = process.env.WHATSAPP_API_VERSION || 'v26.0';
        const config = {
            method: 'POST',
            url: `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to,
                type: 'text',
                text: {
                    preview_url: false,
                    body: message,
                },
            },
        };
        try {
            const response = await axios_1.default.request(config);
            return response.data;
        }
        catch (error) {
            console.error('WhatsApp API error:', error.response?.data || error.message);
            throw new common_1.InternalServerErrorException(error.response?.data?.error?.message ||
                'Unable to send WhatsApp message');
        }
    }
    async sendOrderReceived(data) {
        const message = `
Hi ${data.customerName}! 👋

Thank you for shopping with Alpha Male!

We have successfully received your order.

📦 Order Number: ${data.orderNumber}
💰 Order Total: ₹${data.total.toLocaleString('en-IN')}

Your order is now being processed.

We'll keep you updated about your order status.

Thank you for choosing Alpha Male! ❤️
`;
        return this.sendMessage(data.phone, message.trim());
    }
    async sendCodOrderConfirmation(data) {
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const token = process.env.WHATSAPP_ACCESS_TOKEN;
        const version = process.env.WHATSAPP_API_VERSION || "v26.0";
        if (!phoneNumberId || !token) {
            throw new Error("WhatsApp credentials are missing.");
        }
        const phone = data.phone.replace(/\D/g, "");
        const config = {
            method: "POST",
            url: `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: phone,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: {
                        text: `Hi ${data.customerName}! 👋\n\n` +
                            `Thank you for shopping with Alpha Male.\n\n` +
                            `Your COD order is waiting for confirmation.\n\n` +
                            `Order: ${data.orderNumber}\n` +
                            `Amount: ₹${data.total.toLocaleString("en-IN")}\n\n` +
                            `Would you like to confirm this order?`,
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: `CONFIRM_COD_${data.orderId}`,
                                    title: "YES, CONFIRM",
                                },
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: `CANCEL_COD_${data.orderId}`,
                                    title: "NO, CANCEL",
                                },
                            },
                        ],
                    },
                },
            },
        };
        try {
            const response = await axios_1.default.request(config);
            return response.data;
        }
        catch (error) {
            console.error("WhatsApp COD confirmation error:", error.response?.data || error.message);
            throw error;
        }
    }
    async sendOrderShipped(data) {
        return this.sendMessage(data.phone, `Hi ${data.customerName}! 📦

Great news! Your Alpha Male order ${data.orderNumber} has been shipped.

Tracking ID: ${data.orderNumber}

Track your order here:
${data.trackingUrl}

Thank you for shopping with Alpha Male!`);
    }
    async sendOrderDelivered(data) {
        return this.sendMessage(data.phone, `Hi ${data.customerName}! 🎉

Your Alpha Male order ${data.orderNumber} has been successfully delivered.

We hope you enjoy your purchase!

Thank you for shopping with Alpha Male.`);
    }
    async sendOrderCancelled(data) {
        return this.sendMessage(data.phone, `Hi ${data.customerName}! 

Your Alpha Male order ${data.orderNumber} has been cancelled.

If you did not request this cancellation or need assistance, please contact our support team.

Thank you for considering Alpha Male.`);
    }
    async sendReturnInitiated(data) {
        return this.sendMessage(data.phone, `Hi ${data.customerName}! 📦

Your return request for Alpha Male order ${data.orderNumber} has been successfully initiated.

Our team will review your request and arrange the next steps for the return.

We will keep you updated on the return process.

Thank you for shopping with Alpha Male!`);
    }
    async sendReturnCompleted(data) {
        const refundMessage = data.refundAmount !== undefined
            ? `\nRefund Amount: ₹${data.refundAmount.toLocaleString("en-IN")}\n`
            : "";
        return this.sendMessage(data.phone, `Hi ${data.customerName}! 🎉

Your return for Alpha Male order ${data.orderNumber} has been successfully completed.
${refundMessage}
Thank you for your patience and for shopping with Alpha Male! ❤️`);
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)()
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map