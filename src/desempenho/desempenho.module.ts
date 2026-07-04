import { Module } from '@nestjs/common';
import { DesempenhoService } from './desempenho.service';
import { DesempenhoController } from './desempenho.controller';
import { DatabaseModule } from '../database/database.module';
import { ProfessorDisciplinaService } from '../common/services/professor-disciplina.service';

@Module({
  imports: [DatabaseModule],
  providers: [DesempenhoService, ProfessorDisciplinaService],
  controllers: [DesempenhoController],
})
export class DesempenhoModule {}
