import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AdminModule } from './admin.module';
import { AuthModule } from '../../auth/modules/auth.module';
import { UserModule } from './user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AdminModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
