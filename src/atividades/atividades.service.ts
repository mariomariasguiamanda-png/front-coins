import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { EntregarAtividadeDto } from './dto/entregar-atividade.dto';
import type { AuthUser } from '../common/types/auth-user';

@Injectable()
export class AtividadesService {
  constructor(private db: DatabaseService) {}

  async findByAluno(id_aluno: number) {
    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: { id_aluno },
      select: { id_disciplina: true },
    });
    const idsDisciplinas = matriculas.map((m) => m.id_disciplina);

    if (idsDisciplinas.length === 0) return [];

    const atividades = await this.db.atividades.findMany({
      where: { id_disciplina: { in: idsDisciplinas }, ativo: true },
      include: {
        aluno_atividade: { where: { id_aluno } },
        disciplinas: { select: { nome: true } },
      },
      orderBy: { data_vencimento: 'asc' },
    });

    return atividades.map((a) => ({
      ...a,
      status: a.aluno_atividade[0]?.status ?? 'pendente',
      nota: a.aluno_atividade[0]?.nota ?? null,
      feedback: a.aluno_atividade[0]?.feedback ?? null,
      aluno_atividade: undefined,
    }));
  }

  async findOne(id: bigint) {
    const atividade = await this.db.atividades.findUnique({
      where: { id_atividade: id },
    });
    if (!atividade) throw new NotFoundException('Atividade não encontrada');
    return atividade;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async entregar(id_atividade: bigint, id_aluno: number, _dto: EntregarAtividadeDto) {
    const atividade = await this.db.atividades.findUnique({
      where: { id_atividade },
    });
    if (!atividade) throw new NotFoundException('Atividade não encontrada');

    return this.db.aluno_atividade.upsert({
      where: { id_aluno_id_atividade: { id_aluno, id_atividade } },
      create: {
        id_atividade,
        id_aluno,
        status: 'entregue',
        data_entrega: new Date(),
      },
      update: {
        status: 'entregue',
        data_entrega: new Date(),
      },
    });
  }

  async corrigir(
    id_atividade: bigint,
    id_aluno: number,
    nota: number,
    feedback: string | undefined,
    professor: AuthUser,
  ) {
    const atividade = await this.db.atividades.findUnique({
      where: { id_atividade },
    });
    if (!atividade) throw new NotFoundException('Atividade não encontrada');

    if (
      professor.id_professor !== undefined &&
      Number(atividade.id_professor) !== professor.id_professor
    ) {
      throw new ForbiddenException(
        'Somente o professor responsável pode corrigir esta atividade',
      );
    }

    return this.db.$transaction(async (tx) => {
      const entrega = await tx.aluno_atividade.update({
        where: { id_aluno_id_atividade: { id_aluno, id_atividade } },
        data: { status: 'corrigida', nota, feedback },
      });

      const recompensa = atividade.recompensa_moedas ?? 0;
      if (recompensa > 0) {
        await tx.moedas_saldo.upsert({
          where: {
            id_aluno_id_disciplina: {
              id_aluno,
              id_disciplina: atividade.id_disciplina,
            },
          },
          create: {
            id_aluno,
            id_disciplina: atividade.id_disciplina,
            saldo: recompensa,
          },
          update: { saldo: { increment: recompensa } },
        });

        await tx.transacoes_moedas.create({
          data: {
            id_aluno,
            id_disciplina: atividade.id_disciplina,
            tipo: 'credito_atividade',
            quantidade: recompensa,
            origem_atividade_id: id_atividade,
            criado_por_usuario_id: professor.sub,
            descricao: `Recompensa por correção da atividade "${atividade.titulo}"`,
          },
        });
      }

      return entrega;
    });
  }
}
