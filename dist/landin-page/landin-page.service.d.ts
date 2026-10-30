import { Types } from 'mongoose';
import { DatabaseService } from "../database/database.service";
interface LandingPageParams {
    slug?: string;
    title?: string;
    productId?: string;
    isPublished?: boolean;
    sections?: Record<string, any>[];
    content?: {
        heading?: string;
        tagline?: string;
        description?: string;
        subheading?: string;
        ctaText?: string;
        ctaLink?: string;
        highlights?: string[];
        benefits?: string[];
        heroImage?: string;
        bannerImage?: string;
    };
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        ogImage?: string;
        keywords?: string[];
    };
}
export declare class LandingPageService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    private generateSlug;
    createLandingPage(params: LandingPageParams): Promise<import("mongoose").Document<unknown, {}, import("../database/schema/landingPage.schema").LandingPage, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schema/landingPage.schema").LandingPage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getPublishedLandingPageBySlug(slug: string): Promise<import("../database/schema/landingPage.schema").LandingPage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllLandingPages(): Promise<{
        success: boolean;
        data: (import("../database/schema/landingPage.schema").LandingPage & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
    }>;
    getLandingPageById(id: string): Promise<{
        success: boolean;
        data: import("../database/schema/landingPage.schema").LandingPage & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    updateLandingPage(id: string, params: LandingPageParams): Promise<{
        success: boolean;
        message: string;
        data: import("../database/schema/landingPage.schema").LandingPage & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    softDeleteLandingPage(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("../database/schema/landingPage.schema").LandingPage & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
}
export {};
