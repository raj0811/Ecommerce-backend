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
exports.UserService = exports.UpdateUserAddressDto = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const crypto = __importStar(require("crypto"));
const mailer_service_1 = require("../mailer/mailer.service");
const class_validator_1 = require("class-validator");
class UpdateUserAddressDto {
    fullName;
    phone;
    addressLine1;
    addressLine2;
    city;
    state;
    pincode;
    isDefault;
}
exports.UpdateUserAddressDto = UpdateUserAddressDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserAddressDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{10}$/, {
        message: 'Phone number must be exactly 10 digits',
    }),
    __metadata("design:type", String)
], UpdateUserAddressDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserAddressDto.prototype, "addressLine1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserAddressDto.prototype, "addressLine2", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserAddressDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserAddressDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{6}$/, {
        message: 'Pincode must be exactly 6 digits',
    }),
    __metadata("design:type", String)
], UpdateUserAddressDto.prototype, "pincode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserAddressDto.prototype, "isDefault", void 0);
let UserService = class UserService {
    databaseService;
    emailService;
    constructor(databaseService, emailService) {
        this.databaseService = databaseService;
        this.emailService = emailService;
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
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const user = await this.databaseService.userModel
            .findById(userId)
            .select('-password')
            .lean()
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
    generateOtpHash(otp) {
        return crypto
            .createHmac('sha256', process.env.OTP_SECRET)
            .update(otp)
            .digest('hex');
    }
    generateAccessToken(user) {
        const payload = {
            id: user._id,
            email: user.email,
        };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });
    }
    async loginUserotp(email, password) {
        if (!email?.trim() || !password) {
            throw new common_1.BadRequestException('Email and password are required');
        }
        const user = await this.databaseService.userModel
            .findOne({
            email: email.trim().toLowerCase(),
        })
            .select('+password')
            .exec();
        if (!user ||
            !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.twoFactorEnabled) {
            const accessToken = this.generateAccessToken(user);
            return {
                message: 'Login successful',
                requiresOtp: false,
                accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    number: user.number,
                },
            };
        }
        return this.createLoginOtpChallenge(user);
    }
    async createLoginOtpChallenge(user) {
        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();
        const challengeId = crypto.randomUUID();
        const otpHash = this.generateOtpHash(otp);
        await this.databaseService.otpModel.deleteMany({
            userId: user._id,
        });
        await this.databaseService.otpModel.create({
            userId: user._id,
            challengeId,
            otpHash,
            method: 'email',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            attempts: 0,
            verified: false,
        });
        await this.emailService.sendOtp(user.email, otp);
        const challengeToken = jwt.sign({
            sub: user._id.toString(),
            challengeId,
            purpose: 'login_2fa',
        }, process.env.JWT_SECRET, { expiresIn: '5m' });
        return {
            message: 'OTP sent successfully',
            requiresOtp: true,
            challengeToken,
            expiresIn: 300,
        };
    }
    async verifyLoginOtp(challengeToken, submittedOtp) {
        console.log({ challengeToken, submittedOtp });
        if (!challengeToken || !submittedOtp) {
            throw new common_1.BadRequestException('Challenge token and OTP are required');
        }
        if (!/^\d{6}$/.test(submittedOtp)) {
            throw new common_1.BadRequestException('Invalid OTP format');
        }
        let payload;
        try {
            payload = jwt.verify(challengeToken, process.env.JWT_SECRET);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('OTP challenge expired or invalid');
        }
        if (payload.purpose !== 'login_2fa') {
            throw new common_1.UnauthorizedException('Invalid login challenge');
        }
        console.log(payload);
        const otpRecord = await this.databaseService.otpModel
            .findOne({
            userId: new mongoose_1.Types.ObjectId(payload.sub),
            challengeId: payload.challengeId,
            verified: false,
        })
            .select('+otpHash')
            .exec();
        if (!otpRecord) {
            throw new common_1.UnauthorizedException('Please Log In again');
        }
        if (otpRecord.expiresAt.getTime() <= Date.now()) {
            await otpRecord.deleteOne();
            throw new common_1.UnauthorizedException('OTP has expired');
        }
        if (otpRecord.attempts >= 5) {
            await otpRecord.deleteOne();
            throw new common_1.BadRequestException('Maximum OTP attempts exceeded. Please login again.');
        }
        const submittedHash = this.generateOtpHash(submittedOtp);
        const isValid = crypto.timingSafeEqual(Buffer.from(submittedHash, 'hex'), Buffer.from(otpRecord.otpHash, 'hex'));
        if (!isValid) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            throw new common_1.UnauthorizedException('Incorrect OTP');
        }
        await otpRecord.deleteOne();
        const user = await this.databaseService.userModel.findById(payload.sub);
        if (!user || !user.twoFactorEnabled) {
            throw new common_1.UnauthorizedException('User authentication failed');
        }
        const accessToken = this.generateAccessToken(user);
        return {
            message: 'Login successful',
            requiresOtp: false,
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
            },
        };
    }
    async resendLoginOtp(challengeToken) {
        if (!challengeToken) {
            throw new common_1.BadRequestException('Challenge token is required');
        }
        let payload;
        try {
            payload = jwt.verify(challengeToken, process.env.JWT_SECRET);
        }
        catch {
            throw new common_1.UnauthorizedException('Login challenge expired. Please login again.');
        }
        if (payload.purpose !== 'login_2fa') {
            throw new common_1.UnauthorizedException('Invalid login challenge');
        }
        const otpRecord = await this.databaseService.otpModel
            .findOne({
            userId: new mongoose_1.Types.ObjectId(payload.sub),
            challengeId: payload.challengeId,
            verified: false,
        })
            .exec();
        if (!otpRecord) {
            throw new common_1.UnauthorizedException('OTP challenge not found. Please login again.');
        }
        if (otpRecord.expiresAt.getTime() <= Date.now()) {
            await otpRecord.deleteOne();
            throw new common_1.UnauthorizedException('OTP expired. Please login again.');
        }
        const cooldown = 60 * 1000;
        const lastSentAt = otpRecord.updatedAt
            ? new Date(otpRecord.updatedAt).getTime()
            : new Date(otpRecord.createdAt).getTime();
        const timeSinceLastSent = Date.now() - lastSentAt;
        if (timeSinceLastSent < cooldown) {
            const remainingSeconds = Math.ceil((cooldown - timeSinceLastSent) / 1000);
            throw new common_1.BadRequestException(`Please wait ${remainingSeconds} seconds before requesting another OTP.`);
        }
        const user = await this.databaseService.userModel.findById(payload.sub);
        if (!user || !user.twoFactorEnabled) {
            throw new common_1.UnauthorizedException('User authentication failed');
        }
        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();
        const otpHash = this.generateOtpHash(otp);
        otpRecord.otpHash = otpHash;
        otpRecord.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        otpRecord.attempts = 0;
        await otpRecord.save();
        try {
            await this.emailService.sendOtp(user.email, otp);
        }
        catch (error) {
            await otpRecord.deleteOne();
            throw error;
        }
        return {
            message: 'A new OTP has been sent to your registered email.',
            requiresOtp: true,
            expiresIn: 300,
        };
    }
    async updateUserAddress(userId, address) {
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const normalizedAddress = {
            fullName: address.fullName.trim(),
            phone: address.phone.trim(),
            addressLine1: address.addressLine1.trim(),
            addressLine2: address.addressLine2?.trim() || '',
            city: address.city.trim(),
            state: address.state.trim(),
            pincode: address.pincode.trim(),
            isDefault: address.isDefault ?? false,
        };
        const addressExists = {
            fullName: normalizedAddress.fullName,
            phone: normalizedAddress.phone,
            addressLine1: normalizedAddress.addressLine1,
            addressLine2: normalizedAddress.addressLine2,
            city: normalizedAddress.city,
            state: normalizedAddress.state,
            pincode: normalizedAddress.pincode,
        };
        const updatedUser = await this.databaseService.userModel.findOneAndUpdate({
            _id: new mongoose_1.Types.ObjectId(userId),
            addresses: {
                $not: {
                    $elemMatch: addressExists,
                },
            },
        }, {
            $push: {
                addresses: normalizedAddress,
            },
        }, {
            new: true,
            runValidators: true,
        }).select('-password').exec();
        if (updatedUser) {
            return {
                message: 'Address added successfully',
                addresses: updatedUser.addresses,
            };
        }
        const userExists = await this.databaseService.userModel.exists({
            _id: userId,
        });
        if (!userExists) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            message: 'Address already exists',
        };
    }
    async toggleTwoFactor(userId) {
        const user = await this.databaseService.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.twoFactorEnabled = !user.twoFactorEnabled;
        await user.save();
        return {
            success: true,
            message: user.twoFactorEnabled
                ? 'Two-factor authentication enabled successfully'
                : 'Two-factor authentication disabled successfully',
            twoFactorEnabled: user.twoFactorEnabled,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        mailer_service_1.MailerService])
], UserService);
//# sourceMappingURL=user.service.js.map