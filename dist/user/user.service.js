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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
let UserService = class UserService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async registerUser(name, email, password, number) {
        try {
            if (!name?.trim() || !email?.trim() || !number?.trim() || !password) {
                throw new common_1.BadRequestException('Name, email, number and password are required');
            }
            if (password.length < 8) {
                throw new common_1.BadRequestException('Password must be at least 8 characters long');
            }
            const normalizedEmail = email.trim().toLowerCase();
            const existingUser = await this.databaseService.userModel.findOne({
                email: normalizedEmail,
            });
            if (existingUser) {
                throw new common_1.BadRequestException('Email is already registered');
            }
            const user = await this.databaseService.userModel.create({
                name,
                email: normalizedEmail,
                number,
                password,
            });
            return {
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    number: user.number,
                }
            };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e.message);
        }
    }
    async loginUser(email, password) {
        if (!email?.trim() || !password) {
            throw new common_1.BadRequestException('Email and password are required');
        }
        const user = await this.databaseService.userModel
            .findOne({
            email: email.trim().toLowerCase()
        })
            .select('+password')
            .exec();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const payload = {
            id: user._id,
            email: user.email
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });
        return {
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
            },
        };
    }
    async getUser(userId) {
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid admin ID');
        }
        const user = await this.databaseService.userModel.findOne({
            _id: userId
        }).select('-password')
            .lean()
            .exec();
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return user;
    }
    async verifyUserToken(token) {
        if (!token) {
            throw new common_1.UnauthorizedException("Token is required");
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const user = await this.databaseService.userModel.findOne({
                _id: payload.id
            }).select('name email number')
                .lean()
                .exec();
            if (!user) {
                throw new common_1.UnauthorizedException("User not found");
            }
            return {
                valid: true,
                user
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException("Invalid or expired token");
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UserService);
//# sourceMappingURL=user.service.js.map