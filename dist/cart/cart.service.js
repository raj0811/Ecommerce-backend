"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const database_service_1 = require("../database/database.service");
const cart_schema_1 = require("../database/schema/cart.schema");
let CartService = class CartService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async getOrCreateCart(userId, guestId) {
        if (userId) {
            if (!mongoose_1.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const cart = await this.databaseService.cartModel.findOne({
                userId: new mongoose_1.Types.ObjectId(userId),
                status: cart_schema_1.CartStatus.ACTIVE,
            });
            if (cart)
                return cart;
            return this.databaseService.cartModel.create({
                userId: new mongoose_1.Types.ObjectId(userId),
                guestId: null,
                items: [],
                status: cart_schema_1.CartStatus.ACTIVE,
                lastActivityAt: new Date(),
            });
        }
        if (!guestId ||
            guestId.length > 128 ||
            !/^[a-zA-Z0-9_-]+$/.test(guestId)) {
            throw new common_1.BadRequestException('A valid guestId is required');
        }
        const cart = await this.databaseService.cartModel.findOne({
            guestId,
            status: cart_schema_1.CartStatus.ACTIVE,
        });
        if (cart)
            return cart;
        return this.databaseService.cartModel.create({
            userId: null,
            guestId,
            items: [],
            status: cart_schema_1.CartStatus.ACTIVE,
            lastActivityAt: new Date(),
        });
    }
    async populateCart(cart) {
        await cart.populate({
            path: 'items.productId',
            select: 'name price compareAtPrice images stock isActive sku',
        });
        return cart;
    }
    async getCart(userId, guestId) {
        const cart = await this.getOrCreateCart(userId, guestId);
        return this.populateCart(cart);
    }
    async addItem(productId, quantity = 1, userId, guestId) {
        if (!mongoose_1.Types.ObjectId.isValid(productId)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new common_1.BadRequestException('Quantity must be a positive integer');
        }
        const product = await this.databaseService.productModel
            .findById(productId)
            .lean()
            .exec();
        if (!product || product.isActive === false) {
            throw new common_1.NotFoundException('Product not found or inactive');
        }
        const cart = await this.getOrCreateCart(userId, guestId);
        const existingItem = cart.items.find((item) => item.productId.toString() === productId);
        const newQuantity = existingItem
            ? existingItem.quantity + quantity
            : quantity;
        if (typeof product.stock !== 'number' ||
            newQuantity > product.stock) {
            throw new common_1.BadRequestException('Requested quantity exceeds available stock');
        }
        if (existingItem) {
            existingItem.quantity = newQuantity;
        }
        else {
            cart.items.push({
                productId: new mongoose_1.Types.ObjectId(productId),
                quantity,
                price: product.price,
            });
        }
        cart.lastActivityAt = new Date();
        await cart.save();
        return this.populateCart(cart);
    }
    async updateItemQuantity(productId, quantity, userId, guestId) {
        if (!mongoose_1.Types.ObjectId.isValid(productId)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new common_1.BadRequestException('Quantity must be a positive integer');
        }
        const cart = await this.getOrCreateCart(userId, guestId);
        const item = cart.items.find((entry) => entry.productId.toString() === productId);
        if (!item) {
            throw new common_1.NotFoundException('Product not found in cart');
        }
        const product = await this.databaseService.productModel
            .findById(productId)
            .lean()
            .exec();
        if (!product ||
            product.isActive === false ||
            typeof product.stock !== 'number' ||
            quantity > product.stock) {
            throw new common_1.BadRequestException('Product unavailable or requested quantity exceeds stock');
        }
        item.quantity = quantity;
        cart.lastActivityAt = new Date();
        await cart.save();
        return this.populateCart(cart);
    }
    async removeItem(productId, userId, guestId) {
        if (!mongoose_1.Types.ObjectId.isValid(productId)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const cart = await this.getOrCreateCart(userId, guestId);
        const originalLength = cart.items.length;
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        if (cart.items.length === originalLength) {
            throw new common_1.NotFoundException('Product not found in cart');
        }
        cart.lastActivityAt = new Date();
        await cart.save();
        return {
            message: 'Product removed from cart',
            cart: await this.populateCart(cart),
        };
    }
    async clearCart(userId, guestId) {
        const cart = await this.getOrCreateCart(userId, guestId);
        cart.items = [];
        cart.lastActivityAt = new Date();
        await cart.save();
        return {
            message: 'Cart cleared successfully',
            cart,
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CartService);
//# sourceMappingURL=cart.service.js.map