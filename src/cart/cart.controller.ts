
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
    Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { CartService } from './cart.service';

type AuthenticatedRequest = Request & {
    user?: {
        id?: string;
        _id?: string;
    };
};

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    private getIdentity(
        request: AuthenticatedRequest,
        guestId?: string,
    ) {
        const userId = request.user?.id ?? request.user?._id;

        if (!userId && !guestId) {
            throw new BadRequestException(
                'x-guest-id header is required for guest carts',
            );
        }

        return { userId, guestId };
    }

    @Get()
    getCart(
        @Req() request: AuthenticatedRequest,
        @Headers('x-guest-id') guestId?: string,
    ) {
        const identity = this.getIdentity(request, guestId);

        return this.cartService.getCart(
            identity.userId,
            identity.guestId,
        );
    }

    @Post('items')
    addItem(
        @Body() body: { productId: string; quantity?: number },
        @Req() request: AuthenticatedRequest,
        @Headers('x-guest-id') guestId?: string,
    ) {
        const identity = this.getIdentity(request, guestId);

        return this.cartService.addItem(
            body.productId,
            body.quantity ?? 1,
            identity.userId,
            identity.guestId,
        );
    }

    @Patch('items/:productId')
    updateItemQuantity(
        @Param('productId') productId: string,
        @Body() body: { quantity: number },
        @Req() request: AuthenticatedRequest,
        @Headers('x-guest-id') guestId?: string,
    ) {
        const identity = this.getIdentity(request, guestId);

        return this.cartService.updateItemQuantity(
            productId,
            body.quantity,
            identity.userId,
            identity.guestId,
        );
    }

    @Delete('items/:productId')
    removeItem(
        @Param('productId') productId: string,
        @Req() request: AuthenticatedRequest,
        @Headers('x-guest-id') guestId?: string,
    ) {
        const identity = this.getIdentity(request, guestId);

        return this.cartService.removeItem(
            productId,
            identity.userId,
            identity.guestId,
        );
    }

    @Delete()
    clearCart(
        @Req() request: AuthenticatedRequest,
        @Headers('x-guest-id') guestId?: string,
    ) {
        const identity = this.getIdentity(request, guestId);

        return this.cartService.clearCart(
            identity.userId,
            identity.guestId,
        );
    }
}
