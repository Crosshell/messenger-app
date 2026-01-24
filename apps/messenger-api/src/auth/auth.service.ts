import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { hash } from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(dto: RegisterDto): Promise<void> {
    const existingUser = await this.userService.findByEmailOrUsername(
      dto.email,
      dto.username,
    );

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('User with this email already exists');
      }
      if (existingUser.username === dto.username) {
        throw new ConflictException('User with this username already exists');
      }
    }
    const hashedPassword = await hash(dto.password);

    await this.userService.create({ ...dto, password: hashedPassword });
  }
}
