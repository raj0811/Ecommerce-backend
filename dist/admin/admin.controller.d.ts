import { AdminService } from './admin.service';
import { AdminRole } from "../database/schema/admin.schema";
import { CreateAdminDto, UpdateAdminDto } from "../dtos/admin.dto";
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    loginAdmin(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        accessToken: any;
        admin: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: AdminRole;
        };
    }>;
    getAdminInformation(req?: any): Promise<import("src/database/schema/admin.schema").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    registerAdmin(body: CreateAdminDto, req: any): Promise<{
        message: string;
        admin: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            number: string;
            role: AdminRole;
        };
    }>;
    getAllAdmins(req: any, page?: string, limit?: string, search?: string): Promise<{
        admins: (import("src/database/schema/admin.schema").Admin & Required<{
            _id: import("mongoose").Types.ObjectId;
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
    getAdminById(id: string, req: any): Promise<import("src/database/schema/admin.schema").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateAdmin(id: string, body: UpdateAdminDto, req: any): Promise<{
        message: string;
        admin: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            number: string;
            role: AdminRole;
        };
    }>;
    deleteAdmin(id: string, req: any): Promise<{
        message: string;
    }>;
}
