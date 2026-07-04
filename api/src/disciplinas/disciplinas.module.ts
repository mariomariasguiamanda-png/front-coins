import { Module } from '@nestjs/common';
import { DisciplinasService } from './disciplinas.service';
import { DisciplinasController } from './disciplinas.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DisciplinasService],
  controllers: [DisciplinasController]
})
export class DisciplinasModule {}
