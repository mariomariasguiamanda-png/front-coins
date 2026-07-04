import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SuporteService } from './suporte.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { CreateChamadoDto } from './dto/create-chamado.dto';
import { ResponderChamadoDto } from './dto/responder-chamado.dto';
import { UpdateStatusChamadoDto } from './dto/update-status-chamado.dto';

@Controller()
@UseGuards(JwtGuard, RolesGuard)
export class SuporteController {
  constructor(private readonly suporteService: SuporteService) {}

  @Post('suporte/chamados')
  @Roles('aluno', 'professor', 'admin')
  criarChamado(@CurrentUser() user: AuthUser, @Body() body: CreateChamadoDto) {
    return this.suporteService.criarChamado(user.sub, body);
  }

  @Get('suporte/chamados')
  @Roles('aluno', 'professor', 'admin')
  meusChamados(@CurrentUser() user: AuthUser) {
    return this.suporteService.findMeusChamados(user.sub);
  }

  @Get('admin/suporte/chamados')
  @Roles('admin')
  findAll(@Query('status') status?: string) {
    return this.suporteService.findAll(status);
  }

  @Patch('admin/suporte/chamados/:id/responder')
  @Roles('admin')
  responder(@Param('id') id: string, @Body() body: ResponderChamadoDto) {
    return this.suporteService.responder(BigInt(id), body);
  }

  @Patch('admin/suporte/chamados/:id/status')
  @Roles('admin')
  atualizarStatus(@Param('id') id: string, @Body() body: UpdateStatusChamadoDto) {
    return this.suporteService.atualizarStatus(BigInt(id), body);
  }
}
