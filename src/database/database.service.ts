import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { Admin } from './schema/admin.schema';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectModel(User.name)
        public readonly userModel: Model<User>,
        @InjectModel(Admin.name)
        public readonly adminModel: Model<Admin>,
    ) { }
}
