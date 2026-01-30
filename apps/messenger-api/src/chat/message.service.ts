import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { Message, Prisma } from '@prisma/client';
import { SendMessageDto } from './dto/send-message.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { ConfigService } from '@nestjs/config';
import { StorageService } from '../storage/storage.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class MessageService {
  private readonly maxAttachments: number;

  private readonly includeRelations = {
    sender: { select: { id: true, username: true, avatarUrl: true } },
    replyTo: {
      select: {
        id: true,
        content: true,
        senderId: true,
        sender: { select: { username: true } },
        attachments: { take: 1, select: { id: true, mimeType: true } },
      },
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly storageService: StorageService,
  ) {
    this.config.getOrThrow<number>('upload.maxAttachments');
  }

  async saveMessage(senderId: string, dto: SendMessageDto): Promise<Message> {
    await this.checkChatAccess(senderId, dto.chatId);

    if (dto.replyToId) {
      const parentMessage = await this.prisma.message.findUnique({
        where: { id: dto.replyToId },
        select: { chatId: true },
      });

      if (!parentMessage) {
        throw new NotFoundException('Message to reply not found');
      }

      if (parentMessage.chatId !== dto.chatId) {
        throw new BadRequestException(
          'You can only reply to messages within the same chat',
        );
      }
    }

    if (dto.attachments && dto.attachments.length > this.maxAttachments) {
      throw new WsException(
        `Maximum ${this.maxAttachments} attachments allowed per message`,
      );
    }

    if (
      (!dto.content || dto.content.trim() === '') &&
      (!dto.attachments || dto.attachments.length === 0)
    ) {
      throw new WsException('Message must contain text or attachments');
    }

    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          senderId,
          content: dto.content,
          chatId: dto.chatId,
          replyToId: dto.replyToId,
          attachments: dto.attachments
            ? {
                create: dto.attachments.map((att) => ({
                  url: att.url,
                  filename: att.filename,
                  mimeType: att.mimeType,
                  size: att.size,
                })),
              }
            : undefined,
        },
        include: { ...this.includeRelations, attachments: true },
      });

      await tx.chat.update({
        where: { id: dto.chatId },
        data: { lastMessageAt: new Date() },
      });

      return message;
    });
  }

  async editMessage(userId: string, dto: EditMessageDto): Promise<Message> {
    if (
      (!dto.content || dto.content.trim() === '') &&
      (!dto.attachments || dto.attachments.length === 0)
    ) {
      throw new WsException('Message must contain text or attachments');
    }

    const message = await this.prisma.message.findUnique({
      where: { id: dto.messageId },
      include: { attachments: true },
    });

    if (!message || message.senderId !== userId) {
      throw new WsException('Access denied');
    }

    const newAttachmentUrls = new Set(dto.attachments?.map((a) => a.url) || []);

    const attachmentsToDelete = message.attachments.filter(
      (oldAtt) => !newAttachmentUrls.has(oldAtt.url),
    );

    const s3KeysToDelete: string[] = [];
    attachmentsToDelete.forEach((att) => {
      const key = this.storageService.extractKeyFromUrl(att.url);
      if (key) s3KeysToDelete.push(key);
    });

    const updatedMessage = await this.prisma.$transaction(async (tx) => {
      if (attachmentsToDelete.length) {
        await tx.attachment.deleteMany({
          where: { id: { in: attachmentsToDelete.map((a) => a.id) } },
        });
      }

      const existingUrls = new Set(message.attachments.map((a) => a.url));
      const attachmentsToCreate =
        dto.attachments?.filter((newAtt) => !existingUrls.has(newAtt.url)) ||
        [];

      if (attachmentsToCreate.length) {
        await tx.attachment.createMany({
          data: attachmentsToCreate.map((att) => ({
            ...att,
            messageId: message.id,
          })),
        });
      }

      return tx.message.update({
        where: { id: dto.messageId },
        data: {
          content: dto.content,
          isEdited: true,
        },
        include: { ...this.includeRelations, attachments: true },
      });
    });

    void this.storageService.deleteFiles(s3KeysToDelete);

    return updatedMessage;
  }

  async getMessages(
    chatId: string,
    { limit = 20, cursor }: PaginationDto,
  ): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { chatId },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: {
        ...this.includeRelations,
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteMessage(userId: string, messageId: string): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { attachments: true },
    });

    if (!message || message.senderId !== userId) {
      throw new WsException('Access denied');
    }

    const s3KeysToDelete: string[] = [];
    message.attachments.forEach((att) => {
      const key = this.storageService.extractKeyFromUrl(att.url);
      if (key) s3KeysToDelete.push(key);
    });

    const deletedMessage = await this.prisma.message.delete({
      where: { id: messageId },
    });

    void this.storageService.deleteFiles(s3KeysToDelete);

    return deletedMessage;
  }

  async markAsRead(userId: string, dto: MarkReadDto): Promise<Date | null> {
    await this.checkChatAccess(userId, dto.chatId);

    const where: Prisma.MessageWhereInput = {
      chatId: dto.chatId,
      senderId: { not: userId },
      isRead: false,
    };

    let limitDate: Date | undefined;

    if (dto.lastMessageId) {
      const lastMessage = await this.prisma.message.findUnique({
        where: { id: dto.lastMessageId },
      });
      if (!lastMessage) {
        return null;
      }

      limitDate = lastMessage.createdAt;
      where.createdAt = { lte: limitDate };
    }

    const result = await this.prisma.message.updateMany({
      where,
      data: { isRead: true },
    });

    if (result.count === 0) return null;

    return limitDate || new Date();
  }

  async checkChatAccess(userId: string, chatId: string): Promise<void> {
    const member = await this.prisma.chatMember.findUnique({
      where: {
        userId_chatId: { userId, chatId },
      },
    });
    if (!member) throw new WsException('Access denied');
  }
}
