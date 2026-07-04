/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TurmasService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.turmas.findMany();
  }

  async findOne(id: bigint) {
    return this.db.turmas.findUnique({ where: { id_turma: id } });
  }
}
