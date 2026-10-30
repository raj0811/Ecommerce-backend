import { DatabaseService } from "../database/database.service";
import { Types } from 'mongoose';
export declare class ProductService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    private generateSlug;
    addProduct(params: {
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
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllProducts(query: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
    }): Promise<{
        products: (import("../database/schema/product.schema").Product & {
            _id: Types.ObjectId;
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
    getProductById(productId: string): Promise<import("../database/schema/product.schema").Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getProductBySlug(slug: string): Promise<import("../database/schema/product.schema").Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateProduct(productId: string, updates: Record<string, any>): Promise<import("../database/schema/product.schema").Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteProduct(productId: string): Promise<{
        message: string;
        product: import("../database/schema/product.schema").Product & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    getDashboardStats(): Promise<{
        success: boolean;
        data: any;
    }>;
}
