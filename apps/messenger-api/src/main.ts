import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  const clientUrl = config.getOrThrow<string>('clientBaseUrl');

  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });

  app.use(cookieParser(config.getOrThrow<string>('cookie.secret')));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const port = config.getOrThrow<number>('port');
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
