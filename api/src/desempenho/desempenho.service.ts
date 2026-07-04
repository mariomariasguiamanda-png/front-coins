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
