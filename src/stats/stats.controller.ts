
import {
    Controller,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';

import { StatsService } from './stats.service';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';

@Controller('admin/stats')
@UseGuards(AdminAuthGuard)
export class StatsController {
    constructor(
        private readonly statsService: StatsService,
    ) { }

    @Get('overview')
    async getOverview(
        @Query('from') from?: string,
        @Query('to') to?: string,
    ) {
        return this.statsService.getOverview(from, to);
    }
}
