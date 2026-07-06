import { Module } from '@nestjs/common';
import { ConfiguracoesService } from './configuracoes.service';
import { ConfiguracoesController } from './configuracoes.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ConfiguracoesService],
  controllers: [ConfiguracoesController],
})
export class ConfiguracoesModule {}
