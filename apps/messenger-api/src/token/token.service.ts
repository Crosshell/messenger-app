import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Token, TokenType } from '@prisma/client';
import { randomUUID } from 'node:crypto';

@Injectable()
export class TokenService {
  private readonly TTL_MS = {
    [TokenType.EMAIL]: 60 * 60 * 1000,
    [TokenType.PASSWORD]: 60 * 60 * 1000,
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, type: TokenType): Promise<string> {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + this.TTL_MS[type]);

    await this.prisma.$transaction([
      this.prisma.token.deleteMany({
        where: { userId, type },
      }),
      this.prisma.token.create({
        data: {
          value: token,
          userId,
          type,
          expiresAt,
        },
      }),
    ]);

    return token;
  }

  async consume(tokenValue: string): Promise<Token | null> {
    const token = await this.prisma.token.findFirst({
      where: {
        value: tokenValue,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (token) {
      await this.prisma.token.delete({ where: { value: token.value } });
    }

    return token;
  }
}
