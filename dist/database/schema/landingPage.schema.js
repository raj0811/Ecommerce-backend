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
exports.LandingPageSchema = exports.LandingPage = exports.LandingPageSeoSchema = exports.LandingPageSeo = exports.LandingPageContentSchema = exports.LandingPageContent = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let LandingPageContent = class LandingPageContent {
    heading;
    tagline;
    description;
    subheading;
    ctaText;
    ctaLink;
    highlights;
    benefits;
    heroImage;
    bannerImage;
};
exports.LandingPageContent = LandingPageContent;
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 150 }),
    __metadata("design:type", String)
], LandingPageContent.prototype, "heading", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 200 }),
    __metadata("design:type", String)
], LandingPageContent.prototype, "tagline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 2000 }),
    __metadata("design:type", String)
], LandingPageContent.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 300 }),
    __metadata("design:type", String)
], LandingPageContent.prototype, "subheading", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 100 }),
    __metadata("design:type", String)
], LandingPageContent.prototype, "ctaText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 500 }),
    __metadata("design:type", String)
], LandingPageContent.prototype, "ctaLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], LandingPageContent.prototype, "highlights", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], LandingPageContent.prototype, "benefits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], LandingPageContent.prototype, "heroImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], LandingPageContent.prototype, "bannerImage", void 0);
exports.LandingPageContent = LandingPageContent = __decorate([
    (0, mongoose_1.Schema)({
        _id: false,
    })
], LandingPageContent);
exports.LandingPageContentSchema = mongoose_1.SchemaFactory.createForClass(LandingPageContent);
let LandingPageSeo = class LandingPageSeo {
    metaTitle;
    metaDescription;
    ogImage;
    keywords;
};
exports.LandingPageSeo = LandingPageSeo;
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 150 }),
    __metadata("design:type", String)
], LandingPageSeo.prototype, "metaTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, maxlength: 300 }),
    __metadata("design:type", String)
], LandingPageSeo.prototype, "metaDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], LandingPageSeo.prototype, "ogImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], LandingPageSeo.prototype, "keywords", void 0);
exports.LandingPageSeo = LandingPageSeo = __decorate([
    (0, mongoose_1.Schema)({
        _id: false,
    })
], LandingPageSeo);
exports.LandingPageSeoSchema = mongoose_1.SchemaFactory.createForClass(LandingPageSeo);
let LandingPage = class LandingPage {
    slug;
    title;
    productId;
    content;
    isPublished;
    isDeleted;
    sections;
    seo;
};
exports.LandingPage = LandingPage;
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        default: 'home',
    }),
    __metadata("design:type", String)
], LandingPage.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        maxlength: 150,
        default: 'Home',
    }),
    __metadata("design:type", String)
], LandingPage.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Product',
        default: null,
        index: true,
    }),
    __metadata("design:type", Object)
], LandingPage.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: exports.LandingPageContentSchema,
        default: () => ({}),
    }),
    __metadata("design:type", LandingPageContent)
], LandingPage.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: true,
    }),
    __metadata("design:type", Boolean)
], LandingPage.prototype, "isPublished", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
        index: true,
    }),
    __metadata("design:type", Boolean)
], LandingPage.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.Schema.Types.Mixed],
        default: [],
    }),
    __metadata("design:type", Array)
], LandingPage.prototype, "sections", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: exports.LandingPageSeoSchema,
        default: () => ({}),
    }),
    __metadata("design:type", LandingPageSeo)
], LandingPage.prototype, "seo", void 0);
exports.LandingPage = LandingPage = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'landing_pages',
    })
], LandingPage);
exports.LandingPageSchema = mongoose_1.SchemaFactory.createForClass(LandingPage);
exports.LandingPageSchema.index({
    isPublished: 1,
    isDeleted: 1,
    slug: 1,
});
exports.LandingPageSchema.index({
    productId: 1,
    isDeleted: 1,
});
//# sourceMappingURL=landingPage.schema.js.map