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

    const configService = app.get(ConfigService);

    const origin = `http://localhost:3000`;

    app.enableCors({
      origin,
      credentials: true,
    });
    app.use(cookieParser());
    // app.setGlobalPrefix(configService.get<string>('API_PREFIX', '/api'));
    const port = configService.get<number>('PORT', 3001);
    const nginxIp = configService.get<string>('localIp', '0.0.0.0');
    await app.listen(port, nginxIp);
  } catch (error) {
    console.error('🚫 Ошибка при запуске сервера:', error);
    throw error;
  }
}

void bootstrap();
