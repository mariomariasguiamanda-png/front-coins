import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { NotasService } from './notas.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { SalvarNotaFinalDto } from './dto/salvar-nota-final.dto';

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
  findByProfessor(
    @Query('turma') turmaId: string,
    @Query('disciplina') disciplinaId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.notasService.findByProfessor(BigInt(turmaId), BigInt(disciplinaId), user);
  }

  @Put('professor/notas')
  @Roles('professor')
  salvarNotaFinal(@Body() body: SalvarNotaFinalDto, @CurrentUser() user: AuthUser) {
    return this.notasService.salvarNotaFinal(
      BigInt(body.id_aluno),
      BigInt(body.id_disciplina),
      body.nota_final,
      user,
    );
  }
}
