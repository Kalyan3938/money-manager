import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips out unknown properties
      // forbidNonWhitelisted: true, // throws error if unknown fields are sent
      transform: true, // converts payloads to DTO instances
      forbidUnknownValues: true, // (optional) catches completely missing payloads
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('app.port')!);
}

bootstrap();
