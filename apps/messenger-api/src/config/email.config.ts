import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export function getEmailConfig(config: ConfigService): MailerOptions {
  return {
    transport: {
      service: config.getOrThrow<string>('email.service'),
      secure: false,
      auth: {
        user: config.getOrThrow<string>('email.user'),
        pass: config.getOrThrow<string>('email.password'),
      },
    },
    defaults: {
      from: '"No Reply" <no-reply@messenger.com>',
    },
    template: {
      dir: join(process.cwd(), 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}
