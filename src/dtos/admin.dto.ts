import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';
import { AdminRole } from 'src/database/schema/admin.schema';

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Matches(/^\d{10}$/, {
        message: 'Mobile number must be exactly 10 digits',
    })
    number: string;

    @IsString()
    @MinLength(8, {
        message: 'Password must be at least 8 characters',
    })
    password: string;

    @IsOptional()
    @IsEnum(AdminRole, {
        message: 'Invalid admin role',
    })
    role?: AdminRole;
}

export class LoginAdminDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, {
        message: 'Password must be at least 8 characters',
    })
    password: string;

}

export class UpdateAdminDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @Matches(/^\d{10}$/, {
        message: 'Mobile number must be exactly 10 digits',
    })
    number?: string;

    @IsOptional()
    @IsString()
    @MinLength(8, {
        message: 'Password must be at least 8 characters',
    })
    password?: string;

    @IsOptional()
    @IsEnum(AdminRole, {
        message: 'Invalid admin role',
    })
    role?: AdminRole;
}