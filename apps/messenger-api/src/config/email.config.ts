import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export function getEmailConfig(config: ConfigService): MailerOptions {
  return {
    transport: {
      service: config.getOrThrow<string>('SMTP_SERVICE'),
      secure: false,
      auth: {
        user: config.getOrThrow<string>('SMTP_USERNAME'),
        pass: config.getOrThrow<string>('SMTP_PASSWORD'),
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
