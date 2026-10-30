"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3BucketService = void 0;
const common_1 = require("@nestjs/common");
const AWS = __importStar(require("aws-sdk"));
let S3BucketService = class S3BucketService {
    s3Bucket;
    constructor() {
        this.s3Bucket = new AWS.S3({
            region: 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    async uploadToS3(fileBuffer, key, contentType, bucketName) {
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
        };
        try {
            console.log({
                a: process.env.AWS_ACCESS_KEY_ID,
                b: process.env.AWS_SECRET_ACCESS_KEY
            });
            await this.s3Bucket.upload(params).promise();
            return `https://${bucketName}.s3.amazonaws.com/${key}`;
        }
        catch (e) {
            console.log(e);
            return "";
        }
    }
    async deleteFromS3(key, bucketName) {
        try {
            const params = {
                Bucket: bucketName,
                Key: key,
            };
            await this.s3Bucket.deleteObject(params).promise();
            return 'File removed successfully from S3';
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message || 'Something went wrong');
        }
    }
};
exports.S3BucketService = S3BucketService;
exports.S3BucketService = S3BucketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3BucketService);
//# sourceMappingURL=s3-bucket.service.js.map