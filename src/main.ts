import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './interfaces/modules/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);
    await app.listen(port);
  } catch (error) {
    console.error('🚫 Ошибка при запуске сервера:', error);
    throw error;
  }
}

void bootstrap().catch((err) =>
  setTimeout(() => {
    throw err;
  }),
);
