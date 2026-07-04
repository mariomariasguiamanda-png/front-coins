/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AtividadesService } from './atividades.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller()
@UseGuards(JwtGuard)
export class AtividadesController {
  constructor(private readonly atividadesService: AtividadesService) {}

  @Get('aluno/atividades')
  findByAluno(@Req() req: any) {
    return this.atividadesService.findByAluno(req.user.sub);
  }

  @Get('aluno/atividades/:id')
  findOne(@Param('id') id: string) {
    return this.atividadesService.findOne(BigInt(id));
  }

  @Post('aluno/atividades/:id/entregar')
  entregar(@Param('id') id: string, @Req() req: any) {
    return this.atividadesService.entregar(BigInt(id), req.user.sub);
  }

  @Post('professor/atividades/:id/corrigir')
  corrigir(@Param('id') id: string, @Body() body: any) {
    return this.atividadesService.corrigir(BigInt(id), Number(body.nota), body.feedback);
  }
}
