import { Module } from '@nestjs/common';
import { VideoaulasService } from './videoaulas.service';
import { VideoaulasController } from './videoaulas.controller';
import { DatabaseModule } from '../database/database.module';
import { ProfessorDisciplinaService } from '../common/services/professor-disciplina.service';

@Module({
  imports: [DatabaseModule],
  providers: [VideoaulasService, ProfessorDisciplinaService],
  controllers: [VideoaulasController],
})
export class VideoaulasModule {}
