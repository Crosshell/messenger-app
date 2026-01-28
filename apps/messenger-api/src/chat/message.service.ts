import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { Message, Prisma } from '@prisma/client';
import { SendMessageDto } from './dto/send-message.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { MarkReadDto } from './dto/mark-read.dto';

@Injectable()
export class MessageService {
  private readonly includeSender = {
    sender: { select: { id: true, username: true, avatarUrl: true } },
  };

  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(senderId: string, dto: SendMessageDto): Promise<Message> {
    await this.checkChatAccess(senderId, dto.chatId);

    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          senderId,
          content: dto.content,
          chatId: dto.chatId,
        },
        include: this.includeSender,
      });

      await tx.chat.update({
        where: { id: dto.chatId },
        data: { lastMessageAt: new Date() },
      });

      return message;
    });
  }

  async editMessage(userId: string, dto: EditMessageDto): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: { id: dto.messageId },
    });

    if (!message || message.senderId !== userId) {
      throw new WsException('Access denied');
    }

    return this.prisma.message.update({
      where: { id: dto.messageId },
      data: {
        content: dto.content,
        isEdited: true,
      },
      include: this.includeSender,
    });
  }

  async deleteMessage(userId: string, messageId: string): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.senderId !== userId) {
      throw new WsException('Access denied');
    }

    return this.prisma.message.delete({
      where: { id: messageId },
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
