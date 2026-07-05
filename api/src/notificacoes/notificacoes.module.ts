import { Module } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { NotificacoesController } from './notificacoes.controller';
import { DatabaseModule } from '../database/database.module';
import { MailService } from '../common/mail/mail.service';

@Module({
  imports: [DatabaseModule],
  providers: [NotificacoesService, MailService],
  controllers: [NotificacoesController],
  exports: [NotificacoesService],
})
export class NotificacoesModule {}
