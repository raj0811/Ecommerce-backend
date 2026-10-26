import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Headers,
    UnauthorizedException,
    Req,
    UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async registerAdmin(
        @Body()
        body: {
            name: string;
            email: string;
            number: string;
            password: string;
        },
    ) {
        return this.adminService.registerAdmin(
            body.name,
            body.email,
            body.number,
            body.password,
        );
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async loginAdmin(
        @Body()
        body: {
            email: string;
            password: string;
        },
    ) {
        return this.adminService.loginAdmin(body.email, body.password);
    }

    @Get('profile')
    @UseGuards(AdminAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getAdminInfo(
        @Req() req?: any,
    ) {
        const adminId = req.user.id;
        return this.adminService.getAdmin(adminId);
    }
}