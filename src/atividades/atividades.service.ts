/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AtividadesService {
  constructor(private db: DatabaseService) {}

  async findByAluno(id_aluno: bigint) {
    // Ideally we filter by the student's enrolled classes
    return this.db.atividades.findMany();
  }

  async findOne(id: bigint) {
    return this.db.atividades.findUnique({ where: { id_atividade: id } });
  }

  async entregar(id_atividade: bigint, id_aluno: bigint) {
    return this.db.aluno_atividade.create({
      data: {
        id_atividade,
        id_aluno,
        status: 'entregue',
      }
    });
  }

  async corrigir(id_entrega: bigint, nota: number, feedback: string) {
    return this.db.aluno_atividade.update({
      where: { id: id_entrega },
      data: { status: 'corrigido', nota, feedback }
    });
  }
}
