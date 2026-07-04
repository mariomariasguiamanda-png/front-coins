import { Module } from '@nestjs/common';
import { AgendaEstudosService } from './agenda-estudos.service';
import { AgendaEstudosController } from './agenda-estudos.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AgendaEstudosService],
  controllers: [AgendaEstudosController],
})
export class AgendaEstudosModule {}
