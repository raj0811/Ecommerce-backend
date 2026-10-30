import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { DatabaseModule } from 'src/database/database.module';
import { OrderController } from './order.controller';
import { ShipRocketModule } from 'src/ship-rocket/ship-rocket.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { PaymentModule } from 'src/payment/payment.module';
import { PaymentService } from 'src/payment/payment.service';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [DatabaseModule, ShipRocketModule, UserModule, AdminModule],
  providers: [OrderService, WhatsappService, PaymentService, AdminAuthGuard],
  exports: [OrderService],
  controllers: [OrderController]
})
export class OrderModule { }
