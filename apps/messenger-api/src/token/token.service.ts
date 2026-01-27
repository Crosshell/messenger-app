import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Token, TokenType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

@Injectable()
export class TokenService {
  private readonly maxRefreshTokens: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.maxRefreshTokens = this.config.getOrThrow<number>(
      'token.maxRefreshTokens',
    );
  }

  async create(userId: string, type: TokenType): Promise<string> {
    const expiresAt = new Date(Date.now() + this.getTtl(type));

    return this.prisma.$transaction(async (tx) => {
      await tx.token.deleteMany({
        where: { userId, type },
      });

      const { value } = await tx.token.create({
        data: {
          userId,
          type,
          expiresAt,
        },
      });

      return value;
    });
  }

  async consume(tokenValue: string): Promise<Token | null> {
    const token = await this.prisma.token.findUnique({
      where: {
        value: tokenValue,
        expiresAt: { gt: new Date() },
      },
    });

    if (token) {
      await this.prisma.token.delete({ where: { value: token.value } });
    }

    return token;
  }

  async createRefreshToken(userId: string): Promise<string> {
    const expiresAt = new Date(Date.now() + this.getTtl(TokenType.REFRESH));

    return this.prisma.$transaction(async (tx) => {
      const storedRefresh = await tx.token.findMany({
        where: { userId, type: TokenType.REFRESH },
        orderBy: { createdAt: 'desc' },
        select: { value: true },
      });

      if (storedRefresh.length >= this.maxRefreshTokens) {
        const tokensToDelete = storedRefresh.slice(this.maxRefreshTokens - 1);

        if (tokensToDelete.length) {
          await tx.token.deleteMany({
            where: { value: { in: tokensToDelete.map((t) => t.value) } },
          });
        }
      }

      const { value } = await tx.token.create({
        data: {
          userId,
          type: TokenType.REFRESH,
          expiresAt,
        },
      });

      return value;
    });
  }

  async rotateRefreshToken(oldTokenValue: string): Promise<Token> {
    const expiresAt = new Date(Date.now() + this.getTtl(TokenType.REFRESH));

    return this.prisma.$transaction(async (tx) => {
      const deletedToken = await tx.token.delete({
        where: { value: oldTokenValue },
      });

      return tx.token.create({
        data: {
          userId: deletedToken.userId,
          type: TokenType.REFRESH,
          expiresAt,
        },
      });
    });
  }

  private getTtl(type: TokenType) {
    return {
      [TokenType.EMAIL]: this.config.getOrThrow<number>('token.emailTtl'),
      [TokenType.PASSWORD]: this.config.getOrThrow<number>('token.passwordTtl'),
      [TokenType.REFRESH]: this.config.getOrThrow<number>('token.refreshTtl'),
    }[type];
  }
}
