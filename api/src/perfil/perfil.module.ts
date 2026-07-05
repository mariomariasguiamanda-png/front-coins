import { Module } from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { PerfilController } from './perfil.controller';
import { ProfessorPerfilController } from './professor-perfil.controller';
import { AdminPerfilController } from './admin-perfil.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PerfilService],
  controllers: [PerfilController, ProfessorPerfilController, AdminPerfilController],
})
export class PerfilModule {}
