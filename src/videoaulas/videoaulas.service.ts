import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

const PERCENTUAL_CONCLUSAO = 90;

@Injectable()
export class VideoaulasService {
  constructor(private db: DatabaseService) {}

  async findByAluno(id_aluno: number, id_disciplina?: bigint) {
    const videoaulas = await this.db.videoaulas.findMany({
      where: {
        ativo: true,
        ...(id_disciplina !== undefined ? { id_disciplina } : {}),
      },
      include: {
        aluno_videoaula: { where: { id_aluno } },
        disciplinas: { select: { nome: true } },
      },
      orderBy: { data_criacao: 'desc' },
    });

    return videoaulas.map((v) => ({
      ...v,
      status: v.aluno_videoaula[0]?.status ?? 'pendente',
      percentual_assistido: v.aluno_videoaula[0]?.percentual_assistido ?? 0,
      aluno_videoaula: undefined,
    }));
  }

  async findOne(id: bigint, id_aluno: number) {
    const videoaula = await this.db.videoaulas.findUnique({
      where: { id_videoaula: id },
      include: { aluno_videoaula: { where: { id_aluno } } },
    });
    if (!videoaula) throw new NotFoundException('Videoaula não encontrada');

    return {
      ...videoaula,
      status: videoaula.aluno_videoaula[0]?.status ?? 'pendente',
      percentual_assistido: videoaula.aluno_videoaula[0]?.percentual_assistido ?? 0,
      aluno_videoaula: undefined,
    };
  }

  async atualizarProgresso(
    id_videoaula: bigint,
    id_aluno: number,
    percentual_assistido: number,
  ) {
    const videoaula = await this.db.videoaulas.findUnique({
      where: { id_videoaula },
    });
    if (!videoaula) throw new NotFoundException('Videoaula não encontrada');

    const concluida = percentual_assistido >= PERCENTUAL_CONCLUSAO;

    return this.db.aluno_videoaula.upsert({
      where: { id_aluno_id_videoaula: { id_aluno, id_videoaula } },
      create: {
        id_aluno,
        id_videoaula,
        percentual_assistido,
        status: concluida ? 'assistida' : 'pendente',
        assistido_em: concluida ? new Date() : null,
      },
      update: {
        percentual_assistido,
        status: concluida ? 'assistida' : 'pendente',
        assistido_em: concluida ? new Date() : undefined,
      },
    });
  }
}
