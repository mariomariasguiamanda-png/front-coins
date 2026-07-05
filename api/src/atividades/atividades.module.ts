import { Module } from '@nestjs/common';
import { AtividadesService } from './atividades.service';
import { AtividadesController } from './atividades.controller';
import { DatabaseModule } from '../database/database.module';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';

@Module({
  imports: [DatabaseModule, NotificacoesModule],
  providers: [AtividadesService],
  controllers: [AtividadesController]
})
export class AtividadesModule {}
