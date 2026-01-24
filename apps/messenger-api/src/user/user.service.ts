import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserWithoutPassword } from '../auth/types/user-without-password.type';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<UserWithoutPassword> {
    return this.prisma.user.create({ data, omit: { password: true } });
  }

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<UserWithoutPassword | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
      omit: { password: true },
    });
  }
}
