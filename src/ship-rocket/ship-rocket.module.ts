import { Module } from '@nestjs/common';
import { ShipRocketService } from './ship-rocket.service';
import { ShipRocketController } from './ship-rocket.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AdminModule } from 'src/admin/admin.module';

import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Module({
  imports: [DatabaseModule, AdminModule],
  providers: [ShipRocketService, WhatsappService],
  controllers: [ShipRocketController],
  exports: [ShipRocketService],
})
export class ShipRocketModule { }
