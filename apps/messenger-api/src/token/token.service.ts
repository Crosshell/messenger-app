import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Token, TokenType } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(userId: string, type: TokenType): Promise<string> {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + this.getTtl[type]);

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

  private getTtl = (type: TokenType) => {
    return {
      [TokenType.EMAIL]: this.config.getOrThrow<number>('token.email.ttl'),
      [TokenType.PASSWORD]:
        this.config.getOrThrow<number>('token.password.ttl'),
    }[type];
  };
}
