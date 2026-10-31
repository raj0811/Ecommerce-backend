
import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken'
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { AdminRole } from 'src/database/schema/admin.schema';


@Injectable()
export class AdminService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }


    async registerAdmin(
        name: string,
        email: string,
        number: string,
        password: string,
        role: AdminRole = AdminRole.ADMIN,
    ) {
        if (!name?.trim() || !email?.trim() || !number?.trim() || !password) {
            throw new BadRequestException(
                'Name, email, number and password are required',
            );
        }

        if (password.length < 8) {
            throw new BadRequestException(
                'Password must be at least 8 characters long',
            );
        }

        if (!Object.values(AdminRole).includes(role)) {
            throw new BadRequestException('Invalid admin role');
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedNumber = number.trim();

        const existingAdmin = await this.databaseService.adminModel.findOne({
            $or: [
                { email: normalizedEmail },
                { number: normalizedNumber },
            ],
        });

        if (existingAdmin) {
            if (existingAdmin.email === normalizedEmail) {
                throw new ConflictException(
                    'Admin with this email already exists',
                );
            }

            throw new ConflictException(
                'Admin with this phone number already exists',
            );
        }

        try {
            const admin = new this.databaseService.adminModel({
                name: name.trim(),
                email: normalizedEmail,
                number: number.trim(),
                password,
                role,
            });

            await admin.save();

            return {
                message: 'Admin registered successfully',
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    number: admin.number,
                    role: admin.role,
                },
            };
        } catch (error) {
            if (error?.code === 11000) {
                throw new ConflictException(
                    "Error in creating Admin",
                );
            }

            if (
                error instanceof BadRequestException ||
                error instanceof ConflictException
            ) {
                throw error;
            }

            throw new InternalServerErrorException(
                'Failed to register admin',
            );
        }
    }

    async updateAdmin(
        id: string,
        data: {
            name?: string;
            email?: string;
            number?: string;
            password?: string;
            role?: AdminRole;
        },
    ) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid admin ID');
        }

        const admin = await this.databaseService.adminModel.findById(id);

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        if (
            data.role !== undefined &&
            !Object.values(AdminRole).includes(data.role)
        ) {
            throw new BadRequestException('Invalid admin role');
        }

        if (data.name !== undefined) {
            if (!data.name.trim()) {
                throw new BadRequestException('Name cannot be empty');
            }
            admin.name = data.name.trim();
        }

        if (data.email !== undefined) {
            if (!data.email.trim()) {
                throw new BadRequestException('Email cannot be empty');
            }
            admin.email = data.email.trim().toLowerCase();
        }

        if (data.number !== undefined) {
            if (!data.number.trim()) {
                throw new BadRequestException('Number cannot be empty');
            }
            admin.number = data.number.trim();
        }

        if (data.password !== undefined) {
            if (data.password.length < 8) {
                throw new BadRequestException(
                    'Password must be at least 8 characters long',
                );
            }
            admin.password = data.password;
        }

        if (data.role !== undefined) {
            admin.role = data.role;
        }

        try {
            await admin.save();

            return {
                message: 'Admin updated successfully',
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    number: admin.number,
                    role: admin.role,
                },
            };
        } catch (error) {
            if (error?.code === 11000) {
                throw new ConflictException('Email already exists');
            }

            throw error;
        }
    }

    async loginAdmin(email: string, password: string) {
        if (!email?.trim() || !password) {
            throw new BadRequestException(
                'Email and password are required',
            );
        }

        const admin = await this.databaseService.adminModel
            .findOne({
                email: email.trim().toLowerCase()
            })
            .select('+password')
            .exec();

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const accessToken = jwt.sign(
            {
                _id: admin._id.toString(),
                role: admin.role,
            },
            process.env.JWT_SECRET!, { expiresIn: '7d' }
        );

        return {
            message: 'Login successful',
            accessToken,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
        };
    }

    async getAdmin(adminId: string) {
        if (!Types.ObjectId.isValid(adminId)) {
            throw new BadRequestException('Invalid admin ID');
        }

        const admin = await this.databaseService.adminModel
            .findOne({
                _id: adminId
            })
            .select('-password')
            .lean()
            .exec();

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        return admin;
    }

    async verifyAdminToken(token: string) {
        if (!token) {
            throw new UnauthorizedException(
                'Authentication token is required',
            );
        }
        try {
            const payload = await jwt.verify(token, process.env.JWT_SECRET!)
            const admin = await this.databaseService.adminModel
                .findOne({
                    _id: payload._id
                })
                .select('_id name email role')
                .lean()
                .exec();

            if (!admin) {
                throw new UnauthorizedException(
                    'Admin account not found or inactive',
                );
            }

            return {
                valid: true,
                admin,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException(
                'Invalid or expired authentication token',
            );
        }
    }

    async getAllAdmins(
        page = 1,
        limit = 10,
        search = '',
    ) {
        page = Math.max(1, Number(page) || 1);
        limit = Math.min(100, Math.max(1, Number(limit) || 10));

        const filter: any = {};

        if (search?.trim()) {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&',
            );

            filter.$or = [
                { name: { $regex: escapedSearch, $options: 'i' } },
                { email: { $regex: escapedSearch, $options: 'i' } },
                { number: { $regex: escapedSearch, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;

        const [admins, total] = await Promise.all([
            this.databaseService.adminModel
                .find(filter)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),

            this.databaseService.adminModel.countDocuments(filter),
        ]);

        return {
            admins,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        };
    }

    async getAdminById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid admin ID');
        }

        const admin = await this.databaseService.adminModel
            .findById(id)
            .select('-password')
            .lean()
            .exec();

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        return admin;
    }

    async deleteAdmin(id: string, currentAdminId: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid admin ID');
        }

        if (id === currentAdminId) {
            throw new BadRequestException(
                'You cannot delete your own account',
            );
        }

        const admin = await this.databaseService.adminModel.findById(id);

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        if (admin.role === AdminRole.SUPER_ADMIN) {
            const superAdminCount =
                await this.databaseService.adminModel.countDocuments({
                    role: AdminRole.SUPER_ADMIN,
                });

            if (superAdminCount <= 1) {
                throw new BadRequestException(
                    'Cannot delete the last super admin',
                );
            }
        }

        await admin.deleteOne();

        return {
            message: 'Admin deleted successfully',
        };
    }
}
