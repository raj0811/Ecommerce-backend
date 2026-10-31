import type { Request } from 'express';
import { CartService } from './cart.service';
type AuthenticatedRequest = Request;
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    private getIdentity;
    getCart(request: AuthenticatedRequest, guestId?: string): Promise<any>;
    addItem(body: {
        productId: string;
        quantity?: number;
    }, request: AuthenticatedRequest, guestId?: string): Promise<any>;
    updateItemQuantity(productId: string, body: {
        quantity: number;
    }, request: AuthenticatedRequest, guestId?: string): Promise<any>;
    removeItem(productId: string, request: AuthenticatedRequest, guestId?: string): Promise<{
        message: string;
        cart: any;
    }>;
    clearCart(request: AuthenticatedRequest, guestId?: string): Promise<{
        message: string;
        cart: import("mongoose").Document<unknown, {}, import("../database/schema/cart.schema").Cart, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schema/cart.schema").Cart & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getAbandonedCarts(): Promise<{
        cartId: any;
        user: {
            userId: any;
            name: any;
            number: any;
            email: any;
        };
        items: any;
        updatedAt: any;
        createdAt: any;
    }[]>;
}
export {};
