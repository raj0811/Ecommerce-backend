
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import * as jwt from 'jsonwebtoken'
import { CartService } from './cart.service';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';

type JwtPayload = {
    id?: string;
    sub?: string;
    _id?: string;
};

type AuthenticatedRequest = Request;

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
    ) { }

    private async getIdentity(
        request: AuthenticatedRequest,
        guestId?: string,
    ): Promise<{ userId?: string; guestId?: string }> {
        const authorization = request.headers.authorization;

        // If a token is provided, it must be valid.
        if (authorization) {
            const [scheme, token] = authorization.split(' ');

            if (scheme !== 'Bearer' || !token) {
                throw new UnauthorizedException('Invalid authorization header');
            }

            try {
                const payload = await jwt.verify<JwtPayload>(
                    token, process.env.JWT_SECRET,

                );

                const userId = payload.id ?? payload._id ?? payload.sub;

                if (!userId) {
                    throw new UnauthorizedException(
                        'User ID missing from access token',
                    );
                }

                // Authenticated requests always use the verified JWT identity.
                return { userId };
            } catch (error) {
                console.log(error);

                if (error instanceof UnauthorizedException) {
                    throw error;
                }

                throw new UnauthorizedException('Invalid or expired access token');
            }
        }
        console.log('no auth');

        // No token: allow guest cart requests.
        if (!guestId?.trim()) {
            throw new BadRequestException(
                'x-guest-id header is required for guest carts',
            );
        }

        return { guestId: guestId.trim() };
    }

    @Get()
    async getCart(
        @Req() request: AuthenticatedRequest,
        @Headers('x-guest-id') guestId?: string,
    ) {
        const identity = await this.getIdentity(request, guestId);

        return this.cartService.getCart(
            identity.userId,
            identity.guestId,
        );
    }

    @Post('items')
    async addItem(
        @Body() body: { productId: string; quantity?: number },
        @Req() request: AuthenticatedRequest,
        @Headers('x-guest-id') guestId?: string,
    ) {

        if (!body.productId?.trim()) {
            throw new BadRequestException('productId is required');
        }

        const quantity = body.quantity ?? 1;

        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new BadRequestException(
                'quantity must be a positive integer',
            );
        }

        const identity = await this.getIdentity(request, guestId);

        return this.cartService.addItem(
            body.productId,
            quantity,
            identity.userId,
            identity.guestId,
        );
    }

    @Patch('items/:productId')
    async updateItemQuantity(
        @Param('productId') productId: string,
        @Body() body: { quantity: number },
        @Req() request: AuthenticatedRequest,
        @Headers('x-guest-id') guestId?: string,
    ) {
        if (!Number.isInteger(body.quantity) || body.quantity < 1) {
            throw new BadRequestException(
                'quantity must be a positive integer',
            );
        }

        const identity = await this.getIdentity(request, guestId);

        return this.cartService.updateItemQuantity(
            productId,
            body.quantity,
            identity.userId,
            identity.guestId,
        );
    }

    @Delete('items/:productId')
    async removeItem(
        @Param('productId') productId: string,
        @Req() request: AuthenticatedRequest,
        @Headers('x-guest-id') guestId?: string,
    ) {
        const identity = await this.getIdentity(request, guestId);

        return this.cartService.removeItem(
            productId,
            identity.userId,
            identity.guestId,
        );
    }

    @Delete()
    async clearCart(
        @Req() request: AuthenticatedRequest,
        @Headers('x-guest-id') guestId?: string,
    ) {
        const identity = await this.getIdentity(request, guestId);

        return this.cartService.clearCart(
            identity.userId,
            identity.guestId,
        );
    }

    // cart.controller.ts
    @Get('abandoned')
    @UseGuards(AdminAuthGuard)
    async getAbandonedCarts(
        @Query('page') pageQuery?: string,
        @Query('limit') limitQuery?: string,
    ) {
        const page = Math.max(1, parseInt(pageQuery ?? '1', 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, parseInt(limitQuery ?? '20', 10) || 20),
        );

        return this.cartService.getAbandonedCarts(page, limit);
    }
}
