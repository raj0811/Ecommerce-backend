import { AdminRole } from "../database/schema/admin.schema";
export declare class CreateAdminDto {
    name: string;
    email: string;
    number: string;
    password: string;
    role?: AdminRole;
}
export declare class LoginAdminDto {
    email: string;
    password: string;
}
export declare class UpdateAdminDto {
    name?: string;
    email?: string;
    number?: string;
    password?: string;
    role?: AdminRole;
}
