import { BadRequestException, Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ConfiguracoesService } from './configuracoes.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin/configuracoes')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
export class ConfiguracoesController {
  constructor(private readonly configuracoesService: ConfiguracoesService) {}

  @Get()
  getSettings() {
    return this.configuracoesService.getSettings();
  }

  @Put()
  updateSettings(@Body() body: Record<string, unknown>) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new BadRequestException('Configurações inválidas');
    }
    return this.configuracoesService.updateSettings(body);
  }

  @Post('broadcast')
  broadcast(@Body() body: { titulo?: string; mensagem?: string; categoria?: string }) {
    if (!body?.titulo || !body?.mensagem) {
      throw new BadRequestException('titulo e mensagem são obrigatórios');
    }
    return this.configuracoesService.broadcastParaAlunos(body.titulo, body.mensagem, body.categoria);
  }
}
