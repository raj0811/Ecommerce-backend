import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'
import { Types } from 'mongoose';
import * as crypto from 'crypto';
import { MailerService } from 'src/mailer/mailer.service';
import { Otp } from 'src/database/schema/otp.schema';
import { CustomerAddress } from 'aws-sdk/clients/directconnect';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserAddressDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @Matches(/^\d{10}$/, {
        message: 'Phone number must be exactly 10 digits',
    })
    phone: string;

    @IsString()
    @IsNotEmpty()
    addressLine1: string;

    @IsOptional()
    @IsString()
    addressLine2?: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsString()
    @Matches(/^\d{6}$/, {
        message: 'Pincode must be exactly 6 digits',
    })
    pincode: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}

@Injectable()
export class UserService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly emailService: MailerService
    ) { }



    async registerUser(
        name: string,
        email: string,
        password: string,
        number: string,
    ) {
        try {
            if (!name?.trim() || !email?.trim() || !number?.trim() || !password) {
                throw new BadRequestException(
                    'Name, email, number and password are required',
                );
            }

            if (password.length < 8) {
                throw new BadRequestException(
                    'Password must be at least 8 characters long',
                );
            }

            const normalizedEmail = email.trim().toLowerCase();
            const existingUser = await this.databaseService.userModel.findOne({
                email: normalizedEmail,
            });

            if (existingUser) {
                throw new BadRequestException(
                    'Email is already registered',
                );
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
            }

        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    async loginUser(email: string, password: string) {
        if (!email?.trim() || !password) {
            throw new BadRequestException(
                'Email and password are required',
            );
        }

        const user = await this.databaseService.userModel
            .findOne({
                email: email.trim().toLowerCase()
            })
            .select('+password')
            .exec();

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException(
                'Invalid email or password'
            )
        }
        const payload = {
            id: user._id,
            email: user.email
        }

        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        )
        return {
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
            },
        }
    }

    async getUser(userId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid user ID');
        }

        const user = await this.databaseService.userModel
            .findById(userId)
            .select('-password')
            .lean()
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async verifyUserToken(token: string) {
        if (!token) {
            throw new UnauthorizedException(
                "Token is required"
            )
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!)
            const user = await this.databaseService.userModel.findOne({
                _id: payload.id
            }).select('name email number')
                .lean()
                .exec();
            if (!user) {
                throw new UnauthorizedException(
                    "User not found"
                )
            }
            return {
                valid: true,
                user
            }
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException(
                "Invalid or expired token"
            )
        }
    }


    private generateOtpHash(otp: string): string {
        return crypto
            .createHmac('sha256', process.env.OTP_SECRET!)
            .update(otp)
            .digest('hex');
    }

    private generateAccessToken(user: any) {
        const payload = {
            id: user._id,
            email: user.email,
        };

        return jwt.sign(
            payload,
            process.env.JWT_SECRET!,
            { expiresIn: '3d' },
        );
    }


    async loginUserotp(email: string, password: string) {
        if (!email?.trim() || !password) {
            throw new BadRequestException(
                'Email and password are required',
            );
        }

        const user = await this.databaseService.userModel
            .findOne({
                email: email.trim().toLowerCase(),
            })
            .select('+password')
            .exec();

        if (
            !user ||
            !(await bcrypt.compare(password, user.password))
        ) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        // If 2FA is disabled, use the existing login flow.
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

        // If 2FA is enabled, initiate OTP verification.
        return this.createLoginOtpChallenge(user);
    }


    private async createLoginOtpChallenge(user: any) {
        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        const challengeId = crypto.randomUUID();

        const otpHash = this.generateOtpHash(otp);

        // Invalidate previous OTP challenges.
        await this.databaseService.otpModel.deleteMany({
            userId: user._id,
        });

        // Save OTP hash, never the plain OTP.
        await this.databaseService.otpModel.create({
            userId: user._id,
            challengeId,
            otpHash,
            method: 'email',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            attempts: 0,
            verified: false,
        });

        // Send email using your existing email service.
        await this.emailService.sendOtp(user.email, otp);

        // Temporary token: this is NOT an access token.
        const challengeToken = jwt.sign(
            {
                sub: user._id.toString(),
                challengeId,
                purpose: 'login_2fa',
            },
            process.env.JWT_SECRET!,
            { expiresIn: '5m' },
        );

        return {
            message: 'OTP sent successfully',
            requiresOtp: true,
            challengeToken,
            expiresIn: 300,
        };
    }


    async verifyLoginOtp(
        challengeToken: string,
        submittedOtp: string,
    ) {
        console.log({ challengeToken, submittedOtp });

        if (!challengeToken || !submittedOtp) {
            throw new BadRequestException(
                'Challenge token and OTP are required',
            );
        }

        if (!/^\d{6}$/.test(submittedOtp)) {
            throw new BadRequestException('Invalid OTP format');
        }

        let payload: any;

        try {
            payload = jwt.verify(
                challengeToken,
                process.env.JWT_SECRET!,
            );
        } catch (e) {
            console.log(e);

            throw new UnauthorizedException(
                'OTP challenge expired or invalid',
            );
        }

        if (payload.purpose !== 'login_2fa') {
            throw new UnauthorizedException(
                'Invalid login challenge',
            );
        }
        console.log(payload);

        const otpRecord = await this.databaseService.otpModel
            .findOne({
                userId: new Types.ObjectId(payload.sub),
                challengeId: payload.challengeId,
                verified: false,
            })
            .select('+otpHash')
            .exec();

        if (!otpRecord) {
            throw new UnauthorizedException(
                'Please Log In again',
            );
        }

        if (otpRecord.expiresAt.getTime() <= Date.now()) {
            await otpRecord.deleteOne();

            throw new UnauthorizedException('OTP has expired');
        }

        if (otpRecord.attempts >= 5) {
            await otpRecord.deleteOne();

            throw new BadRequestException(
                'Maximum OTP attempts exceeded. Please login again.',
            );
        }

        const submittedHash = this.generateOtpHash(submittedOtp);

        const isValid = crypto.timingSafeEqual(
            Buffer.from(submittedHash, 'hex'),
            Buffer.from(otpRecord.otpHash, 'hex'),
        );

        if (!isValid) {
            otpRecord.attempts += 1;
            await otpRecord.save();

            throw new UnauthorizedException('Incorrect OTP');
        }

        // OTP successfully verified. Delete it to prevent replay.
        await otpRecord.deleteOne();

        const user = await this.databaseService.userModel.findById(
            payload.sub,
        );

        if (!user || !user.twoFactorEnabled) {
            throw new UnauthorizedException(
                'User authentication failed',
            );
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


    async resendLoginOtp(challengeToken: string) {
        if (!challengeToken) {
            throw new BadRequestException(
                'Challenge token is required',
            );
        }

        // Verify temporary login challenge token.
        let payload: any;

        try {
            payload = jwt.verify(
                challengeToken,
                process.env.JWT_SECRET!,
            );
        } catch {
            throw new UnauthorizedException(
                'Login challenge expired. Please login again.',
            );
        }

        if (payload.purpose !== 'login_2fa') {
            throw new UnauthorizedException(
                'Invalid login challenge',
            );
        }

        // Find the existing OTP challenge.
        const otpRecord = await this.databaseService.otpModel
            .findOne({
                userId: new Types.ObjectId(payload.sub),
                challengeId: payload.challengeId,
                verified: false,
            })
            .exec();

        if (!otpRecord) {
            throw new UnauthorizedException(
                'OTP challenge not found. Please login again.',
            );
        }

        // Check existing OTP expiry.
        if (otpRecord.expiresAt.getTime() <= Date.now()) {
            await otpRecord.deleteOne();

            throw new UnauthorizedException(
                'OTP expired. Please login again.',
            );
        }

        // Enforce 60-second resend cooldown.
        const cooldown = 60 * 1000;

        const lastSentAt = otpRecord.updatedAt
            ? new Date(otpRecord.updatedAt).getTime()
            : new Date(otpRecord.createdAt).getTime();

        const timeSinceLastSent = Date.now() - lastSentAt;

        if (timeSinceLastSent < cooldown) {
            const remainingSeconds = Math.ceil(
                (cooldown - timeSinceLastSent) / 1000,
            );

            throw new BadRequestException(
                `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
            );
        }

        // Check user.
        const user = await this.databaseService.userModel.findById(
            payload.sub,
        );

        if (!user || !user.twoFactorEnabled) {
            throw new UnauthorizedException(
                'User authentication failed',
            );
        }

        // Generate a new OTP.
        const otp = crypto
            .randomInt(100000, 1000000)
            .toString();

        const otpHash = this.generateOtpHash(otp);

        // Update existing OTP record.
        otpRecord.otpHash = otpHash;
        otpRecord.expiresAt = new Date(
            Date.now() + 5 * 60 * 1000,
        );
        otpRecord.attempts = 0;

        await otpRecord.save();

        // Send new OTP.
        try {
            await this.emailService.sendOtp(user.email, otp);
        } catch (error) {
            await otpRecord.deleteOne();
            throw error;
        }

        return {
            message: 'A new OTP has been sent to your registered email.',
            requiresOtp: true,
            expiresIn: 300,
        };
    }

    async updateUserAddress(
        userId: string,
        address: UpdateUserAddressDto,
    ) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid user ID');
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

        const updatedUser = await this.databaseService.userModel.findOneAndUpdate(
            {
                _id: new Types.ObjectId(userId),
                addresses: {
                    $not: {
                        $elemMatch: addressExists,
                    },
                },
            },
            {
                $push: {
                    addresses: normalizedAddress,
                },
            },
            {
                new: true,
                runValidators: true,
            },
        ).select('-password').exec();

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
            throw new NotFoundException('User not found');
        }

        return {
            message: 'Address already exists',
        };
    }

    async toggleTwoFactor(userId: string) {
        const user = await this.databaseService.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
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
}
