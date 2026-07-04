import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { MoedasModule } from './moedas/moedas.module';
import { DisciplinasModule } from './disciplinas/disciplinas.module';
import { AtividadesModule } from './atividades/atividades.module';
import { NotasModule } from './notas/notas.module';
import { AlunosModule } from './alunos/alunos.module';
import { ProfessoresModule } from './professores/professores.module';
import { TurmasModule } from './turmas/turmas.module';
import { ResumosModule } from './resumos/resumos.module';
import { VideoaulasModule } from './videoaulas/videoaulas.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    MoedasModule,
    DisciplinasModule,
    AtividadesModule,
    NotasModule,
    AlunosModule,
    ProfessoresModule,
    TurmasModule,
    ResumosModule,
    VideoaulasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
