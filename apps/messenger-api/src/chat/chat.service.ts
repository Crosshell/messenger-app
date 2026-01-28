import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Chat, ChatType, Message } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ChatService {
  private readonly includeMembers = {
    members: {
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateChat(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Chat> {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('Self-chat is not allowed');
    }

    const existingChat = await this.prisma.chat.findFirst({
      where: {
        AND: [
          { members: { some: { userId: currentUserId } } },
          { members: { some: { userId: targetUserId } } },
        ],
        type: ChatType.DIRECT,
      },
      include: this.includeMembers,
    });

    if (existingChat) return existingChat;

    return this.prisma.chat.create({
      data: {
        type: ChatType.DIRECT,
        members: {
          create: [{ userId: currentUserId }, { userId: targetUserId }],
        },
      },
      include: this.includeMembers,
    });
  }

  async getUserChats(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: { members: { some: { userId } } },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        ...this.includeMembers,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: { not: userId },
              },
            },
          },
        },
      },
    });

    return chats.map((chat) => ({
      ...chat,
      unreadCount: chat._count.messages,
      _count: undefined,
    }));
  }

  async getChatMessages(
    chatId: string,
    { limit = 20, cursor }: PaginationDto,
  ): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { chatId },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: {
        sender: { select: { id: true, username: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getChatMembers(chatId: string) {
    return this.prisma.chatMember.findMany({
      where: { chatId },
      select: { userId: true },
    });
  }
}
