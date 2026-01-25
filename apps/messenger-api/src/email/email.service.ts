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

  async sendVerificationEmail(
    email: string,
    username: string,
    token: string,
  ): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Email Confirmation',
      template: 'verify-email',
      context: {
        username,
        link: `${this.clientBaseUrl}/confirm?token=${token}`,
      },
    });
  }
}
