import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './interfaces/modules/app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppPostgreSQLDataSource } from './infrastructure/persistence/typeorm/data-source';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await AppPostgreSQLDataSource.initialize();
    console.log('✅ Database connected');

    const configService = app.get(ConfigService);

    const origin = `http://localhost:3000`;

    app.enableCors({
      origin,
      credentials: true,
    });
    app.use(cookieParser);
    const port = configService.get<number>('PORT', 3001);
    await app.listen(port);
    console.log(`🚀 Server running on port ${port}`);
  } catch (error) {
    console.error('🚫 Ошибка при запуске сервера:', error);
    throw error;
  }
}

void bootstrap();
