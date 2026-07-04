import { Module } from '@nestjs/common';
import { VideoaulasService } from './videoaulas.service';
import { VideoaulasController } from './videoaulas.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [VideoaulasService],
  controllers: [VideoaulasController],
})
export class VideoaulasModule {}
