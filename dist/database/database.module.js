"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("./database.service");
const mongoose_1 = require("@nestjs/mongoose");
const admin_schema_1 = require("./schema/admin.schema");
const user_schema_1 = require("./schema/user.schema");
const customer_schema_1 = require("./schema/customer.schema");
const product_schema_1 = require("./schema/product.schema");
const landingPage_schema_1 = require("./schema/landingPage.schema");
const cart_schema_1 = require("./schema/cart.schema");
const order_schema_1 = require("./schema/order.schema");
const transaction_schema_1 = require("./schema/transaction.schema");
const support_ticket_schema_1 = require("./schema/support-ticket.schema");
const webhookLos_schema_1 = require("./schema/webhookLos.schema");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: admin_schema_1.Admin.name, schema: admin_schema_1.AdminSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: customer_schema_1.Customer.name, schema: customer_schema_1.CustomerSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: landingPage_schema_1.LandingPage.name, schema: landingPage_schema_1.LandingPageSchema },
                { name: cart_schema_1.Cart.name, schema: cart_schema_1.CartSchema },
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
                { name: support_ticket_schema_1.SupportTicket.name, schema: support_ticket_schema_1.SupportTicketSchema },
                { name: webhookLos_schema_1.WebhookLog.name, schema: webhookLos_schema_1.WebhookLogSchema }
            ])
        ],
        providers: [database_service_1.DatabaseService],
        exports: [database_service_1.DatabaseService],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map