import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './interfaces/modules/app.module';
import { ConfigService } from '@nestjs/config';
import { AppPostgreSQLDataSource } from './infrastructure/persistence/typeorm/data-source';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3002);
    await app.listen(port);
  } catch (error) {
    console.error('🚫 Ошибка при запуске сервера:', error);
    throw error;
  }
  await AppPostgreSQLDataSource.initialize();
  console.log('✅ Database connected');
}

void bootstrap().catch((err) =>
  setTimeout(() => {
    throw err;
  }),
);
