import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

const MESES_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
// Corte de aprovação usado em todo o sistema (Minhas Notas, zona de atenção)
const MEDIA_MINIMA = 6;
const HISTORICO_POR_ALUNO = 20;

@Injectable()
export class RelatoriosService {
  constructor(private db: DatabaseService) {}

  // Desempenho individual de todos os alunos: saldo, ranking (turma/escola por
  // moedas ganhas no histórico - mesmo critério do ranking do aluno), notas
  // finais e últimas movimentações de moedas.
  async relatorioAlunos() {
    const [alunos, ganhosPorAluno, saldosPorAluno, notas, transacoes, disciplinas] =
      await Promise.all([
        this.db.alunos.findMany({
          include: {
            usuarios: { select: { nome: true } },
            turmas: { select: { nome: true } },
          },
        }),
        this.db.transacoes_moedas.groupBy({
          by: ['id_aluno'],
          where: { quantidade: { gt: 0 } },
          _sum: { quantidade: true },
        }),
        this.db.moedas_saldo.groupBy({ by: ['id_aluno'], _sum: { saldo: true } }),
        this.db.notas_finais.findMany({
          include: { disciplinas: { select: { nome: true } } },
        }),
        this.db.transacoes_moedas.findMany({
          select: {
            id_transacao: true,
            id_aluno: true,
            id_disciplina: true,
            quantidade: true,
            descricao: true,
            tipo: true,
            criado_em: true,
          },
          orderBy: { criado_em: 'desc' },
        }),
        this.db.disciplinas.findMany({ select: { id_disciplina: true, nome: true } }),
      ]);

    const mapaGanho = new Map(ganhosPorAluno.map((g) => [Number(g.id_aluno), g._sum.quantidade ?? 0]));
    const mapaSaldo = new Map(saldosPorAluno.map((s) => [Number(s.id_aluno), s._sum.saldo ?? 0]));
    const mapaDisciplina = new Map(disciplinas.map((d) => [Number(d.id_disciplina), d.nome]));

    const notasPorAluno = new Map<number, typeof notas>();
    for (const n of notas) {
      const id = Number(n.id_aluno);
      if (!notasPorAluno.has(id)) notasPorAluno.set(id, []);
      notasPorAluno.get(id)!.push(n);
    }

    const transacoesPorAluno = new Map<number, typeof transacoes>();
    for (const t of transacoes) {
      const id = Number(t.id_aluno);
      if (!transacoesPorAluno.has(id)) transacoesPorAluno.set(id, []);
      const lista = transacoesPorAluno.get(id)!;
      if (lista.length < HISTORICO_POR_ALUNO) lista.push(t);
    }

    // Rankings por moedas ganhas (histórico de créditos)
    const ordenadoEscola = [...alunos].sort(
      (a, b) => (mapaGanho.get(Number(b.id_aluno)) ?? 0) - (mapaGanho.get(Number(a.id_aluno)) ?? 0),
    );
    const posicaoEscola = new Map(ordenadoEscola.map((a, i) => [Number(a.id_aluno), i + 1]));

    const porTurma = new Map<string, typeof alunos>();
    for (const a of alunos) {
      const turma = a.turmas?.nome ?? 'Sem turma';
      if (!porTurma.has(turma)) porTurma.set(turma, []);
      porTurma.get(turma)!.push(a);
    }
    const posicaoTurma = new Map<number, { posicao: number; total: number }>();
    for (const [, membros] of porTurma) {
      const ordenado = [...membros].sort(
        (a, b) =>
          (mapaGanho.get(Number(b.id_aluno)) ?? 0) - (mapaGanho.get(Number(a.id_aluno)) ?? 0),
      );
      ordenado.forEach((a, i) =>
        posicaoTurma.set(Number(a.id_aluno), { posicao: i + 1, total: membros.length }),
      );
    }

    return alunos.map((a) => {
      const id = Number(a.id_aluno);
      const posTurma = posicaoTurma.get(id) ?? { posicao: 0, total: 0 };

      return {
        id_aluno: id,
        nome: a.usuarios.nome,
        matricula: a.matricula,
        turma: a.turmas?.nome ?? 'Sem turma',
        saldo_moedas: mapaSaldo.get(id) ?? 0,
        total_ganho: mapaGanho.get(id) ?? 0,
        ranking: {
          posicao_turma: posTurma.posicao,
          total_alunos_turma: posTurma.total,
          posicao_escola: posicaoEscola.get(id) ?? 0,
          total_alunos_escola: alunos.length,
        },
        notas: (notasPorAluno.get(id) ?? []).map((n) => ({
          disciplina: n.disciplinas.nome,
          nota: n.nota_final !== null ? Number(n.nota_final) : null,
          media_minima: MEDIA_MINIMA,
          data: n.atualizado_em,
        })),
        historico_moedas: (transacoesPorAluno.get(id) ?? []).map((t) => ({
          id_transacao: Number(t.id_transacao),
          tipo: t.quantidade >= 0 ? 'ganho' : 'gasto',
          quantidade: Math.abs(t.quantidade),
          motivo: t.descricao ?? t.tipo,
          disciplina: mapaDisciplina.get(Number(t.id_disciplina)) ?? '-',
          data: t.criado_em,
        })),
      };
    });
  }

  // Uma linha por (turma, disciplina): médias de moedas/notas, professor
  // responsável, distribuição de moedas por aluno e evolução mensal.
  async relatorioTurmas() {
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 5);
    seisMesesAtras.setDate(1);
    seisMesesAtras.setHours(0, 0, 0, 0);

    const [matriculas, vinculos, ganhosPorAlunoDisciplina, notasFinais, correcoesRecentes, creditosRecentes] =
      await Promise.all([
        this.db.matriculas_aluno_disciplina.findMany({
          include: {
            alunos: {
              include: {
                usuarios: { select: { nome: true } },
                turmas: { select: { nome: true } },
              },
            },
            disciplinas: { select: { id_disciplina: true, nome: true } },
          },
        }),
        this.db.professor_disciplina.findMany({
          include: { professores: { include: { usuarios: { select: { nome: true } } } } },
        }),
        this.db.transacoes_moedas.groupBy({
          by: ['id_aluno', 'id_disciplina'],
          where: { quantidade: { gt: 0 } },
          _sum: { quantidade: true },
        }),
        this.db.notas_finais.findMany({
          select: { id_aluno: true, id_disciplina: true, nota_final: true },
        }),
        this.db.aluno_atividade.findMany({
          where: { status: 'corrigida', nota: { not: null }, data_entrega: { gte: seisMesesAtras } },
          select: {
            id_aluno: true,
            nota: true,
            data_entrega: true,
            atividades: { select: { id_disciplina: true } },
          },
        }),
        this.db.transacoes_moedas.findMany({
          where: { quantidade: { gt: 0 }, criado_em: { gte: seisMesesAtras } },
          select: { id_aluno: true, id_disciplina: true, quantidade: true, criado_em: true },
        }),
      ]);

    const mapaProfessor = new Map<string, string>();
    for (const v of vinculos) {
      const chave = String(v.id_disciplina);
      if (!mapaProfessor.has(chave)) mapaProfessor.set(chave, v.professores.usuarios.nome);
    }

    const mapaGanho = new Map(
      ganhosPorAlunoDisciplina.map((g) => [
        `${g.id_aluno}:${g.id_disciplina}`,
        g._sum.quantidade ?? 0,
      ]),
    );
    const mapaNota = new Map(
      notasFinais
        .filter((n) => n.nota_final !== null)
        .map((n) => [`${n.id_aluno}:${n.id_disciplina}`, Number(n.nota_final)]),
    );

    // Agrupa matrículas por (turma, disciplina)
    const grupos = new Map<
      string,
      { turma: string; id_disciplina: bigint; disciplina: string; membros: typeof matriculas }
    >();
    for (const m of matriculas) {
      const turma = m.alunos.turmas?.nome ?? 'Sem turma';
      const chave = `${turma}::${m.disciplinas.id_disciplina}`;
      if (!grupos.has(chave)) {
        grupos.set(chave, {
          turma,
          id_disciplina: m.disciplinas.id_disciplina,
          disciplina: m.disciplinas.nome,
          membros: [],
        });
      }
      grupos.get(chave)!.membros.push(m);
    }

    // Meses do intervalo (para a evolução mensal)
    const meses: { rotulo: string; inicio: Date; fim: Date }[] = [];
    for (let i = 5; i >= 0; i--) {
      const inicio = new Date();
      inicio.setMonth(inicio.getMonth() - i, 1);
      inicio.setHours(0, 0, 0, 0);
      const fim = new Date(inicio);
      fim.setMonth(fim.getMonth() + 1, 0);
      fim.setHours(23, 59, 59, 999);
      meses.push({ rotulo: MESES_PT[inicio.getMonth()], inicio, fim });
    }

    return Array.from(grupos.values()).map((g) => {
      const idsAlunos = new Set(g.membros.map((m) => Number(m.alunos.id_aluno)));
      const chaveDe = (idAluno: number) => `${idAluno}:${g.id_disciplina}`;

      const ganhos = g.membros.map((m) => mapaGanho.get(chaveDe(Number(m.alunos.id_aluno))) ?? 0);
      const notas = g.membros
        .map((m) => mapaNota.get(chaveDe(Number(m.alunos.id_aluno))))
        .filter((n): n is number => n !== undefined);

      const distribuicao = g.membros
        .map((m) => ({
          nome: m.alunos.usuarios.nome,
          moedas: mapaGanho.get(chaveDe(Number(m.alunos.id_aluno))) ?? 0,
        }))
        .sort((a, b) => b.moedas - a.moedas);

      const evolucao = meses.map(({ rotulo, inicio, fim }) => {
        const moedasMes = creditosRecentes
          .filter(
            (t) =>
              Number(t.id_disciplina) === Number(g.id_disciplina) &&
              idsAlunos.has(Number(t.id_aluno)) &&
              t.criado_em !== null &&
              t.criado_em >= inicio &&
              t.criado_em <= fim,
          )
          .reduce((s, t) => s + t.quantidade, 0);

        const notasMes = correcoesRecentes
          .filter(
            (c) =>
              Number(c.atividades.id_disciplina) === Number(g.id_disciplina) &&
              idsAlunos.has(Number(c.id_aluno)) &&
              c.data_entrega !== null &&
              c.data_entrega >= inicio &&
              c.data_entrega <= fim,
          )
          .map((c) => Number(c.nota));

        return {
          mes: rotulo,
          moedas: moedasMes,
          notas:
            notasMes.length > 0
              ? Math.round((notasMes.reduce((s, n) => s + n, 0) / notasMes.length) * 100) / 100
              : null,
        };
      });

      return {
        turma: g.turma,
        id_disciplina: Number(g.id_disciplina),
        disciplina: g.disciplina,
        professor: mapaProfessor.get(String(g.id_disciplina)) ?? '-',
        total_alunos: g.membros.length,
        media_moedas:
          ganhos.length > 0 ? Math.round(ganhos.reduce((s, n) => s + n, 0) / ganhos.length) : 0,
        media_notas:
          notas.length > 0
            ? Math.round((notas.reduce((s, n) => s + n, 0) / notas.length) * 100) / 100
            : null,
        distribuicao_moedas: distribuicao,
        evolucao_mensal: evolucao,
      };
    });
  }
}
