
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

        const normalizedEmail = email.trim().toLowerCase();

        try {
            const existingAdmin = await this.databaseService.adminModel.exists({
                email: normalizedEmail,
            });

            if (existingAdmin) {
                throw new ConflictException(
                    'Admin with this email already exists',
                );
            }

            // Password is hashed by the schema's pre-save hook.
            const admin = new this.databaseService.adminModel({
                name: name.trim(),
                email: normalizedEmail,
                number: number.trim(),
                password,
            });

            await admin.save();

            return {
                message: 'Admin registered successfully',
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    number: admin.number,
                },
            };
        } catch (error) {
            if (
                error instanceof BadRequestException ||
                error instanceof ConflictException
            ) {
                throw error;
            }

            if (error?.code === 11000) {
                throw new ConflictException(
                    'Admin with this email already exists',
                );
            }

            throw new InternalServerErrorException(
                'Failed to register admin',
            );
        }
    }

    async loginAdmin(email: string, password: string) {
        if (!email?.trim() || !password) {
            throw new BadRequestException(
                'Email and password are required',
            );
        }
        console.log(email.trim().toLowerCase());

        const admin = await this.databaseService.adminModel
            .findOne({
                email: email.trim().toLowerCase()
            })
            .select('+password')
            .exec();
        console.log(admin);

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
}
