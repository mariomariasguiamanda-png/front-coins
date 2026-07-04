/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Req, Query, UseGuards } from '@nestjs/common';
import { NotasService } from './notas.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller()
@UseGuards(JwtGuard)
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Get('aluno/notas')
  findByAluno(@Req() req: any) {
    return this.notasService.findByAluno(req.user.sub);
  }

  @Get('professor/notas')
  findByProfessor(@Query('turma') turmaId: string, @Query('disciplina') disciplinaId: string) {
    return this.notasService.findByProfessor(BigInt(turmaId), BigInt(disciplinaId));
  }
}
