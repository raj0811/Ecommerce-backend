import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { DatabaseModule } from 'src/database/database.module';
import { StatsService } from './stats.service';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [DatabaseModule, AdminModule],
  providers: [StatsService],
  controllers: [StatsController]
})
export class StatsModule { }
