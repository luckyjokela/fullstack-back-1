import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AuthModule } from '../../auth/modules/auth.module';
import { UserModule } from './user.module';
@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
