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
    Param,
    Delete,
    Patch,
    Query,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';
import { AdminRole } from 'src/database/schema/admin.schema';
import { CreateAdminDto, UpdateAdminDto } from 'src/dtos/admin.dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }



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
    async getAdminInformation(
        @Req() req?: any,
    ) {
        const adminId = req.user.id;
        return this.adminService.getAdmin(adminId);
    }


    // Create admin
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AdminAuthGuard)
    async registerAdmin(
        @Body() body: CreateAdminDto,
        @Req() req: any,
    ) {
        if (req.user?.role !== AdminRole.SUPER_ADMIN) {
            throw new UnauthorizedException(
                'Only super admin can create admin accounts',
            );
        }

        return this.adminService.registerAdmin(
            body.name,
            body.email,
            body.number,
            body.password,
            body.role ?? AdminRole.ADMIN,
        );
    }



    // Get all admins with pagination
    @Get('all')
    @UseGuards(AdminAuthGuard)
    async getAllAdmins(
        @Req() req: any,
        @Query('page') page = '1',
        @Query('limit') limit = '10',
        @Query('search') search = '',
    ) {
        if (req.user?.role !== AdminRole.SUPER_ADMIN) {
            throw new UnauthorizedException('Access denied');
        }

        return this.adminService.getAllAdmins(
            Number(page),
            Number(limit),
            search,
        );
    }

    // Get admin by ID
    @Get(':id')
    @UseGuards(AdminAuthGuard)
    async getAdminById(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        if (req.user?.role !== AdminRole.SUPER_ADMIN) {
            throw new UnauthorizedException('Access denied');
        }

        return this.adminService.getAdminById(id);
    }

    // Edit admin
    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    async updateAdmin(
        @Param('id') id: string,
        @Body() body: UpdateAdminDto,
        @Req() req: any,
    ) {
        if (req.user?.role !== AdminRole.SUPER_ADMIN) {
            throw new UnauthorizedException('Access denied');
        }

        return this.adminService.updateAdmin(id, body);
    }

    // Delete admin
    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    async deleteAdmin(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        if (req.user?.role !== AdminRole.SUPER_ADMIN) {
            throw new UnauthorizedException('Access denied');
        }

        return this.adminService.deleteAdmin(id, req.user.id);
    }
}