import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schema/admin.schema';
import { User, UserSchema } from './schema/user.schema';
import { Customer, CustomerSchema } from './schema/customer.schema';
import { Product, ProductSchema } from './schema/product.schema';
import { LandingPage, LandingPageSchema } from './schema/landingPage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Product.name, schema: ProductSchema },
      { name: LandingPage.name, schema: LandingPageSchema }
    ])
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule { }
