import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ProfessorDisciplinaService } from '../common/services/professor-disciplina.service';
import type { AuthUser } from '../common/types/auth-user';

// Mesmo corte usado em "Minhas Notas": >=6 aprovado, >=4 recuperação, abaixo reprovado.
const getStatusFromNota = (nota: number | null): string | null => {
  if (nota === null || Number.isNaN(nota)) return null;
  if (nota >= 6) return 'aprovado';
  if (nota >= 4) return 'recuperacao';
  return 'reprovado';
};

@Injectable()
export class NotasService {
  constructor(
    private db: DatabaseService,
    private professorDisciplinaService: ProfessorDisciplinaService,
  ) {}

  async findByAluno(id_aluno: number) {
    return this.db.notas_finais.findMany({
      where: { id_aluno },
      include: { disciplinas: { select: { nome: true, codigo: true } } },
    });
  }

  async findByProfessor(id_turma: bigint, id_disciplina: bigint, professor: AuthUser) {
    await this.professorDisciplinaService.verificar(
      professor.id_professor as number,
      id_disciplina,
    );

    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: { id_disciplina, alunos: { id_turma } },
      include: {
        alunos: {
          include: {
            usuarios: { select: { nome: true } },
            turmas: { select: { nome: true } },
          },
        },
        disciplinas: { select: { nome: true } },
      },
    });

    const notas = await this.db.notas_finais.findMany({
      where: {
        id_disciplina,
        id_aluno: { in: matriculas.map((m) => m.alunos.id_aluno) },
      },
    });
    const mapaNotas = new Map(notas.map((n) => [Number(n.id_aluno), n]));

    return matriculas.map((m) => {
      const nota = mapaNotas.get(Number(m.alunos.id_aluno));
      return {
        id_turma: Number(id_turma),
        nome_turma: m.alunos.turmas?.nome ?? null,
        id_disciplina: Number(id_disciplina),
        nome_disciplina: m.disciplinas.nome,
        id_aluno: Number(m.alunos.id_aluno),
        matricula: m.alunos.matricula,
        nome_aluno: m.alunos.usuarios.nome,
        nota_final: nota?.nota_final ?? null,
        status_final: nota?.status_final ?? null,
        atualizado_em: nota?.atualizado_em ?? null,
      };
    });
  }

  async salvarNotaFinal(
    id_aluno: bigint,
    id_disciplina: bigint,
    nota_final: number,
    professor: AuthUser,
  ) {
    await this.professorDisciplinaService.verificar(
      professor.id_professor as number,
      id_disciplina,
    );

    const status_final = getStatusFromNota(nota_final);

    const registro = await this.db.notas_finais.upsert({
      where: { id_aluno_id_disciplina: { id_aluno, id_disciplina } },
      create: { id_aluno, id_disciplina, nota_final, status_final },
      update: { nota_final, status_final, atualizado_em: new Date() },
    });

    return {
      ...registro,
      id: Number(registro.id),
      id_aluno: Number(registro.id_aluno),
      id_disciplina: Number(registro.id_disciplina),
    };
  }

  async limparNotaFinal(id_aluno: bigint, id_disciplina: bigint, professor: AuthUser) {
    await this.professorDisciplinaService.verificar(
      professor.id_professor as number,
      id_disciplina,
    );

    await this.db.notas_finais.deleteMany({ where: { id_aluno, id_disciplina } });

    return { sucesso: true };
  }
}
