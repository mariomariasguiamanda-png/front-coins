import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { VideoaulasService } from './videoaulas.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { ProgressoVideoaulaDto } from './dto/progresso-videoaula.dto';

@Controller()
@UseGuards(JwtGuard, RolesGuard)
@Roles('aluno')
export class VideoaulasController {
  constructor(private readonly videoaulasService: VideoaulasService) {}

  @Get('aluno/videoaulas')
  findByAluno(@CurrentUser() user: AuthUser, @Query('disciplina') disciplinaId?: string) {
    return this.videoaulasService.findByAluno(
      user.id_aluno as number,
      disciplinaId ? BigInt(disciplinaId) : undefined,
    );
  }

  @Get('aluno/videoaulas/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.videoaulasService.findOne(BigInt(id), user.id_aluno as number);
  }

  @Patch('aluno/videoaulas/:id/progresso')
  atualizarProgresso(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: ProgressoVideoaulaDto,
  ) {
    return this.videoaulasService.atualizarProgresso(
      BigInt(id),
      user.id_aluno as number,
      body.percentual_assistido,
    );
  }
}
