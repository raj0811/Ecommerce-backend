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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schema/user.schema");
const mongoose_2 = require("mongoose");
const admin_schema_1 = require("./schema/admin.schema");
const customer_schema_1 = require("./schema/customer.schema");
const product_schema_1 = require("./schema/product.schema");
const landingPage_schema_1 = require("./schema/landingPage.schema");
const cart_schema_1 = require("./schema/cart.schema");
const order_schema_1 = require("./schema/order.schema");
const transaction_schema_1 = require("./schema/transaction.schema");
const support_ticket_schema_1 = require("./schema/support-ticket.schema");
const webhookLos_schema_1 = require("./schema/webhookLos.schema");
const mongoose_3 = require("mongoose");
const otp_schema_1 = require("./schema/otp.schema");
let DatabaseService = class DatabaseService {
    connection;
    userModel;
    adminModel;
    customerModel;
    productModel;
    landingPageModel;
    cartModel;
    orderModel;
    transactionModel;
    supportTicketModel;
    webhookLogModel;
    otpModel;
    constructor(connection, userModel, adminModel, customerModel, productModel, landingPageModel, cartModel, orderModel, transactionModel, supportTicketModel, webhookLogModel, otpModel) {
        this.connection = connection;
        this.userModel = userModel;
        this.adminModel = adminModel;
        this.customerModel = customerModel;
        this.productModel = productModel;
        this.landingPageModel = landingPageModel;
        this.cartModel = cartModel;
        this.orderModel = orderModel;
        this.transactionModel = transactionModel;
        this.supportTicketModel = supportTicketModel;
        this.webhookLogModel = webhookLogModel;
        this.otpModel = otpModel;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __param(3, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __param(4, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(5, (0, mongoose_1.InjectModel)(landingPage_schema_1.LandingPage.name)),
    __param(6, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(7, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(8, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(9, (0, mongoose_1.InjectModel)(support_ticket_schema_1.SupportTicket.name)),
    __param(10, (0, mongoose_1.InjectModel)(webhookLos_schema_1.WebhookLog.name)),
    __param(11, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __metadata("design:paramtypes", [mongoose_3.Connection,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DatabaseService);
//# sourceMappingURL=database.service.js.map