import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { CreateProfessorDisciplinaDto } from './dto/create-professor-disciplina.dto';

@Injectable()
export class MatriculasService {
  constructor(private db: DatabaseService) {}

  async matricular(dto: CreateMatriculaDto) {
    return this.db.matriculas_aluno_disciplina.create({
      data: {
        id_aluno: BigInt(dto.id_aluno),
        id_disciplina: BigInt(dto.id_disciplina),
      },
    });
  }

  async desmatricular(id: bigint) {
    const matricula = await this.db.matriculas_aluno_disciplina.findUnique({ where: { id } });
    if (!matricula) throw new NotFoundException('Matrícula não encontrada');
    return this.db.matriculas_aluno_disciplina.delete({ where: { id } });
  }

  async atribuirTurma(id_aluno: bigint, id_turma: bigint | null) {
    const aluno = await this.db.alunos.findUnique({ where: { id_aluno } });
    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    return this.db.alunos.update({ where: { id_aluno }, data: { id_turma } });
  }

  async vincularProfessor(dto: CreateProfessorDisciplinaDto) {
    return this.db.professor_disciplina.create({
      data: {
        id_professor: BigInt(dto.id_professor),
        id_disciplina: BigInt(dto.id_disciplina),
        semestre: dto.semestre,
      },
    });
  }

  async desvincularProfessor(id: bigint) {
    const vinculo = await this.db.professor_disciplina.findUnique({ where: { id } });
    if (!vinculo) throw new NotFoundException('Vínculo não encontrado');
    return this.db.professor_disciplina.delete({ where: { id } });
  }
}
