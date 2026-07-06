import { Module } from '@nestjs/common';
import { MoedasService } from './moedas.service';
import { MoedasController } from './moedas.controller';
import { DatabaseModule } from '../database/database.module';
import { ProfessorDisciplinaService } from '../common/services/professor-disciplina.service';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';

@Module({
  imports: [DatabaseModule, NotificacoesModule],
  providers: [MoedasService, ProfessorDisciplinaService],
  controllers: [MoedasController],
})
export class MoedasModule {}
