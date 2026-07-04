import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DisciplinasService } from './disciplinas.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';

@Controller()
@UseGuards(JwtGuard, RolesGuard)
export class DisciplinasController {
  constructor(private readonly disciplinasService: DisciplinasService) {}

  @Get('disciplinas')
  findAll() {
    return this.disciplinasService.findAll();
  }

  @Get('aluno/disciplinas')
  @Roles('aluno')
  findByAluno(@CurrentUser() user: AuthUser) {
    return this.disciplinasService.findByAluno(user.id_aluno as number);
  }

  @Get('disciplinas/:id')
  findOne(@Param('id') id: string) {
    return this.disciplinasService.findOne(BigInt(id));
  }

  @Post('admin/disciplinas')
  @Roles('admin')
  create(@Body() body: CreateDisciplinaDto) {
    return this.disciplinasService.create(body);
  }

  @Patch('admin/disciplinas/:id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() body: UpdateDisciplinaDto) {
    return this.disciplinasService.update(BigInt(id), body);
  }

  @Delete('admin/disciplinas/:id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.disciplinasService.remove(BigInt(id));
  }
}
