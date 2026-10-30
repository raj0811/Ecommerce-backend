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
exports.LandingPageController = void 0;
const common_1 = require("@nestjs/common");
const admin_AuthGuard_1 = require("../Guards/admin.AuthGuard");
const landin_page_service_1 = require("./landin-page.service");
let LandingPageController = class LandingPageController {
    landingPageService;
    constructor(landingPageService) {
        this.landingPageService = landingPageService;
    }
    async getPublishedLandingPage(slug) {
        return this.landingPageService.getPublishedLandingPageBySlug(slug);
    }
    async createLandingPage(body) {
        return this.landingPageService.createLandingPage(body);
    }
    async getAllLandingPages() {
        return this.landingPageService.getAllLandingPages();
    }
    async getLandingPageById(id) {
        return this.landingPageService.getLandingPageById(id);
    }
    async updateLandingPage(id, body) {
        return this.landingPageService.updateLandingPage(id, body);
    }
    async deleteLandingPage(id) {
        return this.landingPageService.softDeleteLandingPage(id);
    }
};
exports.LandingPageController = LandingPageController;
__decorate([
    (0, common_1.Get)('public/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LandingPageController.prototype, "getPublishedLandingPage", null);
__decorate([
    (0, common_1.Post)('admin'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LandingPageController.prototype, "createLandingPage", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LandingPageController.prototype, "getAllLandingPages", null);
__decorate([
    (0, common_1.Get)('admin/:id'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LandingPageController.prototype, "getLandingPageById", null);
__decorate([
    (0, common_1.Patch)('admin/:id'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LandingPageController.prototype, "updateLandingPage", null);
__decorate([
    (0, common_1.Delete)('admin/:id'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LandingPageController.prototype, "deleteLandingPage", null);
exports.LandingPageController = LandingPageController = __decorate([
    (0, common_1.Controller)('landing-page'),
    __metadata("design:paramtypes", [landin_page_service_1.LandingPageService])
], LandingPageController);
//# sourceMappingURL=landin-page.controller.js.map