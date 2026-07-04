import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { AuthUser } from '../common/types/auth-user';

@Injectable()
export class MoedasService {
  constructor(private db: DatabaseService) {}

  async getSaldo(id_aluno: number) {
    const saldos = await this.db.moedas_saldo.findMany({
      where: { id_aluno },
      include: { disciplinas: true },
    });
    return {
      disciplinas: saldos.map((s) => ({
        id_disciplina: Number(s.id_disciplina),
        nome: s.disciplinas.nome,
        saldo: s.saldo,
      })),
    };
  }

  async getExtrato(id_aluno: number, id_disciplina: bigint) {
    const transacoes = await this.db.transacoes_moedas.findMany({
      where: { id_aluno, id_disciplina },
      orderBy: { criado_em: 'desc' },
    });
    return {
      transacoes: transacoes.map((t) => ({
        ...t,
        id_transacao: Number(t.id_transacao),
        id_aluno: Number(t.id_aluno),
        id_disciplina: Number(t.id_disciplina),
      })),
    };
  }

  async getRanking(id_turma: bigint) {
    const alunos = await this.db.alunos.findMany({
      where: { id_turma },
      include: {
        usuarios: { select: { nome: true } },
        moedas_saldo: { select: { saldo: true } },
      },
    });

    const ranking = alunos
      .map((a) => ({
        id_aluno: Number(a.id_aluno),
        nome: a.usuarios.nome,
        saldo_total: a.moedas_saldo.reduce((sum, s) => sum + (s.saldo ?? 0), 0),
      }))
      .sort((a, b) => b.saldo_total - a.saldo_total)
      .map((a, index) => ({ ...a, posicao: index + 1 }));

    return { alunos: ranking };
  }

  async comprarPontos(
    id_aluno: number,
    id_disciplina: bigint,
    quantidade_pontos: number,
  ) {
    const PRECO_POR_PONTO = 10; // TODO(Fase 1): ler de config_compra_pontos por disciplina
    const custoTotal = quantidade_pontos * PRECO_POR_PONTO;

    return this.db.$transaction(async (tx) => {
      const saldoRecord = await tx.moedas_saldo.findUnique({
        where: { id_aluno_id_disciplina: { id_aluno, id_disciplina } },
      });

      if (!saldoRecord || (saldoRecord.saldo ?? 0) < custoTotal) {
        throw new UnprocessableEntityException('Saldo insuficiente');
      }

      const transacao = await tx.transacoes_moedas.create({
        data: {
          id_aluno,
          id_disciplina,
          tipo: 'debito_compra',
          quantidade: -custoTotal,
          descricao: `Compra de ${quantidade_pontos} pontos extras`,
        },
      });

      await tx.compras_pontos.create({
        data: {
          id_aluno,
          id_disciplina,
          quantidade_pontos,
          custo_em_moedas: custoTotal,
          id_transacao_debito: transacao.id_transacao,
        },
      });

      const novoSaldo = await tx.moedas_saldo.update({
        where: { id_aluno_id_disciplina: { id_aluno, id_disciplina } },
        data: { saldo: { decrement: custoTotal } },
      });

      return { saldo_anterior: saldoRecord.saldo, saldo_novo: novoSaldo.saldo };
    });
  }

  async ajuste(
    id_aluno: bigint,
    id_disciplina: bigint,
    quantidade: number,
    motivo: string,
    admin: AuthUser,
  ) {
    return this.db.$transaction(async (tx) => {
      const saldoRecord = await tx.moedas_saldo.findUnique({
        where: { id_aluno_id_disciplina: { id_aluno, id_disciplina } },
      });

      if (quantidade < 0 && (saldoRecord?.saldo ?? 0) < Math.abs(quantidade)) {
        throw new UnprocessableEntityException('Saldo insuficiente para o ajuste');
      }

      const novoSaldo = await tx.moedas_saldo.upsert({
        where: { id_aluno_id_disciplina: { id_aluno, id_disciplina } },
        create: { id_aluno, id_disciplina, saldo: Math.max(quantidade, 0) },
        update: { saldo: { increment: quantidade } },
      });

      const transacao = await tx.transacoes_moedas.create({
        data: {
          id_aluno,
          id_disciplina,
          tipo: 'ajuste_admin',
          quantidade,
          criado_por_usuario_id: admin.sub,
          descricao: motivo,
        },
      });

      return {
        id_transacao: Number(transacao.id_transacao),
        saldo_novo: novoSaldo.saldo,
      };
    });
  }
}
