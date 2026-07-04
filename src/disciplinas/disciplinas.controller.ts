/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { DisciplinasService } from './disciplinas.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller()
@UseGuards(JwtGuard)
export class DisciplinasController {
  constructor(private readonly disciplinasService: DisciplinasService) {}

  @Get('disciplinas')
  findAll() {
    return this.disciplinasService.findAll();
  }

  @Get('aluno/disciplinas')
  findByAluno(@Req() req: any) {
    return this.disciplinasService.findByAluno(req.user.sub);
  }

  @Get('disciplinas/:id')
  findOne(@Param('id') id: string) {
    return this.disciplinasService.findOne(BigInt(id));
  }
}
