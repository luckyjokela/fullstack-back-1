import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './interfaces/modules/app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
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
