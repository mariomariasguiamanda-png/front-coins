import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ProfessorDisciplinaService } from '../common/services/professor-disciplina.service';
import { CreateResumoDto } from './dto/create-resumo.dto';
import { UpdateResumoDto } from './dto/update-resumo.dto';
import type { AuthUser } from '../common/types/auth-user';

@Injectable()
export class ResumosService {
  constructor(
    private db: DatabaseService,
    private professorDisciplinaService: ProfessorDisciplinaService,
  ) {}

  async findByAluno(id_aluno: number, id_disciplina?: bigint) {
    const resumos = await this.db.resumos.findMany({
      where: {
        ativo: true,
        ...(id_disciplina !== undefined ? { id_disciplina } : {}),
      },
      include: {
        aluno_resumo: { where: { id_aluno } },
        disciplinas: { select: { nome: true } },
      },
      orderBy: { data_criacao: 'desc' },
    });

    return resumos.map((r) => ({
      ...r,
      status: r.aluno_resumo[0]?.status ?? 'pendente',
      lido_em: r.aluno_resumo[0]?.lido_em ?? null,
      aluno_resumo: undefined,
    }));
  }

  async findOne(id: bigint, id_aluno: number) {
    const resumo = await this.db.resumos.findUnique({
      where: { id_resumo: id },
      include: { aluno_resumo: { where: { id_aluno } } },
    });
    if (!resumo) throw new NotFoundException('Resumo não encontrado');

    return {
      ...resumo,
      status: resumo.aluno_resumo[0]?.status ?? 'pendente',
      lido_em: resumo.aluno_resumo[0]?.lido_em ?? null,
      aluno_resumo: undefined,
    };
  }

  async concluir(id_resumo: bigint, id_aluno: number) {
    const resumo = await this.db.resumos.findUnique({ where: { id_resumo } });
    if (!resumo) throw new NotFoundException('Resumo não encontrado');

    return this.db.aluno_resumo.upsert({
      where: { id_aluno_id_resumo: { id_aluno, id_resumo } },
      create: { id_aluno, id_resumo, status: 'lido', lido_em: new Date() },
      update: { status: 'lido', lido_em: new Date() },
    });
  }

  async findByProfessor(id_professor: number) {
    const resumos = await this.db.resumos.findMany({
      where: { id_professor, ativo: true },
      include: { disciplinas: { select: { nome: true } } },
      orderBy: { data_criacao: 'desc' },
    });

    const contagens = await this.db.aluno_resumo.groupBy({
      by: ['id_resumo'],
      where: { id_resumo: { in: resumos.map((r) => r.id_resumo) }, status: 'lido' },
      _count: { _all: true },
    });
    const mapaViews = new Map(contagens.map((c) => [Number(c.id_resumo), c._count._all]));

    return resumos.map((r) => ({
      ...r,
      views: mapaViews.get(Number(r.id_resumo)) ?? 0,
    }));
  }

  private async buscarResumoDoProfessor(id_resumo: bigint, id_professor: number) {
    const resumo = await this.db.resumos.findUnique({ where: { id_resumo } });
    if (!resumo) throw new NotFoundException('Resumo não encontrado');
    if (Number(resumo.id_professor) !== id_professor) {
      throw new ForbiddenException('Este resumo não pertence a você');
    }
    return resumo;
  }

  async create(dto: CreateResumoDto, professor: AuthUser) {
    const id_disciplina = BigInt(dto.id_disciplina);
    await this.professorDisciplinaService.verificar(
      professor.id_professor as number,
      id_disciplina,
    );

    return this.db.resumos.create({
      data: {
        id_disciplina,
        id_professor: professor.id_professor as number,
        titulo: dto.titulo,
        conteudo: dto.conteudo,
        links: dto.links ?? [],
      },
    });
  }

  async update(id_resumo: bigint, dto: UpdateResumoDto, professor: AuthUser) {
    await this.buscarResumoDoProfessor(id_resumo, professor.id_professor as number);
    return this.db.resumos.update({ where: { id_resumo }, data: dto });
  }

  async remove(id_resumo: bigint, professor: AuthUser) {
    await this.buscarResumoDoProfessor(id_resumo, professor.id_professor as number);
    return this.db.resumos.update({ where: { id_resumo }, data: { ativo: false } });
  }

  async adicionarAnexos(id_resumo: bigint, professor: AuthUser, novosCaminhos: string[]) {
    await this.buscarResumoDoProfessor(id_resumo, professor.id_professor as number);
    return this.db.resumos.update({
      where: { id_resumo },
      data: { anexos_urls: { push: novosCaminhos } },
    });
  }

  async removerAnexo(id_resumo: bigint, professor: AuthUser, caminho: string) {
    const resumo = await this.buscarResumoDoProfessor(id_resumo, professor.id_professor as number);
    return this.db.resumos.update({
      where: { id_resumo },
      data: { anexos_urls: resumo.anexos_urls.filter((a) => a !== caminho) },
    });
  }
}
