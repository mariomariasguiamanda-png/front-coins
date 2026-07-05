import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import type { AuthUser } from '../common/types/auth-user';

type DisciplinaStats = {
  progresso_percent: number;
  moedas_conquistadas: number;
  moedas_totais_disciplina: number;
  total_atividades: number;
  atividades_concluidas: number;
  total_resumos: number;
  resumos_lidos: number;
  total_videoaulas: number;
  videoaulas_assistidas: number;
};

@Injectable()
export class DisciplinasService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.disciplinas.findMany();
  }

  // Computa as estatísticas de progresso do aluno pra um conjunto de disciplinas
  // numa quantidade fixa de queries (independente de quantas disciplinas sejam) -
  // antes disso rodava 8 queries POR disciplina matriculada (N+1).
  private async computeStats(
    id_aluno: number,
    ids: bigint[],
  ): Promise<Map<string, DisciplinaStats>> {
    const stats = new Map<string, DisciplinaStats>();
    if (ids.length === 0) return stats;

    const [
      atividadesPorDisciplina,
      resumosPorDisciplina,
      videoaulasPorDisciplina,
      concluidasRows,
      lidosRows,
      assistidasRows,
      saldos,
    ] = await Promise.all([
      this.db.atividades.groupBy({
        by: ['id_disciplina'],
        where: { id_disciplina: { in: ids }, ativo: true },
        _count: { _all: true },
        _sum: { recompensa_moedas: true },
      }),
      this.db.resumos.groupBy({
        by: ['id_disciplina'],
        where: { id_disciplina: { in: ids }, ativo: true },
        _count: { _all: true },
      }),
      this.db.videoaulas.groupBy({
        by: ['id_disciplina'],
        where: { id_disciplina: { in: ids }, ativo: true },
        _count: { _all: true },
      }),
      this.db.aluno_atividade.findMany({
        where: { id_aluno, status: 'corrigida', atividades: { id_disciplina: { in: ids } } },
        select: { atividades: { select: { id_disciplina: true } } },
      }),
      this.db.aluno_resumo.findMany({
        where: { id_aluno, status: 'lido', resumos: { id_disciplina: { in: ids } } },
        select: { resumos: { select: { id_disciplina: true } } },
      }),
      this.db.aluno_videoaula.findMany({
        where: { id_aluno, status: 'assistida', videoaulas: { id_disciplina: { in: ids } } },
        select: { videoaulas: { select: { id_disciplina: true } } },
      }),
      this.db.moedas_saldo.findMany({
        where: { id_aluno, id_disciplina: { in: ids } },
      }),
    ]);

    const countBy = <T extends Record<string, { id_disciplina: bigint }>>(
      rows: T[],
      key: keyof T,
    ) => {
      const map = new Map<string, number>();
      for (const row of rows) {
        const idStr = String(row[key].id_disciplina);
        map.set(idStr, (map.get(idStr) ?? 0) + 1);
      }
      return map;
    };

    const mapTotalAtividades = new Map(
      atividadesPorDisciplina.map((a) => [String(a.id_disciplina), a._count._all]),
    );
    const mapSomaRecompensa = new Map(
      atividadesPorDisciplina.map((a) => [String(a.id_disciplina), a._sum.recompensa_moedas ?? 0]),
    );
    const mapTotalResumos = new Map(
      resumosPorDisciplina.map((r) => [String(r.id_disciplina), r._count._all]),
    );
    const mapTotalVideoaulas = new Map(
      videoaulasPorDisciplina.map((v) => [String(v.id_disciplina), v._count._all]),
    );
    const mapConcluidas = countBy(concluidasRows, 'atividades');
    const mapLidos = countBy(lidosRows, 'resumos');
    const mapAssistidas = countBy(assistidasRows, 'videoaulas');
    const mapSaldo = new Map(saldos.map((s) => [String(s.id_disciplina), s.saldo ?? 0]));

    for (const id of ids) {
      const idStr = String(id);
      const totalAtividades = mapTotalAtividades.get(idStr) ?? 0;
      const totalResumos = mapTotalResumos.get(idStr) ?? 0;
      const totalVideoaulas = mapTotalVideoaulas.get(idStr) ?? 0;
      const atividadesConcluidas = mapConcluidas.get(idStr) ?? 0;
      const resumosLidos = mapLidos.get(idStr) ?? 0;
      const videoaulasAssistidas = mapAssistidas.get(idStr) ?? 0;

      const totalItens = totalAtividades + totalResumos + totalVideoaulas;
      const itensConcluidos = atividadesConcluidas + resumosLidos + videoaulasAssistidas;

      stats.set(idStr, {
        progresso_percent: totalItens > 0 ? Math.round((itensConcluidos / totalItens) * 100) : 0,
        moedas_conquistadas: mapSaldo.get(idStr) ?? 0,
        moedas_totais_disciplina: mapSomaRecompensa.get(idStr) ?? 0,
        total_atividades: totalAtividades,
        atividades_concluidas: atividadesConcluidas,
        total_resumos: totalResumos,
        resumos_lidos: resumosLidos,
        total_videoaulas: totalVideoaulas,
        videoaulas_assistidas: videoaulasAssistidas,
      });
    }

    return stats;
  }

  async findByAluno(id_aluno: number) {
    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: { id_aluno },
      include: { disciplinas: true },
    });

    const ids = matriculas.map((m) => m.disciplinas.id_disciplina);
    const stats = await this.computeStats(id_aluno, ids);

    return matriculas.map((m) => ({
      ...m.disciplinas,
      id_disciplina: Number(m.disciplinas.id_disciplina),
      ...stats.get(String(m.disciplinas.id_disciplina)),
    }));
  }

  async findOneByAluno(id_aluno: number, id_disciplina: bigint) {
    const matricula = await this.db.matriculas_aluno_disciplina.findFirst({
      where: { id_aluno, id_disciplina },
      include: { disciplinas: true },
    });
    if (!matricula) {
      throw new NotFoundException('Aluno não está matriculado nessa disciplina');
    }

    const stats = await this.computeStats(id_aluno, [id_disciplina]);

    return {
      ...matricula.disciplinas,
      id_disciplina: Number(matricula.disciplinas.id_disciplina),
      ...stats.get(String(id_disciplina)),
    };
  }

  async findByProfessor(professor: AuthUser) {
    const vinculos = await this.db.professor_disciplina.findMany({
      where: { id_professor: professor.id_professor as number },
      include: { disciplinas: true },
    });

    return Promise.all(
      vinculos.map(async (v) => {
        const disciplina = v.disciplinas;
        const id_disciplina = disciplina.id_disciplina;

        const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
          where: { id_disciplina },
          include: { alunos: { include: { turmas: { select: { nome: true } } } } },
        });
        const totalAlunos = matriculas.length;
        const turmas = Array.from(
          new Set(
            matriculas
              .map((m) => m.alunos.turmas?.nome)
              .filter((nome): nome is string => !!nome),
          ),
        );

        const [totalAtividades, totalCorrigidas, mediaNotas] = await Promise.all([
          this.db.atividades.count({ where: { id_disciplina, ativo: true } }),
          this.db.aluno_atividade.count({
            where: { status: 'corrigida', atividades: { id_disciplina } },
          }),
          this.db.notas_finais.aggregate({
            where: { id_disciplina },
            _avg: { nota_final: true },
          }),
        ]);

        const totalPossivel = totalAtividades * totalAlunos;

        return {
          id_disciplina: Number(id_disciplina),
          nome: disciplina.nome,
          codigo: disciplina.codigo,
          descricao: disciplina.descricao,
          carga_horaria: disciplina.carga_horaria,
          ativo: disciplina.ativo,
          turmas,
          total_alunos: totalAlunos,
          media_nota: mediaNotas._avg.nota_final,
          taxa_conclusao:
            totalPossivel > 0 ? Math.round((totalCorrigidas / totalPossivel) * 100) : 0,
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

  async create(dto: CreateDisciplinaDto) {
    return this.db.disciplinas.create({ data: dto });
  }

  async update(id: bigint, dto: UpdateDisciplinaDto) {
    await this.findOne(id);
    return this.db.disciplinas.update({ where: { id_disciplina: id }, data: dto });
  }

  async remove(id: bigint) {
    await this.findOne(id);
    return this.db.disciplinas.update({ where: { id_disciplina: id }, data: { ativo: false } });
  }
}
