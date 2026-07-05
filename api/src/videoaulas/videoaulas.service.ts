import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ProfessorDisciplinaService } from '../common/services/professor-disciplina.service';
import { CreateVideoaulaDto } from './dto/create-videoaula.dto';
import { UpdateVideoaulaDto } from './dto/update-videoaula.dto';
import type { AuthUser } from '../common/types/auth-user';

const PERCENTUAL_CONCLUSAO = 90;

@Injectable()
export class VideoaulasService {
  constructor(
    private db: DatabaseService,
    private professorDisciplinaService: ProfessorDisciplinaService,
  ) {}

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

  async findByProfessor(id_professor: number) {
    const videoaulas = await this.db.videoaulas.findMany({
      where: { id_professor, ativo: true },
      include: {
        disciplinas: { select: { nome: true } },
        aluno_videoaula: {
          include: { alunos: { include: { usuarios: { select: { nome: true } } } } },
        },
      },
      orderBy: { data_criacao: 'desc' },
    });

    return videoaulas.map((v) => {
      const duracao = v.duracao_segundos ?? 0;
      const studentsWatched = v.aluno_videoaula.map((av) => {
        const progress = av.percentual_assistido ?? 0;
        const segundosAssistidos = Math.round((duracao * progress) / 100);
        return {
          id: Number(av.id_aluno),
          name: av.alunos.usuarios.nome,
          watchedAt: av.assistido_em,
          completed: av.status === 'assistida',
          progress,
          timeWatchedSegundos: segundosAssistidos,
        };
      });

      return {
        ...v,
        views: v.aluno_videoaula.length,
        studentsWatched,
        aluno_videoaula: undefined,
      };
    });
  }

  private async buscarVideoaulaDoProfessor(id_videoaula: bigint, id_professor: number) {
    const videoaula = await this.db.videoaulas.findUnique({ where: { id_videoaula } });
    if (!videoaula) throw new NotFoundException('Videoaula não encontrada');
    if (Number(videoaula.id_professor) !== id_professor) {
      throw new ForbiddenException('Esta videoaula não pertence a você');
    }
    return videoaula;
  }

  async create(dto: CreateVideoaulaDto, professor: AuthUser) {
    const id_disciplina = BigInt(dto.id_disciplina);
    await this.professorDisciplinaService.verificar(
      professor.id_professor as number,
      id_disciplina,
    );

    return this.db.videoaulas.create({
      data: {
        id_disciplina,
        id_professor: professor.id_professor as number,
        titulo: dto.titulo,
        descricao: dto.descricao,
        url_video: dto.url_video,
        duracao_segundos: dto.duracao_segundos,
      },
    });
  }

  async update(id_videoaula: bigint, dto: UpdateVideoaulaDto, professor: AuthUser) {
    await this.buscarVideoaulaDoProfessor(id_videoaula, professor.id_professor as number);
    return this.db.videoaulas.update({ where: { id_videoaula }, data: dto });
  }

  async remove(id_videoaula: bigint, professor: AuthUser) {
    await this.buscarVideoaulaDoProfessor(id_videoaula, professor.id_professor as number);
    return this.db.videoaulas.update({ where: { id_videoaula }, data: { ativo: false } });
  }
}
