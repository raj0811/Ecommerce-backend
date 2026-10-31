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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const admin_AuthGuard_1 = require("../Guards/admin.AuthGuard");
const s3_bucket_service_1 = require("../s3-bucket/s3-bucket.service");
const product_service_1 = require("./product.service");
const admin_schema_1 = require("../database/schema/admin.schema");
let ProductController = class ProductController {
    s3BucketService;
    productService;
    constructor(s3BucketService, productService) {
        this.s3BucketService = s3BucketService;
        this.productService = productService;
    }
    async uploadProductImage(req, body) {
        try {
            if (!body?.base64) {
                throw new common_1.BadRequestException('Base64 image is required');
            }
            let contentType = body.contentType;
            let base64Data = body.base64;
            const dataUrlMatch = body.base64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
            if (dataUrlMatch) {
                contentType = dataUrlMatch[1];
                base64Data = dataUrlMatch[2];
            }
            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/webp',
            ];
            if (!contentType || !allowedTypes.includes(contentType)) {
                throw new common_1.BadRequestException('Only JPG, PNG and WebP images are allowed');
            }
            const normalizedBase64 = base64Data.replace(/\s/g, '');
            if (!normalizedBase64 ||
                normalizedBase64.length % 4 === 1 ||
                !/^[A-Za-z0-9+/]*={0,2}$/.test(normalizedBase64)) {
                throw new common_1.BadRequestException('Invalid Base64 image');
            }
            const fileBuffer = Buffer.from(normalizedBase64, 'base64');
            if (fileBuffer.length === 0) {
                throw new common_1.BadRequestException('Image is empty');
            }
            const maxSize = 5 * 1024 * 1024;
            if (fileBuffer.length > maxSize) {
                throw new common_1.BadRequestException('Image size cannot exceed 5 MB');
            }
            const validSignature = (contentType === 'image/jpeg' &&
                fileBuffer[0] === 0xff &&
                fileBuffer[1] === 0xd8 &&
                fileBuffer[2] === 0xff) ||
                (contentType === 'image/png' &&
                    fileBuffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
                (contentType === 'image/webp' &&
                    fileBuffer.toString('ascii', 0, 4) === 'RIFF' &&
                    fileBuffer.toString('ascii', 8, 12) === 'WEBP');
            if (!validSignature) {
                throw new common_1.BadRequestException('Image content does not match its file type');
            }
            const bucketName = process.env.AWS_S3_BUCKET_NAME;
            if (!bucketName) {
                throw new common_1.InternalServerErrorException('S3 bucket is not configured');
            }
            const extensionByType = {
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'image/webp': 'webp',
            };
            const key = `products/${req.user.id}/${(0, crypto_1.randomUUID)()}.` +
                extensionByType[contentType];
            const url = await this.s3BucketService.uploadToS3(fileBuffer, key, contentType, bucketName);
            return {
                success: true,
                message: 'Product image uploaded successfully',
                data: {
                    key,
                    url,
                },
            };
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async addProduct(body, req) {
        const allowedRoles = [
            admin_schema_1.AdminRole.SUPER_ADMIN,
            admin_schema_1.AdminRole.ADMIN,
            admin_schema_1.AdminRole.OPERATIONS,
        ];
        if (!allowedRoles.includes(req.user?.role)) {
            throw new common_1.ForbiddenException('You do not have permission to add products');
        }
        return this.productService.addProduct({
            name: body.name,
            price: Number(body.price),
            description: body.description,
            images: body.images,
            category: body.category,
            sku: body.sku,
            stock: body.stock === undefined ? 0 : Number(body.stock),
            compareAtPrice: body.compareAtPrice === undefined ||
                body.compareAtPrice === null
                ? null
                : Number(body.compareAtPrice),
            isActive: body.isActive,
            isFeatured: body.isFeatured,
        });
    }
    async getAllProductsAdmins(req, page, limit, search, category, minPrice, maxPrice, inStock) {
        const allowedRoles = [
            admin_schema_1.AdminRole.SUPER_ADMIN,
            admin_schema_1.AdminRole.ADMIN,
            admin_schema_1.AdminRole.OPERATIONS,
            admin_schema_1.AdminRole.SALES_SUPPORT
        ];
        if (!allowedRoles.includes(req.user?.role)) {
            throw new common_1.ForbiddenException('You do not have permission to add products');
        }
        return this.productService.getAllProducts({
            page,
            limit,
            search,
            category,
            minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
            maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
            inStock,
        });
    }
    async getAllProducts(page, limit, search, category, minPrice, maxPrice, inStock) {
        return this.productService.getAllProducts({
            page,
            limit,
            search,
            category,
            minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
            maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
            inStock,
        });
    }
    async getDashboardStats() {
        return this.productService.getDashboardStats();
    }
    async updateProduct(productId, updates, req) {
        const allowedRoles = [
            admin_schema_1.AdminRole.SUPER_ADMIN,
            admin_schema_1.AdminRole.ADMIN,
            admin_schema_1.AdminRole.OPERATIONS,
        ];
        if (!allowedRoles.includes(req.user?.role)) {
            throw new common_1.ForbiddenException('You do not have permission to add products');
        }
        return this.productService.updateProduct(productId, updates);
    }
    async deleteProduct(req, productId) {
        const allowedRoles = [
            admin_schema_1.AdminRole.SUPER_ADMIN,
            admin_schema_1.AdminRole.ADMIN,
            admin_schema_1.AdminRole.OPERATIONS,
        ];
        if (!allowedRoles.includes(req.user?.role)) {
            throw new common_1.ForbiddenException('You do not have permission to add products');
        }
        return this.productService.deleteProduct(productId);
    }
    async getProductById(productId) {
        return await this.productService.getProductById(productId);
    }
    async getProductBySlug(productId) {
        return await this.productService.getProductById(productId);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)('product-image'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "uploadProductImage", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "addProduct", null);
__decorate([
    (0, common_1.Get)('admin/fetch-all-product'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(12), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('category')),
    __param(5, (0, common_1.Query)('minPrice')),
    __param(6, (0, common_1.Query)('maxPrice')),
    __param(7, (0, common_1.Query)('inStock', new common_1.DefaultValuePipe(false), common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProductsAdmins", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(12), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('minPrice')),
    __param(5, (0, common_1.Query)('maxPrice')),
    __param(6, (0, common_1.Query)('inStock', new common_1.DefaultValuePipe(false), common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Get)('/info/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Get)('/gget/:slug'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductBySlug", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('product'),
    __metadata("design:paramtypes", [s3_bucket_service_1.S3BucketService,
        product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map