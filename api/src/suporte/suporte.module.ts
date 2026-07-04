import { Module } from '@nestjs/common';
import { SuporteService } from './suporte.service';
import { SuporteController } from './suporte.controller';
import { DatabaseModule } from '../database/database.module';
import { MailService } from '../common/mail/mail.service';

@Module({
  imports: [DatabaseModule],
  providers: [SuporteService, MailService],
  controllers: [SuporteController],
})
export class SuporteModule {}
