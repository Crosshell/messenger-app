import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UserWithoutPassword } from './types/user-without-password.type';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<UserWithoutPassword> {
    return this.prisma.user.create({ data, omit: { password: true } });
  }

  async findOneOrThrow(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findUnique({
      where,
      omit: { password: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<UserWithoutPassword | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      omit: { password: true },
    });
  }

  async findOneWithPassword(login: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }],
      },
    });
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    await this.update({ id: userId }, { password });
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.update({ id: userId }, { isEmailVerified: true });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<void> {
    await this.findOneOrThrow(where);
    await this.prisma.user.update({ where, data });
  }
}
