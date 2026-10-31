import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [DatabaseModule, AdminModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule { }
