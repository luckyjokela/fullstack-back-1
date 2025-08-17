import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './interfaces/modules/app.module';
import { ConfigService } from '@nestjs/config';
import { AppPostgreSQLDataSource } from './infrastructure/persistence/typeorm/data-source';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await AppPostgreSQLDataSource.initialize();
    console.log('✅ Database connected');
    const configService = app.get(ConfigService);
    app.enableCors({
      origin: `${configService.get<string>('HOST')}${configService.get<number>('PORT')}`,
      credentials: true,
    });
    const port = configService.get<number>('PORT', 3002);
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
