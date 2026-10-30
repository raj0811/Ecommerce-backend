import { LandingPageService } from './landin-page.service';
export declare class LandingPageController {
    private readonly landingPageService;
    constructor(landingPageService: LandingPageService);
    getPublishedLandingPage(slug: string): Promise<import("../database/schema/landingPage.schema").LandingPage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createLandingPage(body: {
        title?: string;
        slug?: string;
        productId: string;
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
    }): Promise<import("mongoose").Document<unknown, {}, import("../database/schema/landingPage.schema").LandingPage, {}, import("mongoose").DefaultSchemaOptions> & import("../database/schema/landingPage.schema").LandingPage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllLandingPages(): Promise<{
        success: boolean;
        data: (import("../database/schema/landingPage.schema").LandingPage & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
    }>;
    getLandingPageById(id: string): Promise<{
        success: boolean;
        data: import("../database/schema/landingPage.schema").LandingPage & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    updateLandingPage(id: string, body: {
        title?: string;
        slug?: string;
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
    }): Promise<{
        success: boolean;
        message: string;
        data: import("../database/schema/landingPage.schema").LandingPage & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    deleteLandingPage(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("../database/schema/landingPage.schema").LandingPage & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
}
