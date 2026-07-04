import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlunosService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.alunos.findMany();
  }

  async findOne(id: bigint) {
    const aluno = await this.db.alunos.findUnique({ where: { id_aluno: id } });
    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    return aluno;
  }
}
