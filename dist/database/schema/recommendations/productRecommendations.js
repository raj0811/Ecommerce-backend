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
exports.ProductRecommendationSchema = exports.ProductRecommendation = exports.RecommendedProduct = exports.RecommendationType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var RecommendationType;
(function (RecommendationType) {
    RecommendationType["FREQUENTLY_BOUGHT_TOGETHER"] = "FREQUENTLY_BOUGHT_TOGETHER";
    RecommendationType["CUSTOMERS_ALSO_VIEWED"] = "CUSTOMERS_ALSO_VIEWED";
    RecommendationType["SIMILAR_PRODUCTS"] = "SIMILAR_PRODUCTS";
    RecommendationType["ALSO_BOUGHT"] = "ALSO_BOUGHT";
})(RecommendationType || (exports.RecommendationType = RecommendationType = {}));
let RecommendedProduct = class RecommendedProduct {
    productId;
    score;
    purchaseCount;
    confidence;
    lift;
};
exports.RecommendedProduct = RecommendedProduct;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Product',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RecommendedProduct.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        min: 0,
    }),
    __metadata("design:type", Number)
], RecommendedProduct.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], RecommendedProduct.prototype, "purchaseCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], RecommendedProduct.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], RecommendedProduct.prototype, "lift", void 0);
exports.RecommendedProduct = RecommendedProduct = __decorate([
    (0, mongoose_1.Schema)({
        _id: false,
    })
], RecommendedProduct);
let ProductRecommendation = class ProductRecommendation {
    productId;
    type;
    recommendations;
    sourceCount;
    algorithmVersion;
    generatedAt;
};
exports.ProductRecommendation = ProductRecommendation;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Product',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductRecommendation.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: RecommendationType,
        required: true,
    }),
    __metadata("design:type", String)
], ProductRecommendation.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [RecommendedProduct],
        default: [],
    }),
    __metadata("design:type", Array)
], ProductRecommendation.prototype, "recommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], ProductRecommendation.prototype, "sourceCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 1,
    }),
    __metadata("design:type", Number)
], ProductRecommendation.prototype, "algorithmVersion", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: Date.now,
    }),
    __metadata("design:type", Date)
], ProductRecommendation.prototype, "generatedAt", void 0);
exports.ProductRecommendation = ProductRecommendation = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        versionKey: false,
        collection: 'product_recommendations',
    })
], ProductRecommendation);
exports.ProductRecommendationSchema = mongoose_1.SchemaFactory.createForClass(ProductRecommendation);
exports.ProductRecommendationSchema.index({
    productId: 1,
    type: 1,
}, {
    unique: true,
});
exports.ProductRecommendationSchema.index({
    productId: 1,
    type: 1,
    'recommendations.score': -1,
});
//# sourceMappingURL=productRecommendations.js.map