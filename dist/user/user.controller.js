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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_AuthGuard_1 = require("../Guards/user.AuthGuard");
const throttler_1 = require("@nestjs/throttler");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async registerUser(body) {
        return this.userService.registerUser(body.name, body.email, body.password, body.number);
    }
    async loginUser(body) {
        return this.userService.loginUserotp(body.email, body.password);
    }
    async verifyLoginOtp(body) {
        return this.userService.verifyLoginOtp(body.challengeToken, body.otp);
    }
    async resendLoginOtp(body) {
        return this.userService.resendLoginOtp(body.challengeToken);
    }
    async getUser(userId) {
        return this.userService.getUser(userId);
    }
    async getMyProfile(req) {
        return this.userService.getUser(req.user.id);
    }
    async addUserAddress(req, address) {
        return this.userService.updateUserAddress(req.user.id, address);
    }
    async toogleAuth(req) {
        const userId = req.user?.id ?? req.user?._id;
        if (!userId) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        return this.userService.toggleTwoFactor(userId);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60 * 1000 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 5 * 60 * 1000 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyLoginOtp", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 15 * 60 * 1000 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resendLoginOtp", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, common_1.UseGuards)(user_AuthGuard_1.UserAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)('profile/me'),
    (0, common_1.UseGuards)(user_AuthGuard_1.UserAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Post)('address'),
    (0, common_1.UseGuards)(user_AuthGuard_1.UserAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_service_1.UpdateUserAddressDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addUserAddress", null);
__decorate([
    (0, common_1.Post)('toogle-auth'),
    (0, common_1.UseGuards)(user_AuthGuard_1.UserAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "toogleAuth", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map