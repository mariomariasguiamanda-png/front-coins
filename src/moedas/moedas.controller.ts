/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MoedasService } from './moedas.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('aluno/moedas')
@UseGuards(JwtGuard)
export class MoedasController {
  constructor(private readonly moedasService: MoedasService) {}

  @Get('saldo')
  getSaldo(@Req() req: any) {
    return this.moedasService.getSaldo(req.user.sub);
  }

  @Get('extrato')
  getExtrato(@Req() req: any, @Query('disciplina') disciplinaId: string) {
    return this.moedasService.getExtrato(req.user.sub, BigInt(disciplinaId));
  }

  @Post('comprar-pontos')
  comprarPontos(@Req() req: any, @Body() body: any) {
    return this.moedasService.comprarPontos(
      req.user.sub,
      BigInt(body.id_disciplina),
      Number(body.quantidade_pontos),
    );
  }

  @Get('ranking')
  getRanking(@Query('turma') turmaId: string) {
    return this.moedasService.getRanking(BigInt(turmaId));
  }
}
