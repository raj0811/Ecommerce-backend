import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserAuthGuard } from 'src/Guards/user.AuthGuard';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserAuthGuard],
  controllers: [UserController],
  exports: [UserAuthGuard, UserService]
})
export class UserModule { }
