import { Types } from 'mongoose';
import { DatabaseService } from "../database/database.service";
export declare class CartService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    private getOrCreateCart;
    private populateCart;
    getCart(userId?: string, guestId?: string): Promise<any>;
    addItem(productId: string, quantity?: number, userId?: string, guestId?: string): Promise<any>;
    updateItemQuantity(productId: string, quantity: number, userId?: string, guestId?: string): Promise<any>;
    removeItem(productId: string, userId?: string, guestId?: string): Promise<{
        message: string;
        cart: any;
    }>;
    clearCart(userId?: string, guestId?: string): Promise<{
        message: string;
        cart: import("mongoose").Document<unknown, {}, import("src/database/schema/cart.schema").Cart, {}, import("mongoose").DefaultSchemaOptions> & import("src/database/schema/cart.schema").Cart & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getAbandonedCarts(page?: number, limit?: number): Promise<{
        data: {
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
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
