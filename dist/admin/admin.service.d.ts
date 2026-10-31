import { Types } from 'mongoose';
import { DatabaseService } from "../database/database.service";
import { AdminRole } from "../database/schema/admin.schema";
export declare class AdminService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    registerAdmin(name: string, email: string, number: string, password: string, role?: AdminRole): Promise<{
        message: string;
        admin: {
            id: Types.ObjectId;
            name: string;
            email: string;
            number: string;
            role: AdminRole;
        };
    }>;
    updateAdmin(id: string, data: {
        name?: string;
        email?: string;
        number?: string;
        password?: string;
        role?: AdminRole;
    }): Promise<{
        message: string;
        admin: {
            id: Types.ObjectId;
            name: string;
            email: string;
            number: string;
            role: AdminRole;
        };
    }>;
    loginAdmin(email: string, password: string): Promise<{
        message: string;
        accessToken: any;
        admin: {
            id: Types.ObjectId;
            name: string;
            email: string;
            role: AdminRole;
        };
    }>;
    getAdmin(adminId: string): Promise<import("src/database/schema/admin.schema").Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    verifyAdminToken(token: string): Promise<{
        valid: boolean;
        admin: import("src/database/schema/admin.schema").Admin & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getAllAdmins(page?: number, limit?: number, search?: string): Promise<{
        admins: (import("src/database/schema/admin.schema").Admin & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    getAdminById(id: string): Promise<import("src/database/schema/admin.schema").Admin & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteAdmin(id: string, currentAdminId: string): Promise<{
        message: string;
    }>;
}
