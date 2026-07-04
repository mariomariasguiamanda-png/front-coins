import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ResumosService } from './resumos.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@Controller()
@UseGuards(JwtGuard, RolesGuard)
@Roles('aluno')
export class ResumosController {
  constructor(private readonly resumosService: ResumosService) {}

  @Get('aluno/resumos')
  findByAluno(@CurrentUser() user: AuthUser, @Query('disciplina') disciplinaId?: string) {
    return this.resumosService.findByAluno(
      user.id_aluno as number,
      disciplinaId ? BigInt(disciplinaId) : undefined,
    );
  }

  @Get('aluno/resumos/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.resumosService.findOne(BigInt(id), user.id_aluno as number);
  }

  @Post('aluno/resumos/:id/concluir')
  concluir(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.resumosService.concluir(BigInt(id), user.id_aluno as number);
  }
}
