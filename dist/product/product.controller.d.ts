import { S3BucketService } from "../s3-bucket/s3-bucket.service";
import { ProductService } from './product.service';
export declare class ProductController {
    private readonly s3BucketService;
    private readonly productService;
    constructor(s3BucketService: S3BucketService, productService: ProductService);
    uploadProductImage(req: any, body: {
        base64: string;
        contentType?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            key: string;
            url: string;
        };
    }>;
    addProduct(body: {
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
    }): Promise<import("mongoose").Document<unknown, {}, import("../database/schema/product.schema").Product, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schema/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllProducts(page: number, limit: number, search?: string, category?: string, minPrice?: string, maxPrice?: string, inStock?: boolean): Promise<{
        products: (import("../database/schema/product.schema").Product & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getDashboardStats(): Promise<{
        success: boolean;
        data: any;
    }>;
    updateProduct(productId: string, updates: Record<string, any>): Promise<import("../database/schema/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteProduct(productId: string): Promise<{
        message: string;
        product: import("../database/schema/product.schema").Product & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    getProductById(productId: string): Promise<import("../database/schema/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getProductBySlug(productId: string): Promise<import("../database/schema/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
