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
exports.LandingPageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const database_service_1 = require("../database/database.service");
let LandingPageService = class LandingPageService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    generateSlug(value) {
        return value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
    async createLandingPage(params) {
        const { title, slug, productId, isPublished = false, sections = [], content = {}, seo = {}, } = params;
        if (!title?.trim()) {
            throw new common_1.BadRequestException('Page title is required');
        }
        if (!productId) {
            throw new common_1.BadRequestException('Product ID is required');
        }
        if (!Array.isArray(sections)) {
            throw new common_1.BadRequestException('Sections must be an array');
        }
        if (!mongoose_1.Types.ObjectId.isValid(productId)) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const product = await this.databaseService.productModel
            .findById(productId)
            .exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const pageSlug = this.generateSlug(slug || title);
        if (!pageSlug) {
            throw new common_1.BadRequestException('Invalid landing page slug');
        }
        const existing = await this.databaseService.landingPageModel
            .findOne({
            slug: pageSlug,
            isDeleted: false,
        })
            .exec();
        if (existing) {
            throw new common_1.ConflictException('A landing page with this slug already exists');
        }
        return this.databaseService.landingPageModel.create({
            title: title.trim(),
            slug: pageSlug,
            productId: new mongoose_1.Types.ObjectId(productId),
            content,
            isPublished,
            isDeleted: false,
            sections,
            seo,
        });
    }
    async getPublishedLandingPageBySlug(slug) {
        const page = await this.databaseService.landingPageModel
            .findOne({
            slug: slug.trim().toLowerCase(),
            isPublished: true,
            isDeleted: false,
        })
            .populate('productId')
            .lean()
            .exec();
        if (!page) {
            throw new common_1.NotFoundException('Landing page not found');
        }
        return page;
    }
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
    async getLandingPageById(id) {
        if (!/^[a-f\d]{24}$/i.test(id)) {
            throw new common_1.BadRequestException('Invalid landing page ID');
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
            throw new common_1.NotFoundException('Landing page not found');
        }
        return {
            success: true,
            data: page,
        };
    }
    async updateLandingPage(id, params) {
        if (!/^[a-f\d]{24}$/i.test(id)) {
            throw new common_1.BadRequestException('Invalid landing page ID');
        }
        const existing = await this.databaseService.landingPageModel.findOne({
            _id: id,
            isDeleted: false,
        }).exec();
        if (!existing) {
            throw new common_1.NotFoundException('Landing page not found');
        }
        const update = {};
        if (params.title !== undefined) {
            if (!params.title.trim()) {
                throw new common_1.BadRequestException('Page title cannot be empty');
            }
            update.title = params.title.trim();
        }
        if (params.slug !== undefined) {
            const newSlug = this.generateSlug(params.slug);
            if (!newSlug) {
                throw new common_1.BadRequestException('Invalid landing page slug');
            }
            const duplicate = await this.databaseService.landingPageModel.findOne({
                slug: newSlug,
                _id: { $ne: id },
            }).exec();
            if (duplicate) {
                throw new common_1.ConflictException('A landing page with this slug already exists');
            }
            update.slug = newSlug;
        }
        if (params.isPublished !== undefined) {
            update.isPublished = params.isPublished;
        }
        if (params.sections !== undefined) {
            if (!Array.isArray(params.sections)) {
                throw new common_1.BadRequestException('Sections must be an array');
            }
            update.sections = params.sections;
        }
        if (params.seo !== undefined) {
            if (params.seo === null ||
                typeof params.seo !== 'object' ||
                Array.isArray(params.seo)) {
                throw new common_1.BadRequestException('SEO must be an object');
            }
            update.seo = params.seo;
        }
        if (Object.keys(update).length === 0) {
            throw new common_1.BadRequestException('Provide at least one field to update');
        }
        try {
            const updated = await this.databaseService.landingPageModel
                .findOneAndUpdate({ _id: id, isDeleted: false }, { $set: update }, {
                new: true,
                runValidators: true,
            })
                .select('-__v')
                .lean()
                .exec();
            if (!updated) {
                throw new common_1.NotFoundException('Landing page not found');
            }
            return {
                success: true,
                message: 'Landing page updated successfully',
                data: updated,
            };
        }
        catch (error) {
            if (error?.code === 11000) {
                throw new common_1.ConflictException('A landing page with this slug already exists');
            }
            throw error;
        }
    }
    async softDeleteLandingPage(id) {
        if (!/^[a-f\d]{24}$/i.test(id)) {
            throw new common_1.BadRequestException('Invalid landing page ID');
        }
        const page = await this.databaseService.landingPageModel
            .findOneAndUpdate({
            _id: id,
            isDeleted: false,
        }, {
            $set: {
                isDeleted: true,
                isPublished: false,
            },
        }, { new: true })
            .select('_id slug title isDeleted')
            .lean()
            .exec();
        if (!page) {
            throw new common_1.NotFoundException('Landing page not found');
        }
        return {
            success: true,
            message: 'Landing page soft-deleted successfully',
            data: page,
        };
    }
};
exports.LandingPageService = LandingPageService;
exports.LandingPageService = LandingPageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], LandingPageService);
//# sourceMappingURL=landin-page.service.js.map