import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { TokenModule } from './token/token.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    UserModule,
    AuthModule,
    PrismaModule,
    EmailModule,
    TokenModule,
  ],
})
export class AppModule {}
