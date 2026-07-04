/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DisciplinasService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.disciplinas.findMany();
  }

  async findByAluno(id_aluno: bigint) {
    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: { id_aluno },
      include: { disciplinas: true }
    });
    return matriculas.map(m => ({...m.disciplinas, id_disciplina: Number(m.disciplinas.id_disciplina)}));
  }

  async findOne(id: bigint) {
    return this.db.disciplinas.findUnique({ where: { id_disciplina: id } });
  }
}
