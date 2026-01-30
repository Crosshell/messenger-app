import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ConfigService } from '@nestjs/config';
import { AttachmentDto } from './dto/attachment.dto';
import { Attachment } from '@prisma/client';

@Injectable()
export class AttachmentService {
  private readonly maxAttachments: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly config: ConfigService,
  ) {
    this.maxAttachments = this.config.getOrThrow<number>(
      'upload.maxAttachments',
    );
  }

  async validateAttachments(attachments?: AttachmentDto[]): Promise<void> {
    if (attachments && attachments.length > this.maxAttachments) {
      throw new BadRequestException(
        `Maximum ${this.maxAttachments} attachments allowed per message`,
      );
    }
  }

  async createAttachments(
    messageId: string,
    attachments?: AttachmentDto[],
  ): Promise<Attachment[]> {
    if (!attachments || attachments.length === 0) return [];

    return this.prisma.attachment.createManyAndReturn({
      data: attachments.map((att) => ({
        messageId,
        url: att.url,
        filename: att.filename,
        mimeType: att.mimeType,
        size: att.size,
      })),
    });
  }

  async deleteAttachments(attachmentIds: string[]): Promise<void> {
    if (attachmentIds.length === 0) return;

    const attachments = await this.prisma.attachment.findMany({
      where: { id: { in: attachmentIds } },
      select: { url: true },
    });

    const s3Keys = attachments
      .map((att) => this.storageService.extractKeyFromUrl(att.url))
      .filter((key) => key !== null) as string[];

    await this.prisma.attachment.deleteMany({
      where: { id: { in: attachmentIds } },
    });

    if (s3Keys.length > 0) {
      await this.storageService.deleteFiles(s3Keys);
    }
  }

  async getAttachmentsToDelete(
    oldAttachments: Attachment[],
    newUrls: Set<string>,
  ): Promise<string[]> {
    return oldAttachments
      .filter((oldAtt) => !newUrls.has(oldAtt.url))
      .map((att) => att.id);
  }
}
