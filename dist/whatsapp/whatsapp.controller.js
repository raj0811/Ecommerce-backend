"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappController = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const order_service_1 = require("../order/order.service");
let WhatsappController = class WhatsappController {
    databaseService;
    ordersService;
    constructor(databaseService, ordersService) {
        this.databaseService = databaseService;
        this.ordersService = ordersService;
    }
    async verifyWebhook(mode, token, challenge, res, body) {
        console.log('WhatsApp webhook verification:', {
            mode,
            token,
            tokenReceived: !!token,
            challenge,
            body
        });
        try {
            await this.databaseService.webhookLogModel.create({
                log: JSON.stringify({ body, mode, token, challenge }),
                event: "WP"
            });
        }
        catch (e) {
            console.log('fail to save logs');
        }
        if (mode === 'subscribe' &&
            token === process.env.VERIFY_TOKEN_WP) {
            console.log('return');
            return res.status(200).send(challenge);
        }
        return res.sendStatus(403);
    }
    async receiveMessage(body, req) {
        const headers = req.headers;
        await this.databaseService.webhookLogModel.create({
            log: JSON.stringify(body),
            headers: JSON.stringify(headers),
            event: "refund"
        });
        const messages = body?.entry?.flatMap((entry) => entry?.changes?.flatMap((change) => change?.value?.messages ?? [])) ?? [];
        for (const message of messages) {
            if (message.type !== "interactive")
                continue;
            const buttonId = message.interactive?.button_reply?.id;
            const customerPhone = message.from;
            if (!buttonId || !customerPhone)
                continue;
            console.log("COD button reply:", {
                buttonId,
                customerPhone,
            });
            try {
                const result = await this.ordersService.handleCodConfirmationReply(customerPhone, buttonId);
                console.log("COD confirmation result:", result);
            }
            catch (error) {
                console.error("Failed to process COD confirmation:", error.message);
            }
        }
        return { received: true };
    }
};
exports.WhatsappController = WhatsappController;
__decorate([
    (0, common_1.Get)('webhook'),
    __param(0, (0, common_1.Query)('hub.mode')),
    __param(1, (0, common_1.Query)('hub.verify_token')),
    __param(2, (0, common_1.Query)('hub.challenge')),
    __param(3, (0, common_1.Res)()),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "verifyWebhook", null);
__decorate([
    (0, common_1.Post)("webhook"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "receiveMessage", null);
exports.WhatsappController = WhatsappController = __decorate([
    (0, common_1.Controller)('whatsapp'),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        order_service_1.OrderService])
], WhatsappController);
//# sourceMappingURL=whatsapp.controller.js.map