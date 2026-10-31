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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const admin_AuthGuard_1 = require("../Guards/admin.AuthGuard");
const admin_schema_1 = require("../database/schema/admin.schema");
const admin_dto_1 = require("../dtos/admin.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async loginAdmin(body) {
        return this.adminService.loginAdmin(body.email, body.password);
    }
    async getAdminInformation(req) {
        const adminId = req.user.id;
        return this.adminService.getAdmin(adminId);
    }
    async registerAdmin(body, req) {
        if (req.user?.role !== admin_schema_1.AdminRole.SUPER_ADMIN) {
            throw new common_1.UnauthorizedException('Only super admin can create admin accounts');
        }
        return this.adminService.registerAdmin(body.name, body.email, body.number, body.password, body.role ?? admin_schema_1.AdminRole.ADMIN);
    }
    async getAllAdmins(req, page = '1', limit = '10', search = '') {
        if (req.user?.role !== admin_schema_1.AdminRole.SUPER_ADMIN) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        return this.adminService.getAllAdmins(Number(page), Number(limit), search);
    }
    async getAdminById(id, req) {
        if (req.user?.role !== admin_schema_1.AdminRole.SUPER_ADMIN) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        return this.adminService.getAdminById(id);
    }
    async updateAdmin(id, body, req) {
        if (req.user?.role !== admin_schema_1.AdminRole.SUPER_ADMIN) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        return this.adminService.updateAdmin(id, body);
    }
    async deleteAdmin(id, req) {
        if (req.user?.role !== admin_schema_1.AdminRole.SUPER_ADMIN) {
            throw new common_1.UnauthorizedException('Access denied');
        }
        return this.adminService.deleteAdmin(id, req.user.id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "loginAdmin", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminInformation", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "registerAdmin", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllAdmins", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.UpdateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_AuthGuard_1.AdminAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAdmin", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map