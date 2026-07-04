import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ResumosService {
  constructor(private db: DatabaseService) {}

  async findByAluno(id_aluno: number, id_disciplina?: bigint) {
    const resumos = await this.db.resumos.findMany({
      where: {
        ativo: true,
        ...(id_disciplina !== undefined ? { id_disciplina } : {}),
      },
      include: {
        aluno_resumo: { where: { id_aluno } },
        disciplinas: { select: { nome: true } },
      },
      orderBy: { data_criacao: 'desc' },
    });

    return resumos.map((r) => ({
      ...r,
      status: r.aluno_resumo[0]?.status ?? 'pendente',
      lido_em: r.aluno_resumo[0]?.lido_em ?? null,
      aluno_resumo: undefined,
    }));
  }

  async findOne(id: bigint, id_aluno: number) {
    const resumo = await this.db.resumos.findUnique({
      where: { id_resumo: id },
      include: { aluno_resumo: { where: { id_aluno } } },
    });
    if (!resumo) throw new NotFoundException('Resumo não encontrado');

    return {
      ...resumo,
      status: resumo.aluno_resumo[0]?.status ?? 'pendente',
      lido_em: resumo.aluno_resumo[0]?.lido_em ?? null,
      aluno_resumo: undefined,
    };
  }

  async concluir(id_resumo: bigint, id_aluno: number) {
    const resumo = await this.db.resumos.findUnique({ where: { id_resumo } });
    if (!resumo) throw new NotFoundException('Resumo não encontrado');

    return this.db.aluno_resumo.upsert({
      where: { id_aluno_id_resumo: { id_aluno, id_resumo } },
      create: { id_aluno, id_resumo, status: 'lido', lido_em: new Date() },
      update: { status: 'lido', lido_em: new Date() },
    });
  }
}
