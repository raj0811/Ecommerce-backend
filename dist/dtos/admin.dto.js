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
exports.UpdateAdminDto = exports.LoginAdminDto = exports.CreateAdminDto = void 0;
const class_validator_1 = require("class-validator");
const admin_schema_1 = require("../database/schema/admin.schema");
class CreateAdminDto {
    name;
    email;
    number;
    password;
    role;
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^\d{10}$/, {
        message: 'Mobile number must be exactly 10 digits',
    }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, {
        message: 'Password must be at least 8 characters',
    }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(admin_schema_1.AdminRole, {
        message: 'Invalid admin role',
    }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "role", void 0);
class LoginAdminDto {
    email;
    password;
}
exports.LoginAdminDto = LoginAdminDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginAdminDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, {
        message: 'Password must be at least 8 characters',
    }),
    __metadata("design:type", String)
], LoginAdminDto.prototype, "password", void 0);
class UpdateAdminDto {
    name;
    email;
    number;
    password;
    role;
}
exports.UpdateAdminDto = UpdateAdminDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{10}$/, {
        message: 'Mobile number must be exactly 10 digits',
    }),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, {
        message: 'Password must be at least 8 characters',
    }),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(admin_schema_1.AdminRole, {
        message: 'Invalid admin role',
    }),
    __metadata("design:type", String)
], UpdateAdminDto.prototype, "role", void 0);
//# sourceMappingURL=admin.dto.js.map