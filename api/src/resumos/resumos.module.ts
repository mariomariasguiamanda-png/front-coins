import { Module } from '@nestjs/common';
import { ResumosService } from './resumos.service';
import { ResumosController } from './resumos.controller';
import { DatabaseModule } from '../database/database.module';
import { ProfessorDisciplinaService } from '../common/services/professor-disciplina.service';

@Module({
  imports: [DatabaseModule],
  providers: [ResumosService, ProfessorDisciplinaService],
  controllers: [ResumosController],
})
export class ResumosModule {}
