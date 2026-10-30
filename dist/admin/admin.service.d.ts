import { Types } from 'mongoose';
import { DatabaseService } from "../database/database.service";
export declare class AdminService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    registerAdmin(name: string, email: string, number: string, password: string): Promise<{
        message: string;
        admin: {
            id: Types.ObjectId;
            name: string;
            email: string;
            number: string;
        };
    }>;
    loginAdmin(email: string, password: string): Promise<{
        message: string;
        accessToken: any;
        admin: {
            id: Types.ObjectId;
            name: string;
            email: string;
        };
    }>;
    getAdmin(adminId: string): Promise<import("../database/schema/admin.schema").Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    verifyAdminToken(token: string): Promise<{
        valid: boolean;
        admin: import("../database/schema/admin.schema").Admin & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
