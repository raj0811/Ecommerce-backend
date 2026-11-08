
import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Types } from 'mongoose';
import { RecommendationType } from 'src/database/schema/recommendations/productRecommendations';

type ProductSortBy =
    | 'newest'
    | 'oldest'
    | 'price_asc'
    | 'price_desc'
    | 'name_asc'
    | 'name_desc';

type StockFilter = 'in_stock' | 'out_of_stock';

interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    stockStatus?: StockFilter;
    isActive?: boolean;
    isFeatured?: boolean;
    sortBy?: ProductSortBy;
}


@Injectable()
export class ProductService {
    private readonly MAX_RECOMMENDATIONS = 20;
    private readonly COMPLETED_ORDER_STATUSES = [
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
    ];
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    // Generate URL-friendly slug
    private generateSlug(name: string): string {
        return name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Create product

    async addProduct(params: {
        name: string;
        price: number;
        description: string;
        images: string[];
        category: string;
        sku?: string;
        stock?: number;
        compareAtPrice?: number | null;
        isActive?: boolean;
        isFeatured?: boolean;
    }) {
        const {
            name,
            price,
            description,
            images,
            category,
            sku,
            stock = 0,
            compareAtPrice = null,
            isActive = true,
            isFeatured = false,
        } = params;

        if (
            !name?.trim() ||
            price === undefined ||
            price === null ||
            !description?.trim() ||
            !Array.isArray(images) ||
            images.length === 0 ||
            !category?.trim()
        ) {
            throw new BadRequestException(
                'Name, price, description, images and category are required',
            );
        }

        if (!Number.isFinite(price) || price < 0) {
            throw new BadRequestException(
                'Price must be a valid non-negative number',
            );
        }

        if (!Number.isInteger(stock) || stock < 0) {
            throw new BadRequestException(
                'Stock must be a non-negative integer',
            );
        }

        if (
            compareAtPrice !== null &&
            (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)
        ) {
            throw new BadRequestException(
                'Compare-at price must be a valid non-negative number',
            );
        }

        const validImages = images.map((image) => {
            if (typeof image !== 'string' || !image.trim()) {
                throw new BadRequestException(
                    'All images must be valid, non-empty URLs',
                );
            }

            return image.trim();
        });

        const slug = this.generateSlug(name);

        if (!slug) {
            throw new BadRequestException('Unable to generate product slug');
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
        } catch (error) {
            if (error?.code === 11000) {
                throw new ConflictException(
                    'A product with this name, slug or SKU already exists',
                );
            }

            throw error;
        }
    }


    async getAllProducts(query: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
    }) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
        const skip = (page - 1) * limit;

        const filter: Record<string, any> = {
            isActive: true,
        };

        if (query.search?.trim()) {
            const escapedSearch = query.search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&',
            );

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

            if (
                Object.values(filter.price).some((value) => !Number.isFinite(value))
            ) {
                throw new BadRequestException('Invalid price filter');
            }

            if (
                filter.price.$gte !== undefined &&
                filter.price.$lte !== undefined &&
                filter.price.$gte > filter.price.$lte
            ) {
                throw new BadRequestException(
                    'minPrice cannot be greater than maxPrice',
                );
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

    // Get product by ID
    async getProductById(productId: string) {
        if (!Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid product ID');
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
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    // Get product by slug
    async getProductBySlug(slug: string) {
        if (!slug?.trim()) {
            throw new BadRequestException('Product slug is required');
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
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    // Update product
    async updateProduct(productId: string, updates: Record<string, any>) {
        if (!Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid product ID');
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

        const updateData: Record<string, any> = {};

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                updateData[field] = updates[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestException('No valid fields provided for update');
        }

        if (
            updateData.price !== undefined &&
            (!Number.isFinite(updateData.price) || updateData.price < 0)
        ) {
            throw new BadRequestException('Invalid product price');
        }

        if (
            updateData.stock !== undefined &&
            (!Number.isInteger(updateData.stock) || updateData.stock < 0)
        ) {
            throw new BadRequestException(
                'Stock must be a non-negative integer',
            );
        }

        if (updateData.name !== undefined) {
            if (!updateData.name.trim()) {
                throw new BadRequestException('Product name cannot be empty');
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
                throw new NotFoundException('Product not found');
            }

            return product;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            if (error?.code === 11000) {
                throw new ConflictException('Product slug or SKU already exists');
            }

            throw error;
        }
    }

    // Soft delete product
    async deleteProduct(productId: string) {
        if (!Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid product ID');
        }

        const product = await this.databaseService.productModel
            .findByIdAndUpdate(
                productId,
                { isActive: false },
                { new: true },
            )
            .select('_id name isActive')
            .lean()
            .exec();

        if (!product) {
            throw new NotFoundException('Product not found');
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

    async getHeroProducts() {


        const products = await Promise.all([
            this.databaseService.productModel
                .find({
                    isFeatured: true
                })
                .select('-__v')
                .sort({ createdAt: -1 })
                .lean()
                .exec()
        ]);

        return {
            products,
        };
    }

    async updateRecommendations(params: {
        orderId: string;
        productIds: string[];
        recommendationType?: RecommendationType;
    }) {
        const {
            orderId,
            productIds,
            recommendationType,
        } = params;
        const type: RecommendationType =
            recommendationType ??
            RecommendationType.FREQUENTLY_BOUGHT_TOGETHER;
        // 1. Validate order ID
        if (!Types.ObjectId.isValid(orderId)) {
            throw new BadRequestException('Invalid order ID');
        }

        // 2. Remove duplicate product IDs
        const uniqueProductIds = [
            ...new Set(productIds),
        ];

        if (uniqueProductIds.length < 2) {
            return {
                success: true,
                message: 'At least two unique products are required',
                processed: false,
            };
        }

        // 3. Validate product IDs
        if (
            uniqueProductIds.some(
                (id) => !Types.ObjectId.isValid(id),
            )
        ) {
            throw new BadRequestException('Invalid product ID');
        }

        const objectIds = uniqueProductIds.map(
            (id) => new Types.ObjectId(id),
        );

        const session = await this.databaseService.connection.startSession();

        try {
            let result: any;

            await session.withTransaction(async () => {

                // 4. Register order processing.
                // Unique index prevents duplicate processing.
                await this.databaseService.processedOrderModel.create(
                    [
                        {
                            orderId: new Types.ObjectId(orderId),
                            recommendationType,
                        },
                    ],
                    { session },
                );

                // 5. Generate directed product relationships.
                for (const sourceProductId of objectIds) {

                    const recommendedProducts = objectIds.filter(
                        (id) => !id.equals(sourceProductId),
                    );

                    // 6. Create source document if it doesn't exist.
                    // Increment sourceCount exactly once per order.
                    await this.databaseService.recommendedProductModel.updateOne(
                        {
                            productId: sourceProductId,
                            type: recommendationType,
                        },
                        {
                            $inc: {
                                sourceCount: 1,
                            },
                            $set: {
                                generatedAt: new Date(),
                            },
                            $setOnInsert: {
                                algorithmVersion: 1,
                            },
                        },
                        {
                            upsert: true,
                            session,
                        },
                    );

                    // 7. Update each product relationship.
                    for (const recommendedProductId of recommendedProducts) {

                        // Check whether the relationship already exists.
                        const existing =
                            await this.databaseService.recommendedProductModel.findOne(
                                {
                                    productId: sourceProductId,
                                    type: recommendationType,
                                    'recommendations.productId':
                                        recommendedProductId,
                                },
                                {
                                    _id: 1,
                                },
                                { session },
                            );

                        if (existing) {

                            // Existing pair: increment its count.
                            await this.databaseService.recommendedProductModel.updateOne(
                                {
                                    productId: sourceProductId,
                                    type: recommendationType,
                                    'recommendations.productId':
                                        recommendedProductId,
                                },
                                {
                                    $inc: {
                                        'recommendations.$.purchaseCount': 1,
                                        'recommendations.$.score': 1,
                                    },
                                },
                                { session },
                            );

                        } else {

                            // New pair: insert it.
                            await this.databaseService.recommendedProductModel.updateOne(
                                {
                                    productId: sourceProductId,
                                    type: recommendationType,
                                    'recommendations.productId': {
                                        $ne: recommendedProductId,
                                    },
                                },
                                {
                                    $push: {
                                        recommendations: {
                                            productId: recommendedProductId,
                                            purchaseCount: 1,
                                            score: 1,
                                            confidence: 0,
                                            lift: 0,
                                        },
                                    },
                                },
                                { session },
                            );
                        }
                    }
                }

                result = {
                    success: true,
                    message: 'Recommendations updated successfully',
                    orderId,
                    processedProducts: objectIds.length,
                    recommendationType,
                };
            });

            return result;

        } catch (error) {

            // A previously processed order is not an error.
            if (error?.code === 11000) {
                return {
                    success: true,
                    processed: false,
                    message: 'Order already processed',
                    orderId,
                };
            }


            throw error;

        } finally {
            await session.endSession();
        }
    }


    async getFrequentlyBoughtTogether(productId: string) {
        if (!Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid product ID');
        }

        const currentProductId = new Types.ObjectId(productId);

        // Fetch precomputed recommendations
        const recommendation =
            await this.databaseService.recommendedProductModel
                .findOne({
                    productId: currentProductId,
                    type: RecommendationType.FREQUENTLY_BOUGHT_TOGETHER,
                })
                .populate({
                    path: 'recommendations.productId',
                    model: 'Product',
                    select: 'name title slug price salePrice sellingPrice images image stock isActive',
                })
                .lean()
                .exec();

        if (!recommendation) {
            return {
                productId,
                type: 'FREQUENTLY_BOUGHT_TOGETHER',
                products: [],
                sourceCount: 0,
            };
        }

        // Remove invalid, inactive and unavailable products
        const products = (recommendation.recommendations || [])
            .filter((item) => {
                const product = item.productId as any;

                return (
                    product &&
                    product._id &&
                    product.isActive !== false &&
                    (product.stock == null || product.stock > 0)
                );
            })
            .sort((a, b) => b.score - a.score)
            .map((item) => ({
                product: item.productId,
                score: item.score,
                purchaseCount: item.purchaseCount,
                confidence: item.confidence,
                lift: item.lift,
            }));

        return {
            productId,
            type: recommendation.type,
            algorithmVersion: recommendation.algorithmVersion,
            sourceCount: recommendation.sourceCount,
            generatedAt: recommendation.generatedAt,
            products,
        };
    }

}
