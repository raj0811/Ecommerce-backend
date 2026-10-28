import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { S3BucketModule } from './s3-bucket/s3-bucket.module';
import { LandingPageModule } from './landin-page/landin-page.module';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB!),
    DatabaseModule,
    UserModule,
    AdminModule,
    CustomerModule,
    ProductModule,
    S3BucketModule,
    LandingPageModule,
    CartModule,
    PaymentModule,
    OrderModule
  ],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule { }
