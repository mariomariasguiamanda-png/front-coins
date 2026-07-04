import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AgendaEstudosService } from './agenda-estudos.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { CreateAgendaEventoDto } from './dto/create-agenda-evento.dto';

@Controller('aluno/agenda')
@UseGuards(JwtGuard, RolesGuard)
@Roles('aluno')
export class AgendaEstudosController {
  constructor(private readonly agendaEstudosService: AgendaEstudosService) {}

  @Get()
  findByAluno(@CurrentUser() user: AuthUser) {
    return this.agendaEstudosService.findByAluno(user.id_aluno as number);
  }

  @Post()
  criar(@CurrentUser() user: AuthUser, @Body() body: CreateAgendaEventoDto) {
    return this.agendaEstudosService.criar(user.id_aluno as number, body);
  }

  @Patch(':id/concluir')
  concluir(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.agendaEstudosService.concluir(BigInt(id), user.id_aluno as number);
  }
}
