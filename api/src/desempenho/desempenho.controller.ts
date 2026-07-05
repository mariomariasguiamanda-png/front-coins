import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DesempenhoService } from './desempenho.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@Controller()
@UseGuards(JwtGuard, RolesGuard)
export class DesempenhoController {
  constructor(private readonly desempenhoService: DesempenhoService) {}

  @Get('professor/desempenho')
  @Roles('professor')
  getDesempenho(
    @Query('disciplina') disciplinaId: string | undefined,
    @Query('turma') turmaId: string | undefined,
    @CurrentUser() user: AuthUser,
  ) {
    if (!disciplinaId) {
      return this.desempenhoService.getVisaoGeral(user);
    }

    return this.desempenhoService.getDesempenho(
      BigInt(disciplinaId),
      turmaId ? BigInt(turmaId) : undefined,
      user,
    );
  }
}
