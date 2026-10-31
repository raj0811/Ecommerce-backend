import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { Admin } from './schema/admin.schema';
import { Customer } from './schema/customer.schema';
import { Product } from './schema/product.schema';
import { LandingPage } from './schema/landingPage.schema';
import { Cart } from './schema/cart.schema';
import { Order } from './schema/order.schema';
import { Transaction } from './schema/transaction.schema';
import { SupportTicket } from './schema/support-ticket.schema';
import { WebhookLog } from './schema/webhookLos.schema';
import { Connection } from "mongoose";
import { Otp } from './schema/otp.schema';
export declare class DatabaseService {
    readonly connection: Connection;
    readonly userModel: Model<User>;
    readonly adminModel: Model<Admin>;
    readonly customerModel: Model<Customer>;
    readonly productModel: Model<Product>;
    readonly landingPageModel: Model<LandingPage>;
    readonly cartModel: Model<Cart>;
    readonly orderModel: Model<Order>;
    readonly transactionModel: Model<Transaction>;
    readonly supportTicketModel: Model<SupportTicket>;
    readonly webhookLogModel: Model<WebhookLog>;
    readonly otpModel: Model<Otp>;
    constructor(connection: Connection, userModel: Model<User>, adminModel: Model<Admin>, customerModel: Model<Customer>, productModel: Model<Product>, landingPageModel: Model<LandingPage>, cartModel: Model<Cart>, orderModel: Model<Order>, transactionModel: Model<Transaction>, supportTicketModel: Model<SupportTicket>, webhookLogModel: Model<WebhookLog>, otpModel: Model<Otp>);
}
