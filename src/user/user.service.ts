import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'
import { Types } from 'mongoose';
@Injectable()
export class UserService {
    constructor(
        private readonly databaseService: DatabaseService
    ) { }

    async registerUser(
        name: string,
        email: string,
        password: string,
        number: string,
    ) {
        try {
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
            const existingUser = await this.databaseService.userModel.findOne({
                email: normalizedEmail,
            });

            if (existingUser) {
                throw new BadRequestException(
                    'Email is already registered',
                );
            }


            const user = await this.databaseService.userModel.create({
                name,
                email: normalizedEmail,
                number,
                password,
            });
            return {
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    number: user.number,
                }
            }

        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    async loginUser(email: string, password: string) {
        if (!email?.trim() || !password) {
            throw new BadRequestException(
                'Email and password are required',
            );
        }

        const user = await this.databaseService.userModel
            .findOne({
                email: email.trim().toLowerCase()
            })
            .select('+password')
            .exec();

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException(
                'Invalid email or password'
            )
        }
        const payload = {
            id: user._id,
            email: user.email
        }

        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        )
        return {
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
            },
        }
    }

    async getUser(userId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid admin ID');
        }

        const user = await this.databaseService.userModel.findOne({
            _id: userId
        }).select('-password')
            .lean()
            .exec();
        if (!user) {
            throw new NotFoundException(
                "User not found"
            )
        }
        return user
    }

    async verifyUserToken(token: string) {
        if (!token) {
            throw new UnauthorizedException(
                "Token is required"
            )
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!)
            const user = await this.databaseService.userModel.findOne({
                _id: payload.id
            }).select('name email number')
                .lean()
                .exec();
            if (!user) {
                throw new UnauthorizedException(
                    "User not found"
                )
            }
            return {
                valid: true,
                user
            }
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException(
                "Invalid or expired token"
            )
        }
    }
}
