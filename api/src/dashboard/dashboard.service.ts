import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { AuthUser } from '../common/types/auth-user';

const MESES_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const DIAS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

@Injectable()
export class DashboardService {
  constructor(private db: DatabaseService) {}

  async getDashboardAdmin() {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 6);
    seteDiasAtras.setHours(0, 0, 0, 0);

    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 5);
    seisMesesAtras.setDate(1);
    seisMesesAtras.setHours(0, 0, 0, 0);

    const [
      usuarios,
      disciplinas,
      creditosAgg,
      debitosAgg,
      saldosPorDisciplina,
      matriculasPorDisciplina,
      nomesDisciplinas,
      comprasRecentes,
      transacoesRecentes,
      alunosComCriacao,
      chamadosAbertos,
    ] = await Promise.all([
      this.db.usuarios.groupBy({ by: ['tipo_usuario', 'status'], _count: { _all: true } }),
      this.db.disciplinas.groupBy({ by: ['ativo'], _count: { _all: true } }),
      this.db.transacoes_moedas.aggregate({
        where: { quantidade: { gt: 0 } },
        _sum: { quantidade: true },
      }),
      this.db.transacoes_moedas.aggregate({
        where: { quantidade: { lt: 0 } },
        _sum: { quantidade: true },
      }),
      this.db.moedas_saldo.groupBy({ by: ['id_disciplina'], _sum: { saldo: true } }),
      this.db.matriculas_aluno_disciplina.groupBy({
        by: ['id_disciplina'],
        _count: { _all: true },
      }),
      this.db.disciplinas.findMany({ select: { id_disciplina: true, nome: true } }),
      this.db.compras_pontos.findMany({
        where: { criado_em: { gte: seteDiasAtras } },
        select: { criado_em: true },
      }),
      this.db.transacoes_moedas.findMany({
        where: { criado_em: { gte: seteDiasAtras }, quantidade: { gt: 0 } },
        select: { criado_em: true, quantidade: true },
      }),
      this.db.alunos.findMany({ select: { criado_em: true } }),
      this.db.suporte_chamados.count({ where: { status: { notIn: ['respondido', 'fechado'] } } }),
    ]);

    const contar = (tipo: string, status?: string) =>
      usuarios
        .filter((u) => u.tipo_usuario === tipo && (status === undefined || u.status === status))
        .reduce((s, u) => s + u._count._all, 0);

    const mapaNomes = new Map(nomesDisciplinas.map((d) => [String(d.id_disciplina), d.nome]));
    const mapaAlunosDisc = new Map(
      matriculasPorDisciplina.map((m) => [String(m.id_disciplina), m._count._all]),
    );

    const coinsByDiscipline = saldosPorDisciplina
      .map((s) => ({
        discipline: mapaNomes.get(String(s.id_disciplina)) ?? `#${s.id_disciplina}`,
        coins: s._sum.saldo ?? 0,
        students: mapaAlunosDisc.get(String(s.id_disciplina)) ?? 0,
      }))
      .sort((a, b) => b.coins - a.coins);

    // Atividade dos últimos 7 dias (compras de pontos + moedas creditadas)
    const activity: { day: string; date: string; purchases: number; coins: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const chave = d.toDateString();
      activity.push({
        day: DIAS_PT[d.getDay()],
        date: d.toISOString().slice(0, 10),
        purchases: comprasRecentes.filter((c) => c.criado_em?.toDateString() === chave).length,
        coins: transacoesRecentes
          .filter((t) => t.criado_em?.toDateString() === chave)
          .reduce((s, t) => s + t.quantidade, 0),
      });
    }

    // Evolução de alunos cadastrados (acumulado) nos últimos 6 meses
    const evolution: { month: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const fimDoMes = new Date();
      fimDoMes.setMonth(fimDoMes.getMonth() - i + 1, 0);
      fimDoMes.setHours(23, 59, 59, 999);
      evolution.push({
        month: MESES_PT[new Date(fimDoMes).getMonth()],
        total: alunosComCriacao.filter((a) => (a.criado_em ?? new Date(0)) <= fimDoMes).length,
      });
    }

    const distribuido = creditosAgg._sum.quantidade ?? 0;
    const gasto = Math.abs(debitosAgg._sum.quantidade ?? 0);

    return {
      students: {
        total: contar('aluno'),
        active: contar('aluno', 'ativo'),
        inactive: contar('aluno') - contar('aluno', 'ativo'),
      },
      teachers: {
        total: contar('professor'),
        active: contar('professor', 'ativo'),
      },
      disciplines: {
        total: disciplinas.reduce((s, d) => s + d._count._all, 0),
        active: disciplinas.filter((d) => d.ativo === true).reduce((s, d) => s + d._count._all, 0),
        inactive: disciplinas
          .filter((d) => d.ativo !== true)
          .reduce((s, d) => s + d._count._all, 0),
      },
      coins: {
        distributed: distribuido,
        spent: gasto,
        circulating: distribuido - gasto,
      },
      openTickets: chamadosAbertos,
      coinsByDiscipline,
      activityLast7Days: activity,
      studentEvolution: evolution,
    };
  }

  async getDashboardProfessor(professor: AuthUser) {
    const id_professor = professor.id_professor as number;

    const vinculos = await this.db.professor_disciplina.findMany({
      where: { id_professor },
      include: { disciplinas: { select: { id_disciplina: true, nome: true, codigo: true } } },
    });
    const idsDisciplinas = vinculos.map((v) => v.disciplinas.id_disciplina);

    // Tudo em uma leva de queries fixas (agregadas em memória por disciplina/
    // turma) em vez de 2 counts POR disciplina + 2 POR turma - com o banco
    // remoto cada round-trip custa caro.
    const [
      statusPorAtividade,
      todasAtividades,
      matriculas,
      totalAtividades,
      corrigidasPorAluno,
      notasFinais,
      saldos,
    ] = await Promise.all([
      this.db.aluno_atividade.groupBy({
        by: ['id_atividade', 'status'],
        where: {
          status: { in: ['entregue', 'corrigida'] },
          atividades: { id_disciplina: { in: idsDisciplinas } },
        },
        _count: { _all: true },
      }),
      this.db.atividades.findMany({
        where: { id_disciplina: { in: idsDisciplinas } },
        select: { id_atividade: true, id_disciplina: true },
      }),
      this.db.matriculas_aluno_disciplina.findMany({
        where: { id_disciplina: { in: idsDisciplinas } },
        include: { alunos: { include: { turmas: { select: { nome: true } } } } },
      }),
      this.db.atividades.count({
        where: { id_disciplina: { in: idsDisciplinas }, ativo: true },
      }),
      this.db.aluno_atividade.groupBy({
        by: ['id_aluno'],
        where: { status: 'corrigida', atividades: { id_disciplina: { in: idsDisciplinas } } },
        _count: { _all: true },
      }),
      this.db.notas_finais.findMany({
        where: { id_disciplina: { in: idsDisciplinas } },
        select: { id_aluno: true, nota_final: true },
      }),
      this.db.moedas_saldo.findMany({
        where: { id_disciplina: { in: idsDisciplinas } },
        include: { alunos: { include: { usuarios: { select: { nome: true } } } } },
      }),
    ]);

    // Entregas pendentes/corrigidas por disciplina
    const mapaAtividadeDisciplina = new Map(
      todasAtividades.map((a) => [String(a.id_atividade), String(a.id_disciplina)]),
    );
    const contagemPorDisciplina = new Map<string, { pending: number; corrected: number }>();
    for (const s of statusPorAtividade) {
      const idDisc = mapaAtividadeDisciplina.get(String(s.id_atividade));
      if (!idDisc) continue;
      const atual = contagemPorDisciplina.get(idDisc) ?? { pending: 0, corrected: 0 };
      if (s.status === 'entregue') atual.pending += s._count._all;
      else atual.corrected += s._count._all;
      contagemPorDisciplina.set(idDisc, atual);
    }

    const disciplinas = vinculos.map((v) => {
      const contagem = contagemPorDisciplina.get(String(v.disciplinas.id_disciplina)) ?? {
        pending: 0,
        corrected: 0,
      };
      return {
        discipline: v.disciplinas.nome,
        codigo: v.disciplinas.codigo,
        total: contagem.pending + contagem.corrected,
        pending: contagem.pending,
        corrected: contagem.corrected,
      };
    });

    // Agrupa alunos matriculados (em qualquer disciplina do professor) por turma
    const alunosPorTurma = new Map<string, Set<number>>();
    for (const m of matriculas) {
      const nomeTurma = m.alunos.turmas?.nome;
      if (!nomeTurma) continue;
      if (!alunosPorTurma.has(nomeTurma)) alunosPorTurma.set(nomeTurma, new Set());
      alunosPorTurma.get(nomeTurma)!.add(Number(m.alunos.id_aluno));
    }

    const mapaCorrigidasAluno = new Map(
      corrigidasPorAluno.map((c) => [Number(c.id_aluno), c._count._all]),
    );
    const notasPorAluno = new Map<number, number[]>();
    for (const n of notasFinais) {
      if (n.nota_final === null) continue;
      const id = Number(n.id_aluno);
      if (!notasPorAluno.has(id)) notasPorAluno.set(id, []);
      notasPorAluno.get(id)!.push(Number(n.nota_final));
    }

    const turmas = Array.from(alunosPorTurma.entries()).map(([nomeTurma, idsAlunosSet]) => {
      const idsAlunos = Array.from(idsAlunosSet);

      const notasTurma = idsAlunos.flatMap((id) => notasPorAluno.get(id) ?? []);
      const media =
        notasTurma.length > 0
          ? notasTurma.reduce((s, n) => s + n, 0) / notasTurma.length
          : null;

      const totalCorrigidas = idsAlunos.reduce(
        (s, id) => s + (mapaCorrigidasAluno.get(id) ?? 0),
        0,
      );
      const totalPossivel = totalAtividades * idsAlunos.length;

      return {
        turma: nomeTurma,
        media,
        participacao: totalPossivel > 0 ? Math.round((totalCorrigidas / totalPossivel) * 100) : 0,
      };
    });

    // Ranking: top 3 alunos por saldo de moedas nas disciplinas do professor
    const saldoPorAluno = new Map<number, { nome: string; saldo: number }>();
    for (const s of saldos) {
      const id = Number(s.id_aluno);
      const atual = saldoPorAluno.get(id) ?? { nome: s.alunos.usuarios.nome, saldo: 0 };
      atual.saldo += s.saldo ?? 0;
      saldoPorAluno.set(id, atual);
    }
    const ranking = Array.from(saldoPorAluno.values())
      .sort((a, b) => b.saldo - a.saldo)
      .slice(0, 3);

    // Atividades recentes: últimas entregas/correções nas disciplinas do professor
    const recentes = await this.db.aluno_atividade.findMany({
      where: {
        status: { in: ['entregue', 'corrigida'] },
        atividades: { id_disciplina: { in: idsDisciplinas } },
        data_entrega: { not: null },
      },
      include: {
        alunos: { include: { usuarios: { select: { nome: true } } } },
        atividades: { select: { titulo: true } },
      },
      orderBy: { data_entrega: 'desc' },
      take: 5,
    });

    const atividadesRecentes = recentes.map((r) => ({
      tipo: r.status === 'corrigida' ? 'correcao' : 'entrega',
      mensagem:
        r.status === 'corrigida'
          ? `${r.alunos.usuarios.nome} teve "${r.atividades.titulo}" corrigida`
          : `${r.alunos.usuarios.nome} entregou "${r.atividades.titulo}"`,
      data: r.data_entrega,
    }));

    return { disciplinas, turmas, ranking, atividadesRecentes };
  }
}
