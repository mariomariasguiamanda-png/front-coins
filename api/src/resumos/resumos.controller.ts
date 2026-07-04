import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResumosService } from './resumos.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { CreateResumoDto } from './dto/create-resumo.dto';
import { UpdateResumoDto } from './dto/update-resumo.dto';

@Controller()
@UseGuards(JwtGuard, RolesGuard)
export class ResumosController {
  constructor(private readonly resumosService: ResumosService) {}

  @Get('aluno/resumos')
  @Roles('aluno')
  findByAluno(@CurrentUser() user: AuthUser, @Query('disciplina') disciplinaId?: string) {
    return this.resumosService.findByAluno(
      user.id_aluno as number,
      disciplinaId ? BigInt(disciplinaId) : undefined,
    );
  }

  @Get('aluno/resumos/:id')
  @Roles('aluno')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.resumosService.findOne(BigInt(id), user.id_aluno as number);
  }

  @Post('aluno/resumos/:id/concluir')
  @Roles('aluno')
  concluir(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.resumosService.concluir(BigInt(id), user.id_aluno as number);
  }

  @Get('professor/resumos')
  @Roles('professor')
  findByProfessor(@CurrentUser() user: AuthUser) {
    return this.resumosService.findByProfessor(user.id_professor as number);
  }

  @Post('professor/resumos')
  @Roles('professor')
  create(@Body() body: CreateResumoDto, @CurrentUser() user: AuthUser) {
    return this.resumosService.create(body, user);
  }

  @Patch('professor/resumos/:id')
  @Roles('professor')
  update(
    @Param('id') id: string,
    @Body() body: UpdateResumoDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.resumosService.update(BigInt(id), body, user);
  }

  @Delete('professor/resumos/:id')
  @Roles('professor')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.resumosService.remove(BigInt(id), user);
  }
}
