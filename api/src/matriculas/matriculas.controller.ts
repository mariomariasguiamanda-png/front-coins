import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { AtribuirTurmaDto } from './dto/atribuir-turma.dto';
import { CreateProfessorDisciplinaDto } from './dto/create-professor-disciplina.dto';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
export class MatriculasController {
  constructor(private readonly matriculasService: MatriculasService) {}

  @Post('matriculas')
  matricular(@Body() body: CreateMatriculaDto) {
    return this.matriculasService.matricular(body);
  }

  @Delete('matriculas/:id')
  desmatricular(@Param('id') id: string) {
    return this.matriculasService.desmatricular(BigInt(id));
  }

  @Patch('alunos/:id/turma')
  atribuirTurma(@Param('id') id: string, @Body() body: AtribuirTurmaDto) {
    return this.matriculasService.atribuirTurma(
      BigInt(id),
      body.id_turma ? BigInt(body.id_turma) : null,
    );
  }

  @Post('professor-disciplina')
  vincularProfessor(@Body() body: CreateProfessorDisciplinaDto) {
    return this.matriculasService.vincularProfessor(body);
  }

  @Delete('professor-disciplina/:id')
  desvincularProfessor(@Param('id') id: string) {
    return this.matriculasService.desvincularProfessor(BigInt(id));
  }
}
