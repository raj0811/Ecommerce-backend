
import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseService } from 'src/database/database.service';


interface LandingPageParams {
    slug?: string;
    title?: string;
    isPublished?: boolean;
    sections?: Record<string, any>[];
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        ogImage?: string;
    };
}

@Injectable()
export class LandingPageService {
    constructor(
        private readonly databaseService: DatabaseService
    ) { }

    private generateSlug(value: string): string {
        return value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    async createLandingPage(params: LandingPageParams) {
        const {
            title,
            slug,
            isPublished = false,
            sections = [],
            seo = {},
        } = params;

        if (!title?.trim()) {
            throw new BadRequestException('Page title is required');
        }

        if (!Array.isArray(sections)) {
            throw new BadRequestException(
                'Sections must be an array',
            );
        }

        const pageSlug = this.generateSlug(slug || title);

        if (!pageSlug) {
            throw new BadRequestException('Invalid landing page slug');
        }

        const existing = await this.databaseService.landingPageModel.findOne({
            slug: pageSlug,
        }).exec();

        if (existing) {
            throw new ConflictException(
                'A landing page with this slug already exists',
            );
        }

        return this.databaseService.landingPageModel.create({
            title: title.trim(),
            slug: pageSlug,
            isPublished,
            isDeleted: false,
            sections,
            seo,
        });
    }

    // Public storefront: only published, non-deleted pages.
    async getPublishedLandingPage(slug = 'home') {
        const page = await this.databaseService.landingPageModel
            .findOne({
                slug: this.generateSlug(slug),
                isPublished: true,
                isDeleted: false,
            })
            .select('-__v -isDeleted')
            .lean()
            .exec();

        if (!page) {
            throw new NotFoundException(
                'Published landing page not found',
            );
        }

        return {
            success: true,
            data: page,
        };
    }

    // Admin: list all non-deleted landing pages.
    async getAllLandingPages() {
        const pages = await this.databaseService.landingPageModel
            .find({ isDeleted: false })
            .select('-__v')
            .sort({ updatedAt: -1 })
            .lean()
            .exec();

        return {
            success: true,
            data: pages,
            total: pages.length,
        };
    }

    // Admin: get a page by MongoDB ID.
    async getLandingPageById(id: string) {
        if (!/^[a-f\d]{24}$/i.test(id)) {
            throw new BadRequestException(
                'Invalid landing page ID',
            );
        }

        const page = await this.databaseService.landingPageModel
            .findOne({
                _id: id,
                isDeleted: false,
            })
            .select('-__v')
            .lean()
            .exec();

        if (!page) {
            throw new NotFoundException('Landing page not found');
        }

        return {
            success: true,
            data: page,
        };
    }

    async updateLandingPage(
        id: string,
        params: LandingPageParams,
    ) {
        if (!/^[a-f\d]{24}$/i.test(id)) {
            throw new BadRequestException(
                'Invalid landing page ID',
            );
        }

        const existing = await this.databaseService.landingPageModel.findOne({
            _id: id,
            isDeleted: false,
        }).exec();

        if (!existing) {
            throw new NotFoundException('Landing page not found');
        }

        const update: Record<string, any> = {};

        if (params.title !== undefined) {
            if (!params.title.trim()) {
                throw new BadRequestException(
                    'Page title cannot be empty',
                );
            }

            update.title = params.title.trim();
        }

        if (params.slug !== undefined) {
            const newSlug = this.generateSlug(params.slug);

            if (!newSlug) {
                throw new BadRequestException(
                    'Invalid landing page slug',
                );
            }

            const duplicate = await this.databaseService.landingPageModel.findOne({
                slug: newSlug,
                _id: { $ne: id },
            }).exec();

            if (duplicate) {
                throw new ConflictException(
                    'A landing page with this slug already exists',
                );
            }

            update.slug = newSlug;
        }

        if (params.isPublished !== undefined) {
            update.isPublished = params.isPublished;
        }

        if (params.sections !== undefined) {
            if (!Array.isArray(params.sections)) {
                throw new BadRequestException(
                    'Sections must be an array',
                );
            }

            update.sections = params.sections;
        }

        if (params.seo !== undefined) {
            if (
                params.seo === null ||
                typeof params.seo !== 'object' ||
                Array.isArray(params.seo)
            ) {
                throw new BadRequestException(
                    'SEO must be an object',
                );
            }

            update.seo = params.seo;
        }

        if (Object.keys(update).length === 0) {
            throw new BadRequestException(
                'Provide at least one field to update',
            );
        }

        try {
            const updated = await this.databaseService.landingPageModel
                .findOneAndUpdate(
                    { _id: id, isDeleted: false },
                    { $set: update },
                    {
                        new: true,
                        runValidators: true,
                    },
                )
                .select('-__v')
                .lean()
                .exec();

            if (!updated) {
                throw new NotFoundException('Landing page not found');
            }

            return {
                success: true,
                message: 'Landing page updated successfully',
                data: updated,
            };
        } catch (error) {
            if (error?.code === 11000) {
                throw new ConflictException(
                    'A landing page with this slug already exists',
                );
            }

            throw error;
        }
    }

    async softDeleteLandingPage(id: string) {
        if (!/^[a-f\d]{24}$/i.test(id)) {
            throw new BadRequestException(
                'Invalid landing page ID',
            );
        }

        const page = await this.databaseService.landingPageModel
            .findOneAndUpdate(
                {
                    _id: id,
                    isDeleted: false,
                },
                {
                    $set: {
                        isDeleted: true,
                        isPublished: false,
                    },
                },
                { new: true },
            )
            .select('_id slug title isDeleted')
            .lean()
            .exec();

        if (!page) {
            throw new NotFoundException('Landing page not found');
        }

        return {
            success: true,
            message: 'Landing page soft-deleted successfully',
            data: page,
        };
    }
}
