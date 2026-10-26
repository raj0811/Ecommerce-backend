
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { UserAuthGuard } from 'src/Guards/user.AuthGuard';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
    };
}

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // Register user
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async registerUser(
        @Body()
        body: {
            name: string;
            email: string;
            password: string;
            number: string;
        },
    ) {
        return this.userService.registerUser(
            body.name,
            body.email,
            body.password,
            body.number,
        );
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async loginUser(
        @Body()
        body: {
            email: string;
            password: string;
        },
    ) {
        return this.userService.loginUser(
            body.email,
            body.password,
        );
    }

    @Get(':userId')
    async getUser(@Param('userId') userId: string) {
        return this.userService.getUser(userId);
    }

    @Get('profile/me')
    @UseGuards(UserAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getMyProfile(@Req() req: AuthenticatedRequest) {
        return this.userService.getUser(req.user.id);
    }
}
