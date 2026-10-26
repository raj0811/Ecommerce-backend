import { Module } from '@nestjs/common';
import { LandingPageService } from './landin-page.service';
import { LandingPageController } from './landin-page.controller';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';
import { DatabaseModule } from 'src/database/database.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [DatabaseModule, AdminModule],
  providers: [LandingPageService, AdminAuthGuard],
  controllers: [LandingPageController]
})
export class LandingPageModule { }
