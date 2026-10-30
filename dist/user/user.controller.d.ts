import { Request } from 'express';
import { UserService } from './user.service';
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
        accessToken: any;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            number: string;
        };
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
}
export {};
