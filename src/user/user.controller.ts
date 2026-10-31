
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UpdateUserAddressDto, UserService } from './user.service';
import { UserAuthGuard } from 'src/Guards/user.AuthGuard';
import { Throttle } from '@nestjs/throttler';

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
    @Throttle({ default: { limit: 5, ttl: 60 * 1000 } })
    async loginUser(
        @Body()
        body: {
            email: string;
            password: string;
        },
    ) {
        return this.userService.loginUserotp(
            body.email,
            body.password,
        );
    }

    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 5 * 60 * 1000 } })
    async verifyLoginOtp(
        @Body()
        body: {
            challengeToken: string;
            otp: string;
        },
    ) {
        return this.userService.verifyLoginOtp(
            body.challengeToken,
            body.otp,
        );
    }


    @Post('resend-otp')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 15 * 60 * 1000 } })
    async resendLoginOtp(
        @Body()
        body: {
            challengeToken: string;
        },
    ) {
        return this.userService.resendLoginOtp(
            body.challengeToken,
        );
    }

    @Get(':userId')
    @UseGuards(UserAuthGuard)
    async getUser(@Param('userId') userId: string) {
        return this.userService.getUser(userId);
    }

    @Get('profile/me')
    @UseGuards(UserAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getMyProfile(@Req() req: AuthenticatedRequest) {
        return this.userService.getUser(req.user.id);
    }

    @Post('address')
    @UseGuards(UserAuthGuard)
    async addUserAddress(
        @Req() req,
        @Body() address: UpdateUserAddressDto,
    ) {
        return this.userService.updateUserAddress(
            req.user.id,
            address,
        );
    }

    @Post('toogle-auth')
    @UseGuards(UserAuthGuard)
    async toogleAuth(@Req() req: any) {
        const userId = req.user?.id ?? req.user?._id;

        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }

        return this.userService.toggleTwoFactor(userId);
    }
}
