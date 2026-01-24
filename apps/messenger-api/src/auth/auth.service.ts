import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { hash, verify } from 'argon2';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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

  async login(dto: LoginDto): Promise<string> {
    const user = await this.userService.findOneWithPassword(dto.login);

    const isValid = user && (await verify(user.password, dto.password));
    if (!isValid) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const payload = { sub: user.id };

    return this.jwtService.signAsync(payload);
  }
}
