import { Controller, Get, Post, Put, Body, UseGuards, Query } from '@nestjs/common';
import { MoedasService } from './moedas.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { ComprarPontosDto } from './dto/comprar-pontos.dto';
import { AjusteMoedasDto } from './dto/ajuste-moedas.dto';
import { ConfigPrecoDto } from './dto/config-preco.dto';

@Controller()
@UseGuards(JwtGuard, RolesGuard)
export class MoedasController {
  constructor(private readonly moedasService: MoedasService) {}

  @Get('aluno/moedas/saldo')
  @Roles('aluno')
  getSaldo(@CurrentUser() user: AuthUser) {
    return this.moedasService.getSaldo(user.id_aluno as number);
  }

  @Get('aluno/moedas/extrato')
  @Roles('aluno')
  getExtrato(@CurrentUser() user: AuthUser, @Query('disciplina') disciplinaId: string) {
    return this.moedasService.getExtrato(user.id_aluno as number, BigInt(disciplinaId));
  }

  @Post('aluno/moedas/comprar-pontos')
  @Roles('aluno')
  comprarPontos(@CurrentUser() user: AuthUser, @Body() body: ComprarPontosDto) {
    return this.moedasService.comprarPontos(
      user.id_aluno as number,
      BigInt(body.id_disciplina),
      body.quantidade_pontos,
    );
  }

  @Get('aluno/moedas/ranking')
  @Roles('aluno')
  getRanking(@Query('turma') turmaId: string) {
    return this.moedasService.getRanking(BigInt(turmaId));
  }

  @Get('aluno/moedas/preco-pontos')
  @Roles('aluno')
  getPrecoPontos(@Query('disciplina') disciplinaId: string) {
    return this.moedasService.getPrecoPontos(BigInt(disciplinaId));
  }

  @Put('professor/moedas/config-preco')
  @Roles('professor')
  setConfigPreco(@Body() body: ConfigPrecoDto, @CurrentUser() user: AuthUser) {
    return this.moedasService.setConfigPreco(body, user);
  }

  @Post('admin/moedas/ajuste')
  @Roles('admin')
  ajuste(@Body() body: AjusteMoedasDto, @CurrentUser() user: AuthUser) {
    return this.moedasService.ajuste(
      BigInt(body.id_aluno),
      BigInt(body.id_disciplina),
      body.quantidade,
      body.motivo,
      user,
    );
  }
}
