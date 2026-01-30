import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UserWithoutPassword } from './types/user-without-password.type';
import { FindManyUsersDto } from './dto/find-many-users.dto';
import { PaginatedResponse } from '../common/responses/paginated.response';
import { UpdateUserDto } from './dto/update-user.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

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

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<UserWithoutPassword | null> {
    return this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      omit: { password: true },
    });
  }

  async findOneWithPassword(login: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { OR: [{ email: login }, { username: login }] },
    });
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    await this.update({ id: userId }, { password });
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    await this.update({ id: userId }, { isEmailVerified: true });
  }

  async updateProfile(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    const currentUser = await this.findOneOrThrow({ id: userId });

    await this.ensureUsernameIsUnique(dto.username, currentUser.username);

    const s3KeyToDelete = this.getOldAvatarKeyIfChanged(
      currentUser.avatarUrl,
      dto.avatarUrl,
    );

    const updatedUser = await this.update({ id: userId }, dto);

    if (s3KeyToDelete) {
      void this.storageService.deleteFiles([s3KeyToDelete]);
    }

    return updatedUser;
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<UserWithoutPassword> {
    await this.findOneOrThrow(where);

    return this.prisma.user.update({
      where,
      data,
      omit: { password: true },
    });
  }

  async findMany(
    dto: FindManyUsersDto,
  ): Promise<PaginatedResponse<UserWithoutPassword>> {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = this.buildSearchFilter(dto.username);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        omit: { password: true },
        orderBy: { username: 'asc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async ensureUsernameIsUnique(
    newUsername: string | undefined,
    currentUsername: string,
  ): Promise<void> {
    if (!newUsername || newUsername === currentUsername) return;

    const existingUser = await this.prisma.user.findUnique({
      where: { username: newUsername },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }
  }

  private getOldAvatarKeyIfChanged(
    currentUrl: string | null,
    newUrl?: string | null,
  ): string | null {
    if (newUrl === undefined || newUrl === currentUrl) return null;

    if (!currentUrl) return null;

    return this.storageService.extractKeyFromUrl(currentUrl);
  }

  private buildSearchFilter(username: string): Prisma.UserWhereInput {
    return {
      username: {
        contains: username,
        mode: 'insensitive',
      },
    };
  }
}
