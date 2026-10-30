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
exports.CartSchema = exports.Cart = exports.CartCustomerSchema = exports.CartCustomer = exports.CartItemSchema = exports.CartItem = exports.CartStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var CartStatus;
(function (CartStatus) {
    CartStatus["ACTIVE"] = "active";
    CartStatus["CONVERTED"] = "converted";
    CartStatus["ABANDONED"] = "abandoned";
})(CartStatus || (exports.CartStatus = CartStatus = {}));
let CartItem = class CartItem {
    productId;
    quantity;
    price;
};
exports.CartItem = CartItem;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Product',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CartItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        min: 1,
        default: 1,
    }),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], CartItem.prototype, "price", void 0);
exports.CartItem = CartItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CartItem);
exports.CartItemSchema = mongoose_1.SchemaFactory.createForClass(CartItem);
let CartCustomer = class CartCustomer {
    name;
    email;
    phone;
};
exports.CartCustomer = CartCustomer;
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, default: null }),
    __metadata("design:type", Object)
], CartCustomer.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, lowercase: true, default: null }),
    __metadata("design:type", Object)
], CartCustomer.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, default: null }),
    __metadata("design:type", Object)
], CartCustomer.prototype, "phone", void 0);
exports.CartCustomer = CartCustomer = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CartCustomer);
exports.CartCustomerSchema = mongoose_1.SchemaFactory.createForClass(CartCustomer);
let Cart = class Cart {
    userId;
    guestId;
    customer;
    items;
    status;
    lastActivityAt;
};
exports.Cart = Cart;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        default: null,
    }),
    __metadata("design:type", Object)
], Cart.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
    }),
    __metadata("design:type", Object)
], Cart.prototype, "guestId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: exports.CartCustomerSchema,
        default: () => ({}),
    }),
    __metadata("design:type", CartCustomer)
], Cart.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [exports.CartItemSchema],
        default: [],
    }),
    __metadata("design:type", Array)
], Cart.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: CartStatus,
        default: CartStatus.ACTIVE,
        index: true,
    }),
    __metadata("design:type", String)
], Cart.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: Date.now,
        index: true,
    }),
    __metadata("design:type", Date)
], Cart.prototype, "lastActivityAt", void 0);
exports.Cart = Cart = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'carts',
    })
], Cart);
exports.CartSchema = mongoose_1.SchemaFactory.createForClass(Cart);
exports.CartSchema.pre('validate', function () {
    if (!this.userId && !this.guestId) {
        this.invalidate('guestId', 'Either userId or guestId must be provided');
    }
});
exports.CartSchema.index({ userId: 1 }, {
    unique: true,
    partialFilterExpression: {
        userId: { $type: 'objectId' },
        status: CartStatus.ACTIVE,
    },
});
exports.CartSchema.index({ guestId: 1 }, {
    unique: true,
    partialFilterExpression: {
        guestId: { $type: 'string' },
        status: CartStatus.ACTIVE,
    },
});
//# sourceMappingURL=cart.schema.js.map