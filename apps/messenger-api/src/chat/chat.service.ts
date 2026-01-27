import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Chat, ChatType } from '@prisma/client';

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

  async getUserChats(userId: string): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      where: { members: { some: { userId } } },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        members: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}
