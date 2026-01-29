import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { extname } from 'path';
import { randomUUID } from 'node:crypto';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly maxFileSize: number;

  constructor(private readonly config: ConfigService) {
    this.s3Client = new S3Client({
      region: this.config.getOrThrow('aws.region'),
      credentials: {
        accessKeyId: this.config.getOrThrow('aws.accessKeyId'),
        secretAccessKey: this.config.getOrThrow('aws.secretAccessKey'),
      },
    });
    this.bucketName = this.config.getOrThrow('aws.bucketName');
    this.maxFileSize = this.config.getOrThrow('upload.maxFileSize');
  }

  async getPresignedUrl(filename: string, contentType: string, size: number) {
    if (size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds limit of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    const fileExt = extname(filename);
    const key = `uploads/${randomUUID()}${fileExt}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType || 'application/octet-stream',
      ContentLength: size,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });

    return {
      uploadUrl: url,
      fileUrl: `https://${this.bucketName}.s3.${this.config.getOrThrow('aws.region')}.amazonaws.com/${key}`,
      key: key,
    };
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }

  extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1);
    } catch (e) {
      return null;
    }
  }
}
