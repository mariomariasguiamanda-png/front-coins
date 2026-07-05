import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ProfessorDisciplinaService } from '../common/services/professor-disciplina.service';
import type { AuthUser } from '../common/types/auth-user';

@Injectable()
export class DesempenhoService {
  constructor(
    private db: DatabaseService,
    private professorDisciplinaService: ProfessorDisciplinaService,
  ) {}

  // Visão geral: uma linha por (aluno, disciplina) em todas as disciplinas do
  // professor, com detalhamento por atividade e ranking calculado dentro de
  // cada grupo disciplina+turma. Não existe "bimestre"/frequência no schema,
  // então esses campos não entram aqui (ver PROGRESSO-API.md, Etapa 4).
  async getVisaoGeral(professor: AuthUser) {
    const vinculos = await this.db.professor_disciplina.findMany({
      where: { id_professor: professor.id_professor as number },
      include: { disciplinas: { select: { id_disciplina: true, nome: true } } },
    });

    const linhas = (
      await Promise.all(
        vinculos.map(async (v) => {
          const id_disciplina = v.disciplinas.id_disciplina;
          const nomeDisciplina = v.disciplinas.nome;

          const [matriculas, corrigidas, saldos] = await Promise.all([
            this.db.matriculas_aluno_disciplina.findMany({
              where: { id_disciplina },
              include: {
                alunos: {
                  include: {
                    usuarios: { select: { nome: true } },
                    turmas: { select: { nome: true } },
                  },
                },
              },
            }),
            this.db.aluno_atividade.findMany({
              where: { status: 'corrigida', atividades: { id_disciplina } },
              include: { atividades: { select: { titulo: true } } },
            }),
            this.db.moedas_saldo.findMany({ where: { id_disciplina } }),
          ]);

          const mapaSaldo = new Map(saldos.map((s) => [Number(s.id_aluno), s.saldo ?? 0]));

          const mapaNotas = new Map<number, typeof corrigidas>();
          for (const c of corrigidas) {
            const id = Number(c.id_aluno);
            if (!mapaNotas.has(id)) mapaNotas.set(id, []);
            mapaNotas.get(id)!.push(c);
          }

          return matriculas.map((m) => {
            const id_aluno = Number(m.alunos.id_aluno);
            const notasAluno = mapaNotas.get(id_aluno) ?? [];
            const grades = notasAluno
              .filter((n) => n.nota !== null)
              .map((n) => ({
                activity: n.atividades.titulo,
                grade: Number(n.nota),
                maxGrade: 10,
                date: n.data_entrega ? n.data_entrega.toISOString().split('T')[0] : '',
              }));
            const notasValidas = grades.map((g) => g.grade);
            const averageGrade =
              notasValidas.length > 0
                ? notasValidas.reduce((s, n) => s + n, 0) / notasValidas.length
                : 0;

            return {
              studentId: m.alunos.matricula,
              studentName: m.alunos.usuarios.nome,
              discipline: nomeDisciplina,
              class: m.alunos.turmas?.nome ?? '-',
              grades,
              averageGrade,
              totalCoins: mapaSaldo.get(id_aluno) ?? 0,
            };
          });
        }),
      )
    ).flat();

    // Ranking dentro de cada grupo disciplina+turma
    const grupos = new Map<string, typeof linhas>();
    for (const linha of linhas) {
      const chave = `${linha.discipline}::${linha.class}`;
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave)!.push(linha);
    }

    return linhas.map((linha) => {
      const chave = `${linha.discipline}::${linha.class}`;
      const grupo = grupos.get(chave)!;
      const ranking = 1 + grupo.filter((outro) => outro.averageGrade > linha.averageGrade).length;
      return { ...linha, ranking };
    });
  }

  async getDesempenho(id_disciplina: bigint, id_turma: bigint | undefined, professor: AuthUser) {
    await this.professorDisciplinaService.verificar(
      professor.id_professor as number,
      id_disciplina,
    );

    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: {
        id_disciplina,
        alunos: id_turma !== undefined ? { id_turma } : undefined,
      },
      include: {
        alunos: { include: { usuarios: { select: { nome: true } } } },
      },
    });

    const totalAtividades = await this.db.atividades.count({
      where: { id_disciplina, ativo: true },
    });

    const alunosDesempenho = await Promise.all(
      matriculas.map(async (m) => {
        const id_aluno = m.alunos.id_aluno;

        const [entregues, corrigidas, mediaNota, saldo] = await Promise.all([
          this.db.aluno_atividade.count({
            where: {
              id_aluno,
              status: { in: ['entregue', 'corrigida'] },
              atividades: { id_disciplina },
            },
          }),
          this.db.aluno_atividade.count({
            where: { id_aluno, status: 'corrigida', atividades: { id_disciplina } },
          }),
          this.db.aluno_atividade.aggregate({
            where: { id_aluno, status: 'corrigida', atividades: { id_disciplina } },
            _avg: { nota: true },
          }),
          this.db.moedas_saldo.findUnique({
            where: { id_aluno_id_disciplina: { id_aluno, id_disciplina } },
          }),
        ]);

        return {
          id_aluno: Number(id_aluno),
          nome: m.alunos.usuarios.nome,
          matricula: m.alunos.matricula,
          total_atividades: totalAtividades,
          atividades_entregues: entregues,
          atividades_corrigidas: corrigidas,
          media_nota: mediaNota._avg.nota,
          saldo_moedas: saldo?.saldo ?? 0,
        };
      }),
    );

    const notasValidas = alunosDesempenho
      .map((a) => (a.media_nota !== null ? Number(a.media_nota) : null))
      .filter((n): n is number => n !== null);

    const mediaTurma =
      notasValidas.length > 0
        ? Math.round((notasValidas.reduce((s, n) => s + n, 0) / notasValidas.length) * 100) / 100
        : null;

    return {
      id_disciplina: Number(id_disciplina),
      total_alunos: alunosDesempenho.length,
      total_atividades: totalAtividades,
      media_turma: mediaTurma,
      alunos: alunosDesempenho,
    };
  }
}
