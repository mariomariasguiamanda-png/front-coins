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

    const disciplinas = await Promise.all(
      vinculos.map(async (v) => {
        const id_disciplina = v.disciplinas.id_disciplina;
        const [pending, corrected] = await Promise.all([
          this.db.aluno_atividade.count({
            where: { status: 'entregue', atividades: { id_disciplina } },
          }),
          this.db.aluno_atividade.count({
            where: { status: 'corrigida', atividades: { id_disciplina } },
          }),
        ]);

        return {
          discipline: v.disciplinas.nome,
          codigo: v.disciplinas.codigo,
          total: pending + corrected,
          pending,
          corrected,
        };
      }),
    );

    // Agrupa alunos matriculados (em qualquer disciplina do professor) por turma
    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: { id_disciplina: { in: idsDisciplinas } },
      include: { alunos: { include: { turmas: { select: { nome: true } } } } },
    });

    const alunosPorTurma = new Map<string, Set<number>>();
    for (const m of matriculas) {
      const nomeTurma = m.alunos.turmas?.nome;
      if (!nomeTurma) continue;
      if (!alunosPorTurma.has(nomeTurma)) alunosPorTurma.set(nomeTurma, new Set());
      alunosPorTurma.get(nomeTurma)!.add(Number(m.alunos.id_aluno));
    }

    const totalAtividades = await this.db.atividades.count({
      where: { id_disciplina: { in: idsDisciplinas }, ativo: true },
    });

    const turmas = await Promise.all(
      Array.from(alunosPorTurma.entries()).map(async ([nomeTurma, idsAlunosSet]) => {
        const idsAlunos = Array.from(idsAlunosSet);

        const [mediaAgg, totalCorrigidas] = await Promise.all([
          this.db.notas_finais.aggregate({
            where: { id_aluno: { in: idsAlunos }, id_disciplina: { in: idsDisciplinas } },
            _avg: { nota_final: true },
          }),
          this.db.aluno_atividade.count({
            where: {
              id_aluno: { in: idsAlunos },
              status: 'corrigida',
              atividades: { id_disciplina: { in: idsDisciplinas } },
            },
          }),
        ]);

        const totalPossivel = totalAtividades * idsAlunos.length;

        return {
          turma: nomeTurma,
          media: mediaAgg._avg.nota_final !== null ? Number(mediaAgg._avg.nota_final) : null,
          participacao:
            totalPossivel > 0 ? Math.round((totalCorrigidas / totalPossivel) * 100) : 0,
        };
      }),
    );

    // Ranking: top 3 alunos por saldo de moedas nas disciplinas do professor
    const saldos = await this.db.moedas_saldo.findMany({
      where: { id_disciplina: { in: idsDisciplinas } },
      include: { alunos: { include: { usuarios: { select: { nome: true } } } } },
    });
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
