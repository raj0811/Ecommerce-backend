import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';
import { AdminModule } from 'src/admin/admin.module';
import { CartModule } from 'src/cart/cart.module';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Module({
  imports: [DatabaseModule, AdminModule, CartModule, WhatsappModule],
  providers: [PaymentService, AdminAuthGuard],
  controllers: [PaymentController]
})
export class PaymentModule { }
