import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TurmasService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.turmas.findMany();
  }

  async findOne(id: bigint) {
    const turma = await this.db.turmas.findUnique({ where: { id_turma: id } });
    if (!turma) throw new NotFoundException('Turma não encontrada');
    return turma;
  }
}
