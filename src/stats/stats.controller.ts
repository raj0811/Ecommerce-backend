
import {
    Controller,
    ForbiddenException,
    Get,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';

import { StatsService } from './stats.service';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';
import { AdminRole } from 'src/database/schema/admin.schema';

@Controller('admin/stats')
@UseGuards(AdminAuthGuard)
export class StatsController {
    constructor(
        private readonly statsService: StatsService,
    ) { }

    @Get('overview')
    async getOverview(
        @Req() req: any,
        @Query('from') from?: string,
        @Query('to') to?: string,
    ) {
        const allowedRoles = [
            AdminRole.SUPER_ADMIN,
            AdminRole.ADMIN,
            AdminRole.OPERATIONS,
        ];

        if (!allowedRoles.includes(req.user?.role)) {
            throw new ForbiddenException(
                'You do not have permission to add products',
            );
        }
        return this.statsService.getOverview(from, to);
    }
}
