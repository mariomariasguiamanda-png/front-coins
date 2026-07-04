import { Module } from '@nestjs/common';
import { ResumosService } from './resumos.service';
import { ResumosController } from './resumos.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ResumosService],
  controllers: [ResumosController],
})
export class ResumosModule {}
