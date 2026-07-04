import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DisciplinasService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.disciplinas.findMany();
  }

  async findByAluno(id_aluno: number) {
    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: { id_aluno },
      include: { disciplinas: true },
    });
    return matriculas.map((m) => ({
      ...m.disciplinas,
      id_disciplina: Number(m.disciplinas.id_disciplina),
    }));
  }

  async findOne(id: bigint) {
    const disciplina = await this.db.disciplinas.findUnique({
      where: { id_disciplina: id },
    });
    if (!disciplina) throw new NotFoundException('Disciplina não encontrada');
    return disciplina;
  }
}
