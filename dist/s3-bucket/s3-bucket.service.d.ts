export declare class S3BucketService {
    private s3Bucket;
    constructor();
    uploadToS3(fileBuffer: Buffer, key: string, contentType: string, bucketName: string): Promise<string>;
    deleteFromS3(key: string, bucketName: string): Promise<string>;
}
