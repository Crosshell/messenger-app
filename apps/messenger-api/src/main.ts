import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  const clientUrl = config.getOrThrow<string>('CLIENT_BASE_URL');

  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
