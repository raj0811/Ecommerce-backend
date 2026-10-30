import { Module } from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicketController } from './support-ticket.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserAuthGuard } from 'src/Guards/user.AuthGuard';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [DatabaseModule, UserModule, AdminModule],
  providers: [SupportTicketService],
  controllers: [SupportTicketController],
  exports: [SupportTicketService]
})
export class SupportTicketModule { }
