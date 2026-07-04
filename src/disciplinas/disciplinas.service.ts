import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DisciplinasService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.disciplinas.findMany();
  }

  async findByAluno(id_aluno: number) {
    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: { id_aluno },
      include: { disciplinas: true },
    });

    return Promise.all(
      matriculas.map(async (m) => {
        const id_disciplina = m.disciplinas.id_disciplina;

        const [
          totalAtividades,
          atividadesConcluidas,
          totalResumos,
          resumosLidos,
          totalVideoaulas,
          videoaulasAssistidas,
          saldo,
          recompensaMaxima,
        ] = await Promise.all([
          this.db.atividades.count({ where: { id_disciplina, ativo: true } }),
          this.db.aluno_atividade.count({
            where: { id_aluno, status: 'corrigida', atividades: { id_disciplina } },
          }),
          this.db.resumos.count({ where: { id_disciplina, ativo: true } }),
          this.db.aluno_resumo.count({
            where: { id_aluno, status: 'lido', resumos: { id_disciplina } },
          }),
          this.db.videoaulas.count({ where: { id_disciplina, ativo: true } }),
          this.db.aluno_videoaula.count({
            where: { id_aluno, status: 'assistida', videoaulas: { id_disciplina } },
          }),
          this.db.moedas_saldo.findUnique({
            where: { id_aluno_id_disciplina: { id_aluno, id_disciplina } },
          }),
          this.db.atividades.aggregate({
            where: { id_disciplina, ativo: true },
            _sum: { recompensa_moedas: true },
          }),
        ]);

        const totalItens = totalAtividades + totalResumos + totalVideoaulas;
        const itensConcluidos = atividadesConcluidas + resumosLidos + videoaulasAssistidas;
        const progresso_percent =
          totalItens > 0 ? Math.round((itensConcluidos / totalItens) * 100) : 0;

        return {
          ...m.disciplinas,
          id_disciplina: Number(id_disciplina),
          progresso_percent,
          moedas_conquistadas: saldo?.saldo ?? 0,
          moedas_totais_disciplina: recompensaMaxima._sum.recompensa_moedas ?? 0,
          total_atividades: totalAtividades,
          atividades_concluidas: atividadesConcluidas,
          total_resumos: totalResumos,
          resumos_lidos: resumosLidos,
          total_videoaulas: totalVideoaulas,
          videoaulas_assistidas: videoaulasAssistidas,
        };
      }),
    );
  }

  async findOne(id: bigint) {
    const disciplina = await this.db.disciplinas.findUnique({
      where: { id_disciplina: id },
    });
    if (!disciplina) throw new NotFoundException('Disciplina não encontrada');
    return disciplina;
  }
}
