import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { MailService } from '../common/mail/mail.service';

@Module({
  imports: [DatabaseModule],
  providers: [AuthService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
