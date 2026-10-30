import { DatabaseService } from "../database/database.service";
import { Types } from 'mongoose';
export declare class UserService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
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
}
