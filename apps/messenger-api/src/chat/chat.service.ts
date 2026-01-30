import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Chat, ChatType } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/responses/paginated.response';

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

    const existingChat = await this.findExistingDirectChat(
      currentUserId,
      targetUserId,
    );
    if (existingChat) return existingChat;

    return this.createDirectChat(currentUserId, targetUserId);
  }

  private async findExistingDirectChat(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Chat | null> {
    return this.prisma.chat.findFirst({
      where: {
        AND: [
          { members: { some: { userId: currentUserId } } },
          { members: { some: { userId: targetUserId } } },
        ],
        type: ChatType.DIRECT,
      },
      include: this.includeMembers,
    });
  }

  private async createDirectChat(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Chat> {
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
      take,
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
            messages: { where: { isRead: false, senderId: { not: userId } } },
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

    return { data: formattedChats, meta: { nextCursor } };
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
      include: { members: true },
    });

    if (!chat) throw new NotFoundException('Chat not found');

    const isMember = chat.members.some((member) => member.userId === userId);
    if (!isMember)
      throw new ForbiddenException('You are not a member of this chat');

    await this.prisma.chat.delete({ where: { id: chatId } });

    return { id: chatId, members: chat.members };
  }
}
