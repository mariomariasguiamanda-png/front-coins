/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class NotasService {
  constructor(private db: DatabaseService) {}

  async findByAluno(id_aluno: bigint) {
    return this.db.notas_finais.findMany({ where: { id_aluno } });
  }

  async findByProfessor(id_turma: bigint, id_disciplina: bigint) {
    return this.db.notas_finais.findMany({
      where: { id_disciplina, alunos: { id_turma } },
      include: { alunos: { select: { usuarios: { select: { nome: true } } } } }
    });
  }
}
