import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AtividadesService } from './atividades.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { EntregarAtividadeDto } from './dto/entregar-atividade.dto';
import { CorrigirAtividadeDto } from './dto/corrigir-atividade.dto';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { CreateQuestaoDto } from './dto/create-questao.dto';
import { UpdateQuestaoDto } from './dto/update-questao.dto';

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
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.atividadesService.findOne(BigInt(id), user);
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

  @Get('professor/atividades')
  @Roles('professor')
  findByProfessor(@CurrentUser() user: AuthUser, @Query('disciplina') disciplinaId?: string) {
    return this.atividadesService.findByProfessor(
      user.id_professor as number,
      disciplinaId ? BigInt(disciplinaId) : undefined,
    );
  }

  @Get('professor/atividades/:id/entregas')
  @Roles('professor')
  findEntregas(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.atividadesService.findEntregas(BigInt(id), user.id_professor as number);
  }

  @Post('professor/atividades')
  @Roles('professor')
  createAtividade(@Body() body: CreateAtividadeDto, @CurrentUser() user: AuthUser) {
    return this.atividadesService.createAtividade(body, user);
  }

  @Patch('professor/atividades/:id')
  @Roles('professor')
  updateAtividade(
    @Param('id') id: string,
    @Body() body: UpdateAtividadeDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.atividadesService.updateAtividade(BigInt(id), body, user);
  }

  @Delete('professor/atividades/:id')
  @Roles('professor')
  removeAtividade(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.atividadesService.removeAtividade(BigInt(id), user);
  }

  @Post('professor/atividades/:id/questoes')
  @Roles('professor')
  createQuestao(
    @Param('id') id: string,
    @Body() body: CreateQuestaoDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.atividadesService.createQuestao(BigInt(id), body, user);
  }

  @Patch('professor/questoes/:id')
  @Roles('professor')
  updateQuestao(
    @Param('id') id: string,
    @Body() body: UpdateQuestaoDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.atividadesService.updateQuestao(BigInt(id), body, user);
  }

  @Delete('professor/questoes/:id')
  @Roles('professor')
  removeQuestao(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.atividadesService.removeQuestao(BigInt(id), user);
  }
}
