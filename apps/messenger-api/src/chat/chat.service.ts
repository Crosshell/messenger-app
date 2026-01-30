import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Chat, ChatType, Message } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/responses/paginated.response';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ChatService {
  private readonly includeMembers = {
    members: {
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
      },
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

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

  async getUserChats(
    userId: string,
    { limit = 20, cursor }: PaginationDto,
  ): Promise<PaginatedResponse<Chat>> {
    const take = limit + 1;

    const chats = await this.prisma.chat.findMany({
      where: { members: { some: { userId } } },
      orderBy: { lastMessageAt: 'desc' },
      take: take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: {
        ...this.includeMembers,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: { attachments: true },
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

    let nextCursor: string | null = null;

    if (chats.length > limit) {
      chats.pop();
      nextCursor = chats[chats.length - 1].id;
    }

    const formattedChats = chats.map((chat) => ({
      ...chat,
      unreadCount: chat._count.messages,
      _count: undefined,
    }));

    return {
      data: formattedChats,
      meta: {
        nextCursor,
      },
    };
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
        attachments: true,
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

  async deleteChat(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: true,
        messages: {
          where: { attachments: { some: {} } },
          include: { attachments: true },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isMember = chat.members.some((member) => member.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You represent not a member of this chat');
    }

    await this.prisma.chat.delete({
      where: { id: chatId },
    });

    return {
      id: chatId,
      members: chat.members,
    };
  }
}
