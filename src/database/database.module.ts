import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schema/admin.schema';
import { User, UserSchema } from './schema/user.schema';
import { Customer, CustomerSchema } from './schema/customer.schema';
import { Product, ProductSchema } from './schema/product.schema';
import { LandingPage, LandingPageSchema } from './schema/landingPage.schema';
import { Cart, CartSchema } from './schema/cart.schema';
import { Order, OrderSchema } from './schema/order.schema';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { SupportTicket, SupportTicketSchema } from './schema/support-ticket.schema';
import { WebhookLog, WebhookLogSchema } from './schema/webhookLos.schema';
import { Otp, OtpSchema } from './schema/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Product.name, schema: ProductSchema },
      { name: LandingPage.name, schema: LandingPageSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: SupportTicket.name, schema: SupportTicketSchema },
      { name: WebhookLog.name, schema: WebhookLogSchema },
      { name: Otp.name, schema: OtpSchema }
    ])
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule { }
