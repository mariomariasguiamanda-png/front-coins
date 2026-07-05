import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ProfessorDisciplinaService } from '../common/services/professor-disciplina.service';
import { ConfigPrecoDto } from './dto/config-preco.dto';
import type { AuthUser } from '../common/types/auth-user';

const DEFAULT_PONTOS_POR_COMPRA_MAX = 10;
const DEFAULT_PRECO_MOEDAS_POR_PONTO = 10;

@Injectable()
export class MoedasService {
  constructor(
    private db: DatabaseService,
    private professorDisciplinaService: ProfessorDisciplinaService,
  ) {}

  async setConfigPreco(dto: ConfigPrecoDto, professor: AuthUser) {
    const id_disciplina = BigInt(dto.id_disciplina);
    await this.professorDisciplinaService.verificar(
      professor.id_professor as number,
      id_disciplina,
    );

    const config = await this.db.config_compra_pontos.upsert({
      where: { id_disciplina },
      create: {
        id_disciplina,
        pontos_por_compra_max: dto.pontos_por_compra_max ?? DEFAULT_PONTOS_POR_COMPRA_MAX,
        preco_moedas_por_ponto: dto.preco_moedas_por_ponto ?? DEFAULT_PRECO_MOEDAS_POR_PONTO,
      },
      update: {
        pontos_por_compra_max: dto.pontos_por_compra_max,
        preco_moedas_por_ponto: dto.preco_moedas_por_ponto,
        atualizado_em: new Date(),
      },
    });

    return {
      id_disciplina: Number(config.id_disciplina),
      pontos_por_compra_max: config.pontos_por_compra_max,
      preco_moedas_por_ponto: config.preco_moedas_por_ponto,
    };
  }

  async getPrecoPontos(id_disciplina: bigint) {
    const config = await this.db.config_compra_pontos.findUnique({
      where: { id_disciplina },
    });

    return {
      id_disciplina: Number(id_disciplina),
      pontos_por_compra_max: config?.pontos_por_compra_max ?? DEFAULT_PONTOS_POR_COMPRA_MAX,
      preco_moedas_por_ponto: config?.preco_moedas_por_ponto ?? DEFAULT_PRECO_MOEDAS_POR_PONTO,
    };
  }

  async getConfigPrecos(id_aluno: number) {
    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: { id_aluno },
      include: { disciplinas: { select: { id_disciplina: true, codigo: true, nome: true } } },
    });

    const configs = await Promise.all(
      matriculas.map(async (m) => {
        const { pontos_por_compra_max, preco_moedas_por_ponto } = await this.getPrecoPontos(
          m.disciplinas.id_disciplina,
        );
        return {
          id_disciplina: Number(m.disciplinas.id_disciplina),
          codigo: m.disciplinas.codigo,
          nome: m.disciplinas.nome,
          pontos_por_compra_max,
          preco_moedas_por_ponto,
        };
      }),
    );

    return { disciplinas: configs };
  }

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
      },
    });

    const alunoIds = alunos.map((a) => a.id_aluno);

    // Ranking reflete o HISTÓRICO de moedas ganhas (soma só dos créditos),
    // não o saldo atual - o saldo cai quando o aluno compra pontos extras, e
    // usar saldo faria quem gasta moedas (uso pretendido do sistema) cair de
    // posição, punindo justamente quem mais usa a recompensa que conquistou.
    const totaisGanhos = await this.db.transacoes_moedas.groupBy({
      by: ['id_aluno'],
      where: { id_aluno: { in: alunoIds }, quantidade: { gt: 0 } },
      _sum: { quantidade: true },
    });

    const mapaTotais = new Map(
      totaisGanhos.map((t) => [Number(t.id_aluno), t._sum.quantidade ?? 0]),
    );

    const ranking = alunos
      .map((a) => ({
        id_aluno: Number(a.id_aluno),
        nome: a.usuarios.nome,
        foto_url: a.foto_url,
        total_moedas_historico: mapaTotais.get(Number(a.id_aluno)) ?? 0,
      }))
      .sort((a, b) => b.total_moedas_historico - a.total_moedas_historico)
      .map((a, index) => ({ ...a, posicao: index + 1 }));

    return { alunos: ranking };
  }

  async comprarPontos(
    id_aluno: number,
    id_disciplina: bigint,
    quantidade_pontos: number,
  ) {
    const { pontos_por_compra_max, preco_moedas_por_ponto } =
      await this.getPrecoPontos(id_disciplina);

    if (quantidade_pontos > pontos_por_compra_max) {
      throw new UnprocessableEntityException(
        `Máximo de ${pontos_por_compra_max} pontos por compra`,
      );
    }

    const custoTotal = quantidade_pontos * preco_moedas_por_ponto;

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

  async getSaldosGerais() {
    const alunos = await this.db.alunos.findMany({
      include: {
        usuarios: { select: { nome: true } },
        turmas: { select: { nome: true } },
        moedas_saldo: { include: { disciplinas: { select: { nome: true } } } },
      },
    });

    return alunos.map((a) => ({
      id_aluno: Number(a.id_aluno),
      nome: a.usuarios.nome,
      matricula: a.matricula,
      turma: a.turmas?.nome ?? null,
      saldo_total: a.moedas_saldo.reduce((sum, s) => sum + (s.saldo ?? 0), 0),
      por_disciplina: a.moedas_saldo.map((s) => ({
        id_disciplina: Number(s.id_disciplina),
        nome: s.disciplinas.nome,
        saldo: s.saldo,
      })),
    }));
  }

  async getTransacoesGerais(filtros: {
    id_aluno?: bigint;
    id_disciplina?: bigint;
    tipo?: string;
  }) {
    const transacoes = await this.db.transacoes_moedas.findMany({
      where: {
        id_aluno: filtros.id_aluno,
        id_disciplina: filtros.id_disciplina,
        tipo: filtros.tipo,
      },
      include: {
        alunos: { select: { matricula: true, usuarios: { select: { nome: true } } } },
        disciplinas: { select: { nome: true } },
      },
      orderBy: { criado_em: 'desc' },
      take: 200,
    });
    return transacoes;
  }

  async getComprasGerais(status?: string) {
    const compras = await this.db.compras_pontos.findMany({
      where: { status },
      include: {
        alunos: { select: { matricula: true, usuarios: { select: { nome: true } } } },
        disciplinas: { select: { nome: true } },
      },
      orderBy: { criado_em: 'desc' },
      take: 200,
    });
    return compras;
  }

  async cancelarCompra(id_compra: bigint, admin: AuthUser) {
    const compra = await this.db.compras_pontos.findUnique({ where: { id_compra } });
    if (!compra) throw new UnprocessableEntityException('Compra não encontrada');
    if (compra.status === 'cancelada') {
      throw new UnprocessableEntityException('Compra já está cancelada');
    }

    return this.db.$transaction(async (tx) => {
      await tx.compras_pontos.update({ where: { id_compra }, data: { status: 'cancelada' } });

      await tx.moedas_saldo.upsert({
        where: {
          id_aluno_id_disciplina: {
            id_aluno: compra.id_aluno,
            id_disciplina: compra.id_disciplina,
          },
        },
        create: {
          id_aluno: compra.id_aluno,
          id_disciplina: compra.id_disciplina,
          saldo: compra.custo_em_moedas,
        },
        update: { saldo: { increment: compra.custo_em_moedas } },
      });

      const transacao = await tx.transacoes_moedas.create({
        data: {
          id_aluno: compra.id_aluno,
          id_disciplina: compra.id_disciplina,
          tipo: 'ajuste_admin',
          quantidade: compra.custo_em_moedas,
          criado_por_usuario_id: admin.sub,
          descricao: `Estorno da compra #${Number(id_compra)} (cancelada pelo admin)`,
        },
      });

      return { id_compra: Number(id_compra), id_transacao: Number(transacao.id_transacao) };
    });
  }
}
