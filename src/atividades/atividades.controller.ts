import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AtividadesService } from './atividades.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { EntregarAtividadeDto } from './dto/entregar-atividade.dto';
import { CorrigirAtividadeDto } from './dto/corrigir-atividade.dto';

@Controller()
@UseGuards(JwtGuard, RolesGuard)
export class AtividadesController {
  constructor(private readonly atividadesService: AtividadesService) {}

  @Get('aluno/atividades')
  @Roles('aluno')
  findByAluno(@CurrentUser() user: AuthUser) {
    return this.atividadesService.findByAluno(user.id_aluno as number);
  }

  @Get('aluno/atividades/:id')
  @Roles('aluno', 'professor')
  findOne(@Param('id') id: string) {
    return this.atividadesService.findOne(BigInt(id));
  }

  @Post('aluno/atividades/:id/entregar')
  @Roles('aluno')
  entregar(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: EntregarAtividadeDto,
  ) {
    return this.atividadesService.entregar(BigInt(id), user.id_aluno as number, body);
  }

  @Post('professor/atividades/:id/corrigir')
  @Roles('professor')
  corrigir(
    @Param('id') id: string,
    @Body() body: CorrigirAtividadeDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.atividadesService.corrigir(
      BigInt(id),
      Number(body.id_aluno),
      body.nota,
      body.feedback,
      user,
    );
  }
}
