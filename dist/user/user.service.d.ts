import { DatabaseService } from "../database/database.service";
import { Types } from 'mongoose';
import { MailerService } from "../mailer/mailer.service";
export declare class UpdateUserAddressDto {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}
export declare class UserService {
    private readonly databaseService;
    private readonly emailService;
    constructor(databaseService: DatabaseService, emailService: MailerService);
    registerUser(name: string, email: string, password: string, number: string): Promise<{
        message: string;
        user: {
            id: Types.ObjectId;
            name: string;
            email: string;
            number: string;
        };
    }>;
    loginUser(email: string, password: string): Promise<{
        message: string;
        accessToken: any;
        user: {
            id: Types.ObjectId;
            name: string;
            email: string;
            number: string;
        };
    }>;
    getUser(userId: string): Promise<import("../database/schema/user.schema").User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    verifyUserToken(token: string): Promise<{
        valid: boolean;
        user: import("../database/schema/user.schema").User & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    private generateOtpHash;
    private generateAccessToken;
    loginUserotp(email: string, password: string): Promise<{
        message: string;
        requiresOtp: boolean;
        challengeToken: any;
        expiresIn: number;
    } | {
        message: string;
        requiresOtp: boolean;
        accessToken: any;
        user: {
            id: Types.ObjectId;
            name: string;
            email: string;
            number: string;
        };
    }>;
    private createLoginOtpChallenge;
    verifyLoginOtp(challengeToken: string, submittedOtp: string): Promise<{
        message: string;
        requiresOtp: boolean;
        accessToken: any;
        user: {
            id: Types.ObjectId;
            name: string;
            email: string;
            number: string;
        };
    }>;
    resendLoginOtp(challengeToken: string): Promise<{
        message: string;
        requiresOtp: boolean;
        expiresIn: number;
    }>;
    updateUserAddress(userId: string, address: UpdateUserAddressDto): Promise<{
        message: string;
        addresses: import("../database/schema/customer.schema").CustomerAddress[];
    } | {
        message: string;
        addresses?: undefined;
    }>;
    toggleTwoFactor(userId: string): Promise<{
        success: boolean;
        message: string;
        twoFactorEnabled: boolean;
    }>;
}
