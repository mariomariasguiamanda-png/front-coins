import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type { AuthUser } from '../common/types/auth-user';

@Injectable()
export class DashboardService {
  constructor(private db: DatabaseService) {}

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
