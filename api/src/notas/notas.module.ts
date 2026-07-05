import { Module } from '@nestjs/common';
import { NotasService } from './notas.service';
import { NotasController } from './notas.controller';
import { DatabaseModule } from '../database/database.module';
import { ProfessorDisciplinaService } from '../common/services/professor-disciplina.service';

@Module({
  imports: [DatabaseModule],
  providers: [NotasService, ProfessorDisciplinaService],
  controllers: [NotasController]
})
export class NotasModule {}
