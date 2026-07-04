import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { CreateVideoaulaDto } from './dto/create-videoaula.dto';
import { UpdateVideoaulaDto } from './dto/update-videoaula.dto';

@Controller()
@UseGuards(JwtGuard, RolesGuard)
export class VideoaulasController {
  constructor(private readonly videoaulasService: VideoaulasService) {}

  @Get('aluno/videoaulas')
  @Roles('aluno')
  findByAluno(@CurrentUser() user: AuthUser, @Query('disciplina') disciplinaId?: string) {
    return this.videoaulasService.findByAluno(
      user.id_aluno as number,
      disciplinaId ? BigInt(disciplinaId) : undefined,
    );
  }

  @Get('aluno/videoaulas/:id')
  @Roles('aluno')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.videoaulasService.findOne(BigInt(id), user.id_aluno as number);
  }

  @Patch('aluno/videoaulas/:id/progresso')
  @Roles('aluno')
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

  @Get('professor/videoaulas')
  @Roles('professor')
  findByProfessor(@CurrentUser() user: AuthUser) {
    return this.videoaulasService.findByProfessor(user.id_professor as number);
  }

  @Post('professor/videoaulas')
  @Roles('professor')
  create(@Body() body: CreateVideoaulaDto, @CurrentUser() user: AuthUser) {
    return this.videoaulasService.create(body, user);
  }

  @Patch('professor/videoaulas/:id')
  @Roles('professor')
  update(
    @Param('id') id: string,
    @Body() body: UpdateVideoaulaDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.videoaulasService.update(BigInt(id), body, user);
  }

  @Delete('professor/videoaulas/:id')
  @Roles('professor')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.videoaulasService.remove(BigInt(id), user);
  }
}
