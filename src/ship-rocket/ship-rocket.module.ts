import { Module } from '@nestjs/common';
import { ShipRocketService } from './ship-rocket.service';
import { ShipRocketController } from './ship-rocket.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [DatabaseModule, AdminModule],
  providers: [ShipRocketService],
  controllers: [ShipRocketController],
  exports: [ShipRocketService],
})
export class ShipRocketModule { }
