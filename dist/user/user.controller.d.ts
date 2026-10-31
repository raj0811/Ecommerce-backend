import { Request } from 'express';
import { UpdateUserAddressDto, UserService } from './user.service';
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
    };
}
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    registerUser(body: {
        name: string;
        email: string;
        password: string;
        number: string;
    }): Promise<{
        message: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            number: string;
        };
    }>;
    loginUser(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        requiresOtp: boolean;
        challengeToken: any;
        expiresIn: number;
    } | {
        message: string;
        requiresOtp: boolean;
        accessToken: any;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            number: string;
        };
    }>;
    verifyLoginOtp(body: {
        challengeToken: string;
        otp: string;
    }): Promise<{
        message: string;
        requiresOtp: boolean;
        accessToken: any;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            number: string;
        };
    }>;
    resendLoginOtp(body: {
        challengeToken: string;
    }): Promise<{
        message: string;
        requiresOtp: boolean;
        expiresIn: number;
    }>;
    getUser(userId: string): Promise<import("../database/schema/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyProfile(req: AuthenticatedRequest): Promise<import("../database/schema/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addUserAddress(req: any, address: UpdateUserAddressDto): Promise<{
        message: string;
        addresses: import("../database/schema/customer.schema").CustomerAddress[];
    } | {
        message: string;
        addresses?: undefined;
    }>;
    toogleAuth(req: any): Promise<{
        success: boolean;
        message: string;
        twoFactorEnabled: boolean;
    }>;
}
export {};
