import { Controller, Get, UseGuards } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin/relatorios')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('alunos')
  relatorioAlunos() {
    return this.relatoriosService.relatorioAlunos();
  }

  @Get('turmas')
  relatorioTurmas() {
    return this.relatoriosService.relatorioTurmas();
  }
}
