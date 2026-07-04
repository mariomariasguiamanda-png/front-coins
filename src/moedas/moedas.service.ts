import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MoedasService {
  constructor(private db: DatabaseService) {}

  async getSaldo(id_aluno: bigint) {
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

  async getExtrato(id_aluno: bigint, id_disciplina: bigint) {
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

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async getRanking(_id_turma: bigint) {
    // ranking logic simplified
    return { alunos: [] };
  }

  async comprarPontos(
    id_aluno: bigint,
    id_disciplina: bigint,
    quantidade_pontos: number,
  ) {
    const PRECO_POR_PONTO = 10; // example cost
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
}
