import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export function getEmailConfig(config: ConfigService): MailerOptions {
  return {
    transport: {
      host: config.get<string>('SMTP_HOST'),
      secure: false,
      auth: {
        user: config.get<string>('SMTP_USERNAME'),
        pass: config.get<string>('SMTP_PASSWORD'),
      },
    },
    defaults: {
      from: '"No Reply" <no-reply@messenger.com>',
    },
    template: {
      dir: join(__dirname, '..', 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}
