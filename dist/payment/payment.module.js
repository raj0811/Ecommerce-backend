"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const payment_controller_1 = require("./payment.controller");
const database_module_1 = require("../database/database.module");
const admin_AuthGuard_1 = require("../Guards/admin.AuthGuard");
const admin_module_1 = require("../admin/admin.module");
const cart_module_1 = require("../cart/cart.module");
const whatsapp_module_1 = require("../whatsapp/whatsapp.module");
const user_module_1 = require("../user/user.module");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, admin_module_1.AdminModule, cart_module_1.CartModule, whatsapp_module_1.WhatsappModule, user_module_1.UserModule],
        providers: [payment_service_1.PaymentService, admin_AuthGuard_1.AdminAuthGuard],
        controllers: [payment_controller_1.PaymentController]
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map