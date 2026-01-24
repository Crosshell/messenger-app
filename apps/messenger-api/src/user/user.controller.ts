import { Controller, Get } from '@nestjs/common';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { Authorization } from '../auth/decorators/authorization.decorator';
import type { UserWithoutPassword } from './types/user-without-password.type';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('me')
  @Authorization()
  async getMe(@CurrentUserId() userId: string): Promise<UserWithoutPassword> {
    return this.service.findOneOrThrow(userId);
  }
}
