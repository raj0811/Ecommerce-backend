"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./database/database.module");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const admin_controller_1 = require("./admin/admin.controller");
const admin_module_1 = require("./admin/admin.module");
const mongoose_1 = require("@nestjs/mongoose");
const customer_module_1 = require("./customer/customer.module");
const product_module_1 = require("./product/product.module");
const s3_bucket_module_1 = require("./s3-bucket/s3-bucket.module");
const landin_page_module_1 = require("./landin-page/landin-page.module");
const cart_module_1 = require("./cart/cart.module");
const payment_module_1 = require("./payment/payment.module");
const order_module_1 = require("./order/order.module");
const ship_rocket_module_1 = require("./ship-rocket/ship-rocket.module");
const support_ticket_module_1 = require("./support-ticket/support-ticket.module");
const mailer_module_1 = require("./mailer/mailer.module");
const whatsapp_module_1 = require("./whatsapp/whatsapp.module");
const stats_service_1 = require("./stats/stats.service");
const stats_module_1 = require("./stats/stats.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'default',
                    ttl: 60 * 1000,
                    limit: 100,
                },
            ]),
            mongoose_1.MongooseModule.forRoot(process.env.DB),
            database_module_1.DatabaseModule,
            user_module_1.UserModule,
            admin_module_1.AdminModule,
            customer_module_1.CustomerModule,
            product_module_1.ProductModule,
            s3_bucket_module_1.S3BucketModule,
            landin_page_module_1.LandingPageModule,
            cart_module_1.CartModule,
            payment_module_1.PaymentModule,
            order_module_1.OrderModule,
            ship_rocket_module_1.ShipRocketModule,
            support_ticket_module_1.SupportTicketModule,
            mailer_module_1.MailerModule,
            whatsapp_module_1.WhatsappModule,
            stats_module_1.StatsModule
        ],
        controllers: [app_controller_1.AppController, admin_controller_1.AdminController],
        providers: [app_service_1.AppService, stats_service_1.StatsService, {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map