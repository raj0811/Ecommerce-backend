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
exports.ProductEventSchema = exports.ProductEvent = exports.ProductEventSource = exports.ProductEventType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ProductEventType;
(function (ProductEventType) {
    ProductEventType["PRODUCT_VIEWED"] = "PRODUCT_VIEWED";
    ProductEventType["PRODUCT_CLICKED"] = "PRODUCT_CLICKED";
    ProductEventType["ADDED_TO_CART"] = "ADDED_TO_CART";
    ProductEventType["REMOVED_FROM_CART"] = "REMOVED_FROM_CART";
    ProductEventType["PURCHASED"] = "PURCHASED";
})(ProductEventType || (exports.ProductEventType = ProductEventType = {}));
var ProductEventSource;
(function (ProductEventSource) {
    ProductEventSource["PRODUCT_PAGE"] = "PRODUCT_PAGE";
    ProductEventSource["CART_PAGE"] = "CART_PAGE";
    ProductEventSource["HOME_PAGE"] = "HOME_PAGE";
    ProductEventSource["CHECKOUT"] = "CHECKOUT";
    ProductEventSource["RECOMMENDATION"] = "RECOMMENDATION";
    ProductEventSource["OTHER"] = "OTHER";
})(ProductEventSource || (exports.ProductEventSource = ProductEventSource = {}));
let ProductEvent = class ProductEvent {
    eventId;
    productId;
    userId;
    sessionId;
    eventType;
    source;
    orderId;
    quantity;
    price;
    recommendedFromProductId;
    metadata;
};
exports.ProductEvent = ProductEvent;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], ProductEvent.prototype, "eventId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductEvent.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        default: null,
    }),
    __metadata("design:type", Object)
], ProductEvent.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
        index: true,
    }),
    __metadata("design:type", Object)
], ProductEvent.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ProductEventType,
        required: true,
    }),
    __metadata("design:type", String)
], ProductEvent.prototype, "eventType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ProductEventSource,
        default: ProductEventSource.OTHER,
    }),
    __metadata("design:type", String)
], ProductEvent.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Order',
        default: null,
    }),
    __metadata("design:type", Object)
], ProductEvent.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 1,
        min: 1,
    }),
    __metadata("design:type", Number)
], ProductEvent.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: null,
        min: 0,
    }),
    __metadata("design:type", Object)
], ProductEvent.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Product',
        default: null,
    }),
    __metadata("design:type", Object)
], ProductEvent.prototype, "recommendedFromProductId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {},
    }),
    __metadata("design:type", Object)
], ProductEvent.prototype, "metadata", void 0);
exports.ProductEvent = ProductEvent = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        versionKey: false,
        collection: 'product_events',
    })
], ProductEvent);
exports.ProductEventSchema = mongoose_1.SchemaFactory.createForClass(ProductEvent);
exports.ProductEventSchema.index({
    productId: 1,
    eventType: 1,
    createdAt: -1,
});
exports.ProductEventSchema.index({
    userId: 1,
    createdAt: -1,
});
exports.ProductEventSchema.index({
    sessionId: 1,
    createdAt: -1,
});
exports.ProductEventSchema.index({
    orderId: 1,
    eventType: 1,
});
//# sourceMappingURL=productEvent.js.map