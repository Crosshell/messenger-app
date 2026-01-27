import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../config/jwt.config';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailModule } from '../email/email.module';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { TokenModule } from '../token/token.module';
import { WsJwtAuthGuard } from './guards/ws-jwt-auth.guard';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    EmailModule,
    UserModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RefreshJwtGuard, WsJwtAuthGuard],
  exports: [JwtAuthGuard, JwtModule, WsJwtAuthGuard],
})
export class AuthModule {}
