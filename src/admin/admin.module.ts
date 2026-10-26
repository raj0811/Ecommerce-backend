import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule { }
