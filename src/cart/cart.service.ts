
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { DatabaseService } from 'src/database/database.service';
import { CartStatus } from 'src/database/schema/cart.schema';

@Injectable()
export class CartService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    private async getOrCreateCart(
        userId?: string,
        guestId?: string,
    ) {
        if (userId) {
            if (!Types.ObjectId.isValid(userId)) {
                throw new BadRequestException('Invalid user ID');
            }

            const cart = await this.databaseService.cartModel.findOne({
                userId: new Types.ObjectId(userId),
                status: CartStatus.ACTIVE,
            });

            if (cart) return cart;

            return this.databaseService.cartModel.create({
                userId: new Types.ObjectId(userId),
                guestId: null,
                items: [],
                status: CartStatus.ACTIVE,
                lastActivityAt: new Date(),
            });
        }

        if (
            !guestId ||
            guestId.length > 128 ||
            !/^[a-zA-Z0-9_-]+$/.test(guestId)
        ) {
            throw new BadRequestException('A valid guestId is required');
        }

        const cart = await this.databaseService.cartModel.findOne({
            guestId,
            status: CartStatus.ACTIVE,
        });

        if (cart) return cart;

        return this.databaseService.cartModel.create({
            userId: null,
            guestId,
            items: [],
            status: CartStatus.ACTIVE,
            lastActivityAt: new Date(),
        });
    }

    private async populateCart(cart: any) {
        await cart.populate({
            path: 'items.productId',
            select: 'name price compareAtPrice images stock isActive sku',
        });

        return cart;
    }

    async getCart(userId?: string, guestId?: string) {
        const cart = await this.getOrCreateCart(userId, guestId);
        return this.populateCart(cart);
    }

    async addItem(
        productId: string,
        quantity = 1,
        userId?: string,
        guestId?: string,
    ) {
        if (!Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid product ID');
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new BadRequestException(
                'Quantity must be a positive integer',
            );
        }

        const product = await this.databaseService.productModel
            .findById(productId)
            .lean()
            .exec();

        if (!product || product.isActive === false) {
            throw new NotFoundException('Product not found or inactive');
        }

        const cart = await this.getOrCreateCart(userId, guestId);

        const existingItem = cart.items.find(
            (item: any) => item.productId.toString() === productId,
        );

        const newQuantity = existingItem
            ? existingItem.quantity + quantity
            : quantity;

        if (
            typeof product.stock !== 'number' ||
            newQuantity > product.stock
        ) {
            throw new BadRequestException(
                'Requested quantity exceeds available stock',
            );
        }

        if (existingItem) {
            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                productId: new Types.ObjectId(productId),
                quantity,
                price: product.price,
            } as any);
        }

        cart.lastActivityAt = new Date();
        await cart.save();

        return this.populateCart(cart);
    }

    async updateItemQuantity(
        productId: string,
        quantity: number,
        userId?: string,
        guestId?: string,
    ) {
        if (!Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid product ID');
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new BadRequestException(
                'Quantity must be a positive integer',
            );
        }

        const cart = await this.getOrCreateCart(userId, guestId);

        const item = cart.items.find(
            (entry: any) => entry.productId.toString() === productId,
        );

        if (!item) {
            throw new NotFoundException('Product not found in cart');
        }

        const product = await this.databaseService.productModel
            .findById(productId)
            .lean()
            .exec();

        if (
            !product ||
            product.isActive === false ||
            typeof product.stock !== 'number' ||
            quantity > product.stock
        ) {
            throw new BadRequestException(
                'Product unavailable or requested quantity exceeds stock',
            );
        }

        item.quantity = quantity;
        cart.lastActivityAt = new Date();

        await cart.save();

        return this.populateCart(cart);
    }

    async removeItem(
        productId: string,
        userId?: string,
        guestId?: string,
    ) {
        if (!Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid product ID');
        }

        const cart = await this.getOrCreateCart(userId, guestId);

        const originalLength = cart.items.length;

        cart.items = cart.items.filter(
            (item: any) => item.productId.toString() !== productId,
        ) as typeof cart.items;

        if (cart.items.length === originalLength) {
            throw new NotFoundException('Product not found in cart');
        }

        cart.lastActivityAt = new Date();
        await cart.save();

        return {
            message: 'Product removed from cart',
            cart: await this.populateCart(cart),
        };
    }

    async clearCart(userId?: string, guestId?: string) {
        const cart = await this.getOrCreateCart(userId, guestId);

        cart.items = [];
        cart.lastActivityAt = new Date();

        await cart.save();

        return {
            message: 'Cart cleared successfully',
            cart,
        };
    }
}
