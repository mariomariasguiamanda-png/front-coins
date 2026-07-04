import { Module } from '@nestjs/common';
import { MoedasService } from './moedas.service';
import { MoedasController } from './moedas.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MoedasService],
  controllers: [MoedasController],
})
export class MoedasModule {}
