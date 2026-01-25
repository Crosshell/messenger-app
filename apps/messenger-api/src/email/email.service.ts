import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly clientBaseUrl: string;

  constructor(
    private mailer: MailerService,
    private config: ConfigService,
  ) {
    this.clientBaseUrl = this.config.getOrThrow<string>('CLIENT_BASE_URL');
  }
}
