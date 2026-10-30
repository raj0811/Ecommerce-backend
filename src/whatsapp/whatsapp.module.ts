import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [DatabaseModule, OrderModule],
  providers: [WhatsappService],
  controllers: [WhatsappController],
  exports: [WhatsappService]
})
export class WhatsappModule { }
