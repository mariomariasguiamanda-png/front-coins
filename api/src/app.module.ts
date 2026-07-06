import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
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
import { PerfilModule } from './perfil/perfil.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { DesempenhoModule } from './desempenho/desempenho.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MatriculasModule } from './matriculas/matriculas.module';
import { SuporteModule } from './suporte/suporte.module';
import { LogsModule } from './logs/logs.module';
import { AgendaEstudosModule } from './agenda-estudos/agenda-estudos.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfiguracoesModule } from './configuracoes/configuracoes.module';
import { RelatoriosModule } from './relatorios/relatorios.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // process.cwd() (raiz do projeto), não __dirname: __dirname aponta pra
      // dist/src em runtime, então join(__dirname, '..', 'uploads') resolvia
      // pra dist/uploads (inexistente) em vez da pasta uploads/ real na raiz.
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
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
    PerfilModule,
    NotificacoesModule,
    DesempenhoModule,
    UsuariosModule,
    MatriculasModule,
    SuporteModule,
    LogsModule,
    AgendaEstudosModule,
    DashboardModule,
    ConfiguracoesModule,
    RelatoriosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
