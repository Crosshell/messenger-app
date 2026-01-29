import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export function getEmailConfig(config: ConfigService): MailerOptions {
  return {
    transport: {
      host: config.getOrThrow<string>('email.host'),
      port: config.getOrThrow<number>('email.port'),
      secure: config.get<boolean>('email.secure'),
      auth: {
        user: config.getOrThrow<string>('email.user'),
        pass: config.getOrThrow<string>('email.password'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
    defaults: {
      from: `"No Reply" <${config.getOrThrow('email.from')}>`,
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
