import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NotasService } from './notas.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@Controller()
@UseGuards(JwtGuard, RolesGuard)
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Get('aluno/notas')
  @Roles('aluno')
  findByAluno(@CurrentUser() user: AuthUser) {
    return this.notasService.findByAluno(user.id_aluno as number);
  }

  @Get('professor/notas')
  @Roles('professor')
  findByProfessor(@Query('turma') turmaId: string, @Query('disciplina') disciplinaId: string) {
    return this.notasService.findByProfessor(BigInt(turmaId), BigInt(disciplinaId));
  }
}
