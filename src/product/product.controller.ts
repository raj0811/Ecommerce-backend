
import {
    BadRequestException,
    Controller,
    Post,
    UseGuards,
    Req,
    Body,
    InternalServerErrorException,
    Query,
    DefaultValuePipe,
    Get,
    ParseIntPipe,
    ParseBoolPipe,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AdminAuthGuard } from 'src/Guards/admin.AuthGuard';
import { S3BucketService } from 'src/s3-bucket/s3-bucket.service';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(
        private readonly s3BucketService: S3BucketService,
        private readonly productService: ProductService
    ) { }

    @Post('product-image')
    @UseGuards(AdminAuthGuard)
    async uploadProductImage(
        @Req() req: any,
        @Body()
        body: {
            base64: string;
            contentType?: string;
        },
    ) {
        try {


            if (!body?.base64) {
                throw new BadRequestException('Base64 image is required');
            }

            let contentType = body.contentType;
            let base64Data = body.base64;

            // Support data URLs as well as raw Base64.
            const dataUrlMatch = body.base64.match(
                /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/,
            );

            if (dataUrlMatch) {
                contentType = dataUrlMatch[1];
                base64Data = dataUrlMatch[2];
            }

            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/webp',
            ];

            if (!contentType || !allowedTypes.includes(contentType)) {
                throw new BadRequestException(
                    'Only JPG, PNG and WebP images are allowed',
                );
            }

            // Validate Base64 format before decoding.
            const normalizedBase64 = base64Data.replace(/\s/g, '');

            if (
                !normalizedBase64 ||
                normalizedBase64.length % 4 === 1 ||
                !/^[A-Za-z0-9+/]*={0,2}$/.test(normalizedBase64)
            ) {
                throw new BadRequestException('Invalid Base64 image');
            }

            const fileBuffer = Buffer.from(normalizedBase64, 'base64');

            if (fileBuffer.length === 0) {
                throw new BadRequestException('Image is empty');
            }

            const maxSize = 5 * 1024 * 1024;

            if (fileBuffer.length > maxSize) {
                throw new BadRequestException(
                    'Image size cannot exceed 5 MB',
                );
            }

            // Verify file signature instead of trusting the supplied MIME type.
            const validSignature =
                (contentType === 'image/jpeg' &&
                    fileBuffer[0] === 0xff &&
                    fileBuffer[1] === 0xd8 &&
                    fileBuffer[2] === 0xff) ||
                (contentType === 'image/png' &&
                    fileBuffer.subarray(0, 8).equals(
                        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
                    )) ||
                (contentType === 'image/webp' &&
                    fileBuffer.toString('ascii', 0, 4) === 'RIFF' &&
                    fileBuffer.toString('ascii', 8, 12) === 'WEBP');

            if (!validSignature) {
                throw new BadRequestException(
                    'Image content does not match its file type',
                );
            }

            const bucketName = process.env.AWS_S3_BUCKET_NAME;
            console.log(bucketName);

            if (!bucketName) {
                throw new InternalServerErrorException(
                    'S3 bucket is not configured',
                );
            }

            const extensionByType: Record<string, string> = {
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'image/webp': 'webp',
            };

            const key =
                `products/${req.user.id}/${randomUUID()}.` +
                extensionByType[contentType];

            const url = await this.s3BucketService.uploadToS3(
                fileBuffer,
                key,
                contentType,
                bucketName,
            );

            return {
                success: true,
                message: 'Product image uploaded successfully',
                data: {
                    key,
                    url,
                },
            };
        } catch (e) {
            throw new Error(e)
        }
    }

    @Post()
    @UseGuards(AdminAuthGuard)
    async addProduct(
        @Body()
        body: {
            name: string;
            price: number;
            description: string;
            images: string[];
            category: string;
            sku?: string;
            stock?: number;
            compareAtPrice?: number | null;
            isActive?: boolean;
            isFeatured?: boolean;
        },
    ) {
        return this.productService.addProduct({
            name: body.name,
            price: Number(body.price),
            description: body.description,
            images: body.images,
            category: body.category,
            sku: body.sku,
            stock: body.stock === undefined ? 0 : Number(body.stock),
            compareAtPrice:
                body.compareAtPrice === undefined ||
                    body.compareAtPrice === null
                    ? null
                    : Number(body.compareAtPrice),
            isActive: body.isActive,
            isFeatured: body.isFeatured,
        });
    }

    @Get()
    async getAllProducts(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page: number,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe)
        limit: number,
        @Query('search')
        search?: string,
        @Query('category')
        category?: string,
        @Query('minPrice')
        minPrice?: string,
        @Query('maxPrice')
        maxPrice?: string,
        @Query('inStock', new DefaultValuePipe(false), ParseBoolPipe)
        inStock?: boolean,
    ) {
        return this.productService.getAllProducts({
            page,
            limit,
            search,
            category,
            minPrice:
                minPrice !== undefined ? Number(minPrice) : undefined,
            maxPrice:
                maxPrice !== undefined ? Number(maxPrice) : undefined,
            inStock,
        });
    }

    @Get('stats')
    @UseGuards(AdminAuthGuard)
    async getDashboardStats() {
        return this.productService.getDashboardStats();
    }

    @Patch(':id')
    @UseGuards(AdminAuthGuard)
    async updateProduct(
        @Param('id') productId: string,
        @Body() updates: Record<string, any>,
    ) {
        return this.productService.updateProduct(productId, updates);
    }

    // Soft delete product (deactivates product)
    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    async deleteProduct(@Param('id') productId: string) {
        return this.productService.deleteProduct(productId);
    }
}
