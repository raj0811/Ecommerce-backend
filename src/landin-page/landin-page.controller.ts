
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';
import { LandingPageService } from './landin-page.service';

@Controller('landing-page')
export class LandingPageController {
    constructor(
        private readonly landingPageService: LandingPageService,
    ) { }

    // Public: fetch published homepage content.
    // @Get('public')
    // async getHomepage() {
    //     return this.landingPageService.getPublishedLandingPage('home');
    // }

    // Public: fetch a published page by slug.
    @Get('public/:slug')
    async getPublishedLandingPage(@Param('slug') slug: string) {
        return this.landingPageService.getPublishedLandingPageBySlug(slug);
    }

    // Admin: create a landing page.
    @Post('admin')
    @UseGuards(AdminAuthGuard)
    async createLandingPage(
        @Body()
        body: {
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
        },
    ) {
        return this.landingPageService.createLandingPage(body);
    }

    // Admin: list all non-deleted pages.
    @Get('admin')
    @UseGuards(AdminAuthGuard)
    async getAllLandingPages() {
        return this.landingPageService.getAllLandingPages();
    }

    // Admin: get a page by ID.
    @Get('admin/:id')
    @UseGuards(AdminAuthGuard)
    async getLandingPageById(@Param('id') id: string) {
        return this.landingPageService.getLandingPageById(id);
    }

    // Admin: update page details or sections.
    @Patch('admin/:id')
    @UseGuards(AdminAuthGuard)
    async updateLandingPage(
        @Param('id') id: string,
        @Body()
        body: {
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
        },
    ) {
        return this.landingPageService.updateLandingPage(id, body);
    }

    // Admin: soft-delete a page.
    @Delete('admin/:id')
    @UseGuards(AdminAuthGuard)
    async deleteLandingPage(@Param('id') id: string) {
        return this.landingPageService.softDeleteLandingPage(id);
    }
}
