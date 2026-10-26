import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';
import { AdminModule } from 'src/admin/admin.module';
import { S3BucketModule } from 'src/s3-bucket/s3-bucket.module';

@Module({
  imports: [DatabaseModule, AdminModule, S3BucketModule],
  providers: [ProductService, AdminAuthGuard],
  controllers: [ProductController]
})
export class ProductModule { }
