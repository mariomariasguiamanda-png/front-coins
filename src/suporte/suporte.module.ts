import { Module } from '@nestjs/common';
import { SuporteService } from './suporte.service';
import { SuporteController } from './suporte.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [SuporteService],
  controllers: [SuporteController],
})
export class SuporteModule {}
