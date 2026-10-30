"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const database_service_1 = require("../database/database.service");
let AdminService = class AdminService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async registerAdmin(name, email, number, password) {
        if (!name?.trim() || !email?.trim() || !number?.trim() || !password) {
            throw new common_1.BadRequestException('Name, email, number and password are required');
        }
        if (password.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long');
        }
        const normalizedEmail = email.trim().toLowerCase();
        try {
            const existingAdmin = await this.databaseService.adminModel.exists({
                email: normalizedEmail,
            });
            if (existingAdmin) {
                throw new common_1.ConflictException('Admin with this email already exists');
            }
            const admin = new this.databaseService.adminModel({
                name: name.trim(),
                email: normalizedEmail,
                number: number.trim(),
                password,
            });
            await admin.save();
            return {
                message: 'Admin registered successfully',
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    number: admin.number,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            if (error?.code === 11000) {
                throw new common_1.ConflictException('Admin with this email already exists');
            }
            throw new common_1.InternalServerErrorException('Failed to register admin');
        }
    }
    async loginAdmin(email, password) {
        if (!email?.trim() || !password) {
            throw new common_1.BadRequestException('Email and password are required');
        }
        const admin = await this.databaseService.adminModel
            .findOne({
            email: email.trim().toLowerCase()
        })
            .select('+password')
            .exec();
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const accessToken = jwt.sign({
            _id: admin._id.toString(),
            role: admin.role,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return {
            message: 'Login successful',
            accessToken,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        };
    }
    async getAdmin(adminId) {
        if (!mongoose_1.Types.ObjectId.isValid(adminId)) {
            throw new common_1.BadRequestException('Invalid admin ID');
        }
        const admin = await this.databaseService.adminModel
            .findOne({
            _id: adminId
        })
            .select('-password')
            .lean()
            .exec();
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        return admin;
    }
    async verifyAdminToken(token) {
        if (!token) {
            throw new common_1.UnauthorizedException('Authentication token is required');
        }
        try {
            const payload = await jwt.verify(token, process.env.JWT_SECRET);
            const admin = await this.databaseService.adminModel
                .findOne({
                _id: payload._id
            })
                .select('_id name email role')
                .lean()
                .exec();
            if (!admin) {
                throw new common_1.UnauthorizedException('Admin account not found or inactive');
            }
            return {
                valid: true,
                admin,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid or expired authentication token');
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AdminService);
//# sourceMappingURL=admin.service.js.map