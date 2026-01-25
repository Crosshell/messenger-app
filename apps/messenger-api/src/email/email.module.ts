import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { getEmailConfig } from '../config/email.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: getEmailConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
