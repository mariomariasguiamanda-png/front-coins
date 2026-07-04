/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlunosService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.alunos.findMany();
  }

  async findOne(id: bigint) {
    return this.db.alunos.findUnique({ where: { id_aluno: id } });
  }
}
