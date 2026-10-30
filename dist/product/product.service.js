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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const mongoose_1 = require("mongoose");
let ProductService = class ProductService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    generateSlug(name) {
        return name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
    async addProduct(params) {
        const { name, price, description, images, category, sku, stock = 0, compareAtPrice = null, isActive = true, isFeatured = false, } = params;
        if (!name?.trim() ||
            price === undefined ||
            price === null ||
            !description?.trim() ||
            !Array.isArray(images) ||
            images.length === 0 ||
            !category?.trim()) {
            throw new common_1.BadRequestException('Name, price, description, images and category are required');
        }
        if (!Number.isFinite(price) || price < 0) {
            throw new common_1.BadRequestException('Price must be a valid non-negative number');
        }
        if (!Number.isInteger(stock) || stock < 0) {
            throw new common_1.BadRequestException('Stock must be a non-negative integer');
        }
        if (compareAtPrice !== null &&
            (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)) {
            throw new common_1.BadRequestException('Compare-at price must be a valid non-negative number');
        }
        const validImages = images.map((image) => {
            if (typeof image !== 'string' || !image.trim()) {
                throw new common_1.BadRequestException('All images must be valid, non-empty URLs');
            }
            return image.trim();
        });
        const slug = this.generateSlug(name);
        if (!slug) {
            throw new common_1.BadRequestException('Unable to generate product slug');
        }
        try {
            return await this.databaseService.productModel.create({
                name: name.trim(),
                slug,
                sku: sku?.trim().toUpperCase() || `SKU-${Date.now()}`,
                price,
                description: description.trim(),
                images: validImages,
                category: category.trim().toLowerCase(),
                stock,
                compareAtPrice,
                isActive,
                isFeatured,
            });
        }
        catch (error) {
            if (error?.code === 11000) {
                throw new common_1.ConflictException('A product with this name, slug or SKU already exists');
            }
            throw error;
        }
    }
    async getAllProducts(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
        const skip = (page - 1) * limit;
        const filter = {
            isActive: true,
        };
        if (query.search?.trim()) {
            const escapedSearch = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.$or = [
                { name: { $regex: escapedSearch, $options: 'i' } },
                { description: { $regex: escapedSearch, $options: 'i' } },
            ];
        }
        if (query.category?.trim()) {
            filter.category = query.category.trim().toLowerCase();
        }
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            filter.price = {};
            if (query.minPrice !== undefined) {
                filter.price.$gte = Number(query.minPrice);
            }
            if (query.maxPrice !== undefined) {
                filter.price.$lte = Number(query.maxPrice);
            }
            if (Object.values(filter.price).some((value) => !Number.isFinite(value))) {
                throw new common_1.BadRequestException('Invalid price filter');
            }
            if (filter.price.$gte !== undefined &&
                filter.price.$lte !== undefined &&
                filter.price.$gte > filter.price.$lte) {
                throw new common_1.BadRequestException('minPrice cannot be greater than maxPrice');
            }
        }
        if (query.inStock === true) {
            filter.stock = { $gt: 0 };
        }
        const [products, total] = await Promise.all([
            this.databaseService.productModel
                .find(filter)
                .select('-__v')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            this.databaseService.productModel.countDocuments(filter),
        ]);
        return {
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getProductById(productId) {
        if (!mongoose_1.Types.ObjectId.isValid(productId)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const product = await this.databaseService.productModel
            .findOne({
            _id: productId,
            isActive: true,
        })
            .select('-__v')
            .lean()
            .exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async getProductBySlug(slug) {
        if (!slug?.trim()) {
            throw new common_1.BadRequestException('Product slug is required');
        }
        const product = await this.databaseService.productModel
            .findOne({
            slug: slug.trim().toLowerCase(),
            isActive: true,
        })
            .select('-__v')
            .lean()
            .exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async updateProduct(productId, updates) {
        if (!mongoose_1.Types.ObjectId.isValid(productId)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const allowedFields = [
            'name',
            'price',
            'description',
            'category',
            'images',
            'stock',
            'isFeatured',
            'compareAtPrice',
        ];
        const updateData = {};
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                updateData[field] = updates[field];
            }
        }
        if (Object.keys(updateData).length === 0) {
            throw new common_1.BadRequestException('No valid fields provided for update');
        }
        if (updateData.price !== undefined &&
            (!Number.isFinite(updateData.price) || updateData.price < 0)) {
            throw new common_1.BadRequestException('Invalid product price');
        }
        if (updateData.stock !== undefined &&
            (!Number.isInteger(updateData.stock) || updateData.stock < 0)) {
            throw new common_1.BadRequestException('Stock must be a non-negative integer');
        }
        if (updateData.name !== undefined) {
            if (!updateData.name.trim()) {
                throw new common_1.BadRequestException('Product name cannot be empty');
            }
            updateData.name = updateData.name.trim();
            updateData.slug = this.generateSlug(updateData.name);
        }
        if (updateData.category !== undefined) {
            updateData.category = updateData.category.trim().toLowerCase();
        }
        try {
            const product = await this.databaseService.productModel
                .findByIdAndUpdate(productId, updateData, {
                new: true,
                runValidators: true,
            })
                .select('-__v')
                .lean()
                .exec();
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
            return product;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            if (error?.code === 11000) {
                throw new common_1.ConflictException('Product slug or SKU already exists');
            }
            throw error;
        }
    }
    async deleteProduct(productId) {
        if (!mongoose_1.Types.ObjectId.isValid(productId)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const product = await this.databaseService.productModel
            .findByIdAndUpdate(productId, { isActive: false }, { new: true })
            .select('_id name isActive')
            .lean()
            .exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return {
            message: 'Product deactivated successfully',
            product,
        };
    }
    async getDashboardStats() {
        const [stats] = await this.databaseService.productModel.aggregate([
            {
                $match: {
                    isActive: true,
                },
            },
            {
                $group: {
                    _id: null,
                    totalProducts: {
                        $sum: 1,
                    },
                    inventoryUnits: {
                        $sum: '$stock',
                    },
                    featuredProducts: {
                        $sum: {
                            $cond: ['$isFeatured', 1, 0],
                        },
                    },
                    lowStock: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ['$stock', 1] },
                                        { $lte: ['$stock', 5] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalProducts: 1,
                    inventoryUnits: 1,
                    featuredProducts: 1,
                    lowStock: 1,
                },
            },
        ]);
        return {
            success: true,
            data: stats ?? {
                totalProducts: 0,
                inventoryUnits: 0,
                featuredProducts: 0,
                lowStock: 0,
            },
        };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ProductService);
//# sourceMappingURL=product.service.js.map