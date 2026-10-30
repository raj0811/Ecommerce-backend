import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    registerAdmin(body: {
        name: string;
        email: string;
        number: string;
        password: string;
    }): Promise<{
        message: string;
        admin: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            number: string;
        };
    }>;
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
        };
    }>;
    getAdminInfo(req?: any): Promise<import("../database/schema/admin.schema").Admin & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
