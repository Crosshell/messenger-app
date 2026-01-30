import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { extname } from 'path';
import { randomUUID } from 'node:crypto';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';
import { PresignedUpload } from './responses/presigned-upload.response';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly maxFileSize: number;

  constructor(private readonly config: ConfigService) {
    this.s3Client = new S3Client({
      region: this.config.getOrThrow<string>('aws.region'),
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('aws.accessKeyId'),
        secretAccessKey: this.config.getOrThrow<string>('aws.secretAccessKey'),
      },
    });
    this.bucketName = this.config.getOrThrow<string>('aws.bucketName');
    this.maxFileSize = this.config.getOrThrow<number>('upload.maxFileSize');
  }

  async getPresignedUrl(dto: GetPresignedUrlDto): Promise<PresignedUpload> {
    if (dto.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds limit of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    const fileExt = extname(dto.filename);
    const key = `uploads/${randomUUID()}${fileExt}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: dto.contentType || 'application/octet-stream',
      ContentLength: dto.size,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });

    const region = this.config.getOrThrow<string>('aws.region');
    return {
      uploadUrl: url,
      fileUrl: `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`,
      key: key,
    };
  }

  async deleteFiles(keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    const command = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: keys.map((Key) => ({ Key })),
        Quiet: true,
      },
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
