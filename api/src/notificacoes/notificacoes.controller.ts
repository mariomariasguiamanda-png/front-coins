import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@Controller()
@UseGuards(JwtGuard, RolesGuard)
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  // Rotas genéricas: valem para qualquer papel logado (o sino do admin usa
  // estas). A sincronização de alertas de prazo/revisão só se aplica a aluno.
  @Get('notificacoes')
  @Roles('aluno', 'professor', 'admin')
  async findMinhas(@CurrentUser() user: AuthUser) {
    if (user.tipo_usuario === 'aluno') {
      await this.notificacoesService.sincronizarAlertasAluno(user);
    }
    return this.notificacoesService.findByUsuario(user.sub);
  }

  @Patch('notificacoes/lidas-todas')
  @Roles('aluno', 'professor', 'admin')
  marcarTodasLidasGenerico(@CurrentUser() user: AuthUser) {
    return this.notificacoesService.marcarTodasLidas(user.sub);
  }

  @Patch('notificacoes/:id/lida')
  @Roles('aluno', 'professor', 'admin')
  marcarLidaGenerico(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.notificacoesService.marcarLida(BigInt(id), user.sub);
  }

  // Rotas antigas do aluno mantidas por compatibilidade com clients já publicados
  @Get('aluno/notificacoes')
  @Roles('aluno')
  async findByUsuario(@CurrentUser() user: AuthUser) {
    await this.notificacoesService.sincronizarAlertasAluno(user);
    return this.notificacoesService.findByUsuario(user.sub);
  }

  @Patch('aluno/notificacoes/lidas-todas')
  @Roles('aluno')
  marcarTodasLidas(@CurrentUser() user: AuthUser) {
    return this.notificacoesService.marcarTodasLidas(user.sub);
  }

  @Patch('aluno/notificacoes/:id/lida')
  @Roles('aluno')
  marcarLida(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.notificacoesService.marcarLida(BigInt(id), user.sub);
  }
}
