import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private s3Client!: S3Client;
  private bucketName!: string;

  async onModuleInit() {
    const endpoint = process.env.MINIO_ENDPOINT || "http://localhost:9000";
    const accessKeyId = process.env.MINIO_ROOT_USER || "minio_admin";
    const secretAccessKey = process.env.MINIO_ROOT_PASSWORD || "minio_secure_pass_2026";
    this.bucketName = process.env.MINIO_BUCKET || "nudum-documents";

    this.s3Client = new S3Client({
      endpoint,
      region: "us-east-1",
      credentials: {
        accessKeyId,
        secretAccessKey
      },
      forcePathStyle: true
    });

    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
      this.logger.log(`Storage bucket "${this.bucketName}" already exists.`);
    } catch (error: any) {
      if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
        this.logger.log(`Storage bucket "${this.bucketName}" not found. Creating it...`);
        try {
          await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
          this.logger.log(`Successfully created storage bucket "${this.bucketName}".`);
        } catch (createError) {
          this.logger.error(`Failed to create bucket "${this.bucketName}":`, createError);
        }
      } else {
        this.logger.error(`Error checking bucket existence for "${this.bucketName}":`, error);
      }
    }
  }

  async uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType
      })
    );
    return key;
  }

  async getDownloadUrl(key: string, expirySeconds = 900): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });
    return getSignedUrl(this.s3Client, command, { expiresIn: expirySeconds });
  }
}
