import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { Admin } from './schema/admin.schema';
import { Customer } from './schema/customer.schema';
import { Product } from './schema/product.schema';
import { LandingPage } from './schema/landingPage.schema';
import { Cart } from './schema/cart.schema';
import { Order } from './schema/order.schema';
import { Transaction } from './schema/transaction.schema';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectModel(User.name)
        public readonly userModel: Model<User>,
        @InjectModel(Admin.name)
        public readonly adminModel: Model<Admin>,
        @InjectModel(Customer.name)
        public readonly customerModel: Model<Customer>,
        @InjectModel(Product.name)
        public readonly productModel: Model<Product>,
        @InjectModel(LandingPage.name)
        public readonly landingPageModel: Model<LandingPage>,
        @InjectModel(Cart.name)
        public readonly cartModel: Model<Cart>,
        @InjectModel(Order.name)
        public readonly orderModel: Model<Order>,
        @InjectModel(Transaction.name)
        public readonly transactionModel: Model<Transaction>
    ) { }
}
