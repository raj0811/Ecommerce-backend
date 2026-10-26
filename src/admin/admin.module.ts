import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { DatabaseModule } from 'src/database/database.module';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';

@Module({
  imports: [DatabaseModule],
  providers: [AdminService, AdminAuthGuard],
  exports: [AdminService]
})
export class AdminModule { }
