import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificacoesService } from './notificacoes.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@Controller('aluno/notificacoes')
@UseGuards(JwtGuard, RolesGuard)
@Roles('aluno')
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Get()
  findByUsuario(@CurrentUser() user: AuthUser) {
    return this.notificacoesService.findByUsuario(user.sub);
  }

  @Patch('lidas-todas')
  marcarTodasLidas(@CurrentUser() user: AuthUser) {
    return this.notificacoesService.marcarTodasLidas(user.sub);
  }

  @Patch(':id/lida')
  marcarLida(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.notificacoesService.marcarLida(BigInt(id), user.sub);
  }
}
