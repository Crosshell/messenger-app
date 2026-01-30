import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttachmentService } from './attachment.service';
import { SendMessageDto } from './dto/send-message.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Message, Prisma } from '@prisma/client';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class MessageService {
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
    attachments: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly attachmentService: AttachmentService,
  ) {}

  async saveMessage(senderId: string, dto: SendMessageDto): Promise<Message> {
    await this.checkChatAccess(senderId, dto.chatId);
    this.validateMessageContent(dto);
    await this.attachmentService.validateAttachments(dto.attachments);
    if (dto.replyToId) await this.validateReply(dto.chatId, dto.replyToId);

    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          senderId,
          content: dto.content,
          chatId: dto.chatId,
          replyToId: dto.replyToId,
        },
        include: this.includeRelations,
      });

      if (dto.attachments) {
        await this.attachmentService.createAttachments(
          message.id,
          dto.attachments,
        );
      }

      await tx.chat.update({
        where: { id: dto.chatId },
        data: { lastMessageAt: new Date() },
      });

      return message;
    });
  }

  async editMessage(userId: string, dto: EditMessageDto): Promise<Message> {
    this.validateMessageContent(dto);

    const message = await this.prisma.message.findUnique({
      where: { id: dto.messageId },
      include: { attachments: true },
    });

    if (!message || message.senderId !== userId) {
      throw new WsException('Access denied');
    }

    const newAttachmentUrls = new Set(dto.attachments?.map((a) => a.url) || []);
    const attachmentsToDelete =
      await this.attachmentService.getAttachmentsToDelete(
        message.attachments,
        newAttachmentUrls,
      );

    return this.prisma.$transaction(async (tx) => {
      if (attachmentsToDelete.length > 0) {
        await this.attachmentService.deleteAttachments(attachmentsToDelete);
      }

      const existingUrls = new Set(message.attachments.map((a) => a.url));
      const attachmentsToCreate =
        dto.attachments?.filter((newAtt) => !existingUrls.has(newAtt.url)) ||
        [];

      if (attachmentsToCreate.length > 0) {
        await this.attachmentService.createAttachments(
          message.id,
          attachmentsToCreate,
        );
      }

      return tx.message.update({
        where: { id: dto.messageId },
        data: { content: dto.content, isEdited: true },
        include: this.includeRelations,
      });
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

    const attachmentIds = message.attachments.map((att) => att.id);
    await this.attachmentService.deleteAttachments(attachmentIds);

    return this.prisma.message.delete({ where: { id: messageId } });
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
      include: this.includeRelations,
      orderBy: { createdAt: 'desc' },
    });
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
      if (!lastMessage) return null;
      limitDate = lastMessage.createdAt;
      where.createdAt = { lte: limitDate };
    }

    const result = await this.prisma.message.updateMany({
      where,
      data: { isRead: true },
    });
    return result.count > 0 ? limitDate || new Date() : null;
  }

  async checkChatAccess(userId: string, chatId: string): Promise<void> {
    const member = await this.prisma.chatMember.findUnique({
      where: { userId_chatId: { userId, chatId } },
    });
    if (!member) throw new WsException('Access denied');
  }

  private async validateReply(
    chatId: string,
    replyToId: string,
  ): Promise<void> {
    const parentMessage = await this.prisma.message.findUnique({
      where: { id: replyToId },
      select: { chatId: true },
    });

    if (!parentMessage)
      throw new NotFoundException('Message to reply not found');

    if (parentMessage.chatId !== chatId) {
      throw new BadRequestException(
        'You can only reply to messages within the same chat',
      );
    }
  }

  private validateMessageContent(dto: SendMessageDto | EditMessageDto): void {
    if (
      (!dto.content || dto.content.trim() === '') &&
      (!dto.attachments || dto.attachments.length === 0)
    ) {
      throw new WsException('Message must contain text or attachments');
    }
  }
}
