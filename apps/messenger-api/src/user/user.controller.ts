import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Authorization } from '../auth/decorators/authorization.decorator';
import type { UserWithoutPassword } from './types/user-without-password.type';
import { UserService } from './user.service';
import { FindManyUsersDto } from './dto/find-many-users.dto';
import { PaginatedResponse } from '../common/responses/paginated.response';

@Controller('users')
@Authorization()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('me')
  async getMe(
    @CurrentUser('sub') userId: string,
  ): Promise<UserWithoutPassword> {
    return this.service.findOneOrThrow({ id: userId });
  }

  @Get()
  async findMany(
    @Query() dto: FindManyUsersDto,
  ): Promise<PaginatedResponse<UserWithoutPassword>> {
    return this.service.findMany(dto);
  }
}
