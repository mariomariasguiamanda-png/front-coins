import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { DatabaseModule } from '../database/database.module';
import { MailService } from '../common/mail/mail.service';

@Module({
  imports: [DatabaseModule],
  providers: [UsuariosService, MailService],
  controllers: [UsuariosController],
})
export class UsuariosModule {}
