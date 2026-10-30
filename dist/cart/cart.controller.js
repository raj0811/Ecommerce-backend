"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
const cart_service_1 = require("./cart.service");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getIdentity(request, guestId) {
        const authorization = request.headers.authorization;
        if (authorization) {
            const [scheme, token] = authorization.split(' ');
            if (scheme !== 'Bearer' || !token) {
                throw new common_1.UnauthorizedException('Invalid authorization header');
            }
            try {
                const payload = await jwt.verify(token, process.env.JWT_SECRET);
                const userId = payload.id ?? payload._id ?? payload.sub;
                console.log(userId);
                if (!userId) {
                    throw new common_1.UnauthorizedException('User ID missing from access token');
                }
                return { userId };
            }
            catch (error) {
                console.log(error);
                if (error instanceof common_1.UnauthorizedException) {
                    throw error;
                }
                throw new common_1.UnauthorizedException('Invalid or expired access token');
            }
        }
        console.log('no auth');
        if (!guestId?.trim()) {
            throw new common_1.BadRequestException('x-guest-id header is required for guest carts');
        }
        return { guestId: guestId.trim() };
    }
    async getCart(request, guestId) {
        const identity = await this.getIdentity(request, guestId);
        return this.cartService.getCart(identity.userId, identity.guestId);
    }
    async addItem(body, request, guestId) {
        if (!body.productId?.trim()) {
            throw new common_1.BadRequestException('productId is required');
        }
        const quantity = body.quantity ?? 1;
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new common_1.BadRequestException('quantity must be a positive integer');
        }
        const identity = await this.getIdentity(request, guestId);
        return this.cartService.addItem(body.productId, quantity, identity.userId, identity.guestId);
    }
    async updateItemQuantity(productId, body, request, guestId) {
        if (!Number.isInteger(body.quantity) || body.quantity < 1) {
            throw new common_1.BadRequestException('quantity must be a positive integer');
        }
        const identity = await this.getIdentity(request, guestId);
        return this.cartService.updateItemQuantity(productId, body.quantity, identity.userId, identity.guestId);
    }
    async removeItem(productId, request, guestId) {
        const identity = await this.getIdentity(request, guestId);
        return this.cartService.removeItem(productId, identity.userId, identity.guestId);
    }
    async clearCart(request, guestId) {
        const identity = await this.getIdentity(request, guestId);
        return this.cartService.clearCart(identity.userId, identity.guestId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-guest-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('items'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Headers)('x-guest-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)('items/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Headers)('x-guest-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateItemQuantity", null);
__decorate([
    (0, common_1.Delete)('items/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Headers)('x-guest-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-guest-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map