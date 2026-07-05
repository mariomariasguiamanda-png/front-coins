import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
import { EntregarAtividadeDto } from './dto/entregar-atividade.dto';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { CreateQuestaoDto } from './dto/create-questao.dto';
import { UpdateQuestaoDto } from './dto/update-questao.dto';
import type { AuthUser } from '../common/types/auth-user';
import type { questoes_atividade } from '@prisma/client';

@Injectable()
export class AtividadesService {
  constructor(
    private db: DatabaseService,
    private notificacoesService: NotificacoesService,
  ) {}

  private async verificarProfessorLecionaDisciplina(
    id_professor: number,
    id_disciplina: bigint,
  ) {
    const vinculo = await this.db.professor_disciplina.findUnique({
      where: { id_professor_id_disciplina: { id_professor, id_disciplina } },
    });
    if (!vinculo) {
      throw new ForbiddenException('Você não leciona essa disciplina');
    }
  }

  private async buscarAtividadeDoProfessor(id_atividade: bigint, id_professor: number) {
    const atividade = await this.db.atividades.findUnique({ where: { id_atividade } });
    if (!atividade) throw new NotFoundException('Atividade não encontrada');
    if (Number(atividade.id_professor) !== id_professor) {
      throw new ForbiddenException('Esta atividade não pertence a você');
    }
    return atividade;
  }

  async findByProfessor(id_professor: number, id_disciplina?: bigint) {
    const atividades = await this.db.atividades.findMany({
      where: {
        id_professor,
        ...(id_disciplina !== undefined ? { id_disciplina } : {}),
      },
      include: {
        disciplinas: { select: { nome: true } },
        _count: { select: { aluno_atividade: true, questoes_atividade: true } },
      },
      orderBy: { data_criacao: 'desc' },
    });

    return Promise.all(
      atividades.map(async (a) => {
        const [totalAlunos, entregues, corrigidas] = await Promise.all([
          this.db.matriculas_aluno_disciplina.count({ where: { id_disciplina: a.id_disciplina } }),
          this.db.aluno_atividade.count({
            where: { id_atividade: a.id_atividade, status: 'entregue' },
          }),
          this.db.aluno_atividade.count({
            where: { id_atividade: a.id_atividade, status: 'corrigida' },
          }),
        ]);

        const status = entregues + corrigidas === 0 ? 'pendente' : entregues === 0 ? 'corrigida' : 'entregue';

        return {
          ...a,
          total_alunos: totalAlunos,
          entregues,
          corrigidas,
          status,
        };
      }),
    );
  }

  async findEntregas(id_atividade: bigint, id_professor: number) {
    await this.buscarAtividadeDoProfessor(id_atividade, id_professor);

    const [entregas, respostas] = await Promise.all([
      this.db.aluno_atividade.findMany({
        where: { id_atividade },
        include: {
          alunos: { select: { matricula: true, usuarios: { select: { nome: true } } } },
        },
        orderBy: { data_entrega: 'desc' },
      }),
      this.db.respostas_atividade_aluno.findMany({
        where: { id_atividade },
        include: {
          questoes_atividade: {
            select: { enunciado: true, tipo: true, ordem: true, peso: true },
          },
        },
        orderBy: { questoes_atividade: { ordem: 'asc' } },
      }),
    ]);

    const respostasPorAluno = new Map<number, typeof respostas>();
    for (const r of respostas) {
      const id = Number(r.id_aluno);
      if (!respostasPorAluno.has(id)) respostasPorAluno.set(id, []);
      respostasPorAluno.get(id)!.push(r);
    }

    return entregas.map((e) => ({
      ...e,
      respostas_questoes: (respostasPorAluno.get(Number(e.id_aluno)) ?? []).map((r) => ({
        id_questao: Number(r.id_questao),
        enunciado: r.questoes_atividade.enunciado,
        tipo: r.questoes_atividade.tipo,
        peso: r.questoes_atividade.peso ?? 1,
        resposta: r.resposta,
        correta: r.correta,
        pontuacao: r.pontuacao !== null ? Number(r.pontuacao) : null,
      })),
    }));
  }

  async createAtividade(dto: CreateAtividadeDto, professor: AuthUser) {
    const id_disciplina = BigInt(dto.id_disciplina);
    await this.verificarProfessorLecionaDisciplina(
      professor.id_professor as number,
      id_disciplina,
    );

    return this.db.atividades.create({
      data: {
        id_disciplina,
        id_professor: professor.id_professor as number,
        titulo: dto.titulo,
        descricao: dto.descricao,
        recompensa_moedas: dto.recompensa_moedas,
        tipo: dto.tipo,
        data_vencimento: dto.data_vencimento ? new Date(dto.data_vencimento) : undefined,
      },
    });
  }

  async updateAtividade(id_atividade: bigint, dto: UpdateAtividadeDto, professor: AuthUser) {
    await this.buscarAtividadeDoProfessor(id_atividade, professor.id_professor as number);

    return this.db.atividades.update({
      where: { id_atividade },
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao,
        recompensa_moedas: dto.recompensa_moedas,
        tipo: dto.tipo,
        data_vencimento: dto.data_vencimento ? new Date(dto.data_vencimento) : undefined,
        ativo: dto.ativo,
      },
    });
  }

  async removeAtividade(id_atividade: bigint, professor: AuthUser) {
    await this.buscarAtividadeDoProfessor(id_atividade, professor.id_professor as number);
    return this.db.atividades.update({ where: { id_atividade }, data: { ativo: false } });
  }

  async createQuestao(id_atividade: bigint, dto: CreateQuestaoDto, professor: AuthUser) {
    await this.buscarAtividadeDoProfessor(id_atividade, professor.id_professor as number);

    let ordem = dto.ordem;
    if (ordem === undefined) {
      const ultima = await this.db.questoes_atividade.findFirst({
        where: { id_atividade },
        orderBy: { ordem: 'desc' },
      });
      ordem = (ultima?.ordem ?? 0) + 1;
    }

    return this.db.questoes_atividade.create({
      data: {
        id_atividade,
        tipo: dto.tipo,
        enunciado: dto.enunciado,
        correta: dto.correta,
        alternativa_a: dto.alternativa_a,
        alternativa_b: dto.alternativa_b,
        alternativa_c: dto.alternativa_c,
        alternativa_d: dto.alternativa_d,
        letra_correta: dto.letra_correta,
        ordem,
        peso: dto.peso ?? 1,
      },
    });
  }

  private async buscarQuestaoDoProfessor(id_questao: bigint, id_professor: number) {
    const questao = await this.db.questoes_atividade.findUnique({
      where: { id_questao },
      include: { atividades: true },
    });
    if (!questao) throw new NotFoundException('Questão não encontrada');
    if (Number(questao.atividades.id_professor) !== id_professor) {
      throw new ForbiddenException('Esta questão não pertence a você');
    }
    return questao;
  }

  async updateQuestao(id_questao: bigint, dto: UpdateQuestaoDto, professor: AuthUser) {
    await this.buscarQuestaoDoProfessor(id_questao, professor.id_professor as number);
    return this.db.questoes_atividade.update({ where: { id_questao }, data: dto });
  }

  async removeQuestao(id_questao: bigint, professor: AuthUser) {
    await this.buscarQuestaoDoProfessor(id_questao, professor.id_professor as number);
    return this.db.questoes_atividade.delete({ where: { id_questao } });
  }

  async findByAluno(id_aluno: number, id_disciplina?: bigint) {
    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: { id_aluno },
      select: { id_disciplina: true },
    });
    const idsDisciplinas = matriculas.map((m) => m.id_disciplina);

    if (idsDisciplinas.length === 0) return [];
    if (id_disciplina !== undefined && !idsDisciplinas.some((id) => id === id_disciplina)) {
      return [];
    }

    const atividades = await this.db.atividades.findMany({
      where: {
        id_disciplina: id_disciplina !== undefined ? id_disciplina : { in: idsDisciplinas },
        ativo: true,
      },
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
      data_entrega: a.aluno_atividade[0]?.data_entrega ?? null,
      aluno_atividade: undefined,
    }));
  }

  async findOne(id: bigint, user: AuthUser) {
    const podeVerGabarito = user.tipo_usuario === 'professor';

    const atividade = await this.db.atividades.findUnique({
      where: { id_atividade: id },
      include: {
        disciplinas: { select: { nome: true } },
        questoes_atividade: {
          orderBy: { ordem: 'asc' },
          select: {
            id_questao: true,
            tipo: true,
            enunciado: true,
            alternativa_a: true,
            alternativa_b: true,
            alternativa_c: true,
            alternativa_d: true,
            ordem: true,
            correta: podeVerGabarito,
            letra_correta: podeVerGabarito,
          },
        },
        ...(user.tipo_usuario === 'aluno'
          ? { aluno_atividade: { where: { id_aluno: user.id_aluno as number } } }
          : {}),
      },
    });
    if (!atividade) throw new NotFoundException('Atividade não encontrada');

    if (user.tipo_usuario === 'aluno') {
      const progresso = (atividade as typeof atividade & { aluno_atividade?: any[] })
        .aluno_atividade?.[0];

      // Respostas que o próprio aluno já marcou (pra reexibir depois de entregue/
      // corrigida - sem isso a tela "esquecia" o que ele tinha escolhido).
      const respostasDoAluno = await this.db.respostas_atividade_aluno.findMany({
        where: { id_atividade: id, id_aluno: user.id_aluno as number },
        select: { id_questao: true, resposta: true },
      });
      const mapaRespostas = new Map(
        respostasDoAluno.map((r) => [String(r.id_questao), r.resposta]),
      );

      return {
        ...atividade,
        questoes_atividade: atividade.questoes_atividade.map((q) => ({
          ...q,
          resposta_aluno: mapaRespostas.get(String(q.id_questao)) ?? null,
        })),
        status: progresso?.status ?? 'pendente',
        nota: progresso?.nota ?? null,
        feedback: progresso?.feedback ?? null,
        data_entrega: progresso?.data_entrega ?? null,
        aluno_atividade: undefined,
      };
    }

    return atividade;
  }

  private avaliarResposta(
    questao: Pick<questoes_atividade, 'tipo' | 'correta' | 'letra_correta'>,
    respostaBruta: string,
  ): boolean | null {
    const resposta = respostaBruta.trim().toLowerCase();

    if (questao.tipo === 'vf') {
      if (questao.correta === null) return null;
      const verdadeiro = ['true', 'v', 'verdadeiro', '1'].includes(resposta);
      const falso = ['false', 'f', 'falso', '0'].includes(resposta);
      if (!verdadeiro && !falso) return null;
      return verdadeiro === questao.correta;
    }

    if (questao.tipo === 'multipla') {
      if (!questao.letra_correta) return null;
      return resposta.toUpperCase() === questao.letra_correta.toUpperCase();
    }

    // 'descritiva' (resposta em texto livre) não tem gabarito automático -
    // fica sem nota sugerida até o professor corrigir manualmente.
    return null;
  }

  async entregar(id_atividade: bigint, id_aluno: number, dto: EntregarAtividadeDto) {
    const atividade = await this.db.atividades.findUnique({
      where: { id_atividade },
      include: { questoes_atividade: true },
    });
    if (!atividade) throw new NotFoundException('Atividade não encontrada');

    if (dto.respostas && dto.respostas.length > 0) {
      const questoesPorId = new Map(
        atividade.questoes_atividade.map((q) => [q.id_questao.toString(), q]),
      );

      const operacoes = dto.respostas.map((r) => {
        const questao = questoesPorId.get(r.id_questao);
        const correta = questao ? this.avaliarResposta(questao, r.resposta) : null;
        const peso = questao?.peso ?? 1;
        // vf/multipla já têm gabarito, então já saem com pontuação (peso se
        // acertou, 0 se errou); descritiva fica sem pontuação até o professor
        // corrigir manualmente.
        const pontuacao = correta === null ? null : correta ? peso : 0;

        return this.db.respostas_atividade_aluno.upsert({
          where: {
            id_atividade_id_questao_id_aluno: {
              id_atividade,
              id_questao: BigInt(r.id_questao),
              id_aluno,
            },
          },
          create: {
            id_atividade,
            id_questao: BigInt(r.id_questao),
            id_aluno,
            resposta: r.resposta,
            correta,
            pontuacao,
          },
          update: { resposta: r.resposta, correta, pontuacao },
        });
      });

      await this.db.$transaction(operacoes);
    }

    await this.db.aluno_atividade.upsert({
      where: { id_aluno_id_atividade: { id_aluno, id_atividade } },
      create: {
        id_atividade,
        id_aluno,
        status: 'entregue',
        data_entrega: new Date(),
        resposta_texto: dto.resposta_texto,
      },
      update: {
        status: 'entregue',
        data_entrega: new Date(),
        resposta_texto: dto.resposta_texto,
      },
    });

    return this.recalcularNotaESalvar(id_atividade, id_aluno);
  }

  // Nota sugerida = soma dos pontos já avaliados (objetivas na hora da entrega,
  // descritivas quando o professor corrige) dividida pela soma dos pesos
  // dessas mesmas questões, escalada pra 0-10. Questões descritivas ainda sem
  // correção não entram na conta - por isso a nota sobe conforme o professor
  // vai avaliando as dissertativas.
  private async recalcularNotaESalvar(id_atividade: bigint, id_aluno: number) {
    const respostas = await this.db.respostas_atividade_aluno.findMany({
      where: { id_atividade, id_aluno },
      include: { questoes_atividade: { select: { peso: true } } },
    });

    let pontosObtidos = 0;
    let pesoAvaliado = 0;
    for (const r of respostas) {
      if (r.pontuacao === null) continue;
      pontosObtidos += Number(r.pontuacao);
      pesoAvaliado += r.questoes_atividade.peso ?? 1;
    }

    const notaSugerida =
      pesoAvaliado > 0 ? Math.round((pontosObtidos / pesoAvaliado) * 1000) / 100 : null;

    return this.db.aluno_atividade.update({
      where: { id_aluno_id_atividade: { id_aluno, id_atividade } },
      data: { nota: notaSugerida },
    });
  }

  async avaliarQuestaoDescritiva(
    id_atividade: bigint,
    id_questao: bigint,
    id_aluno: number,
    pontuacao: number,
    professor: AuthUser,
  ) {
    await this.buscarAtividadeDoProfessor(id_atividade, professor.id_professor as number);

    const questao = await this.db.questoes_atividade.findUnique({ where: { id_questao } });
    if (!questao || Number(questao.id_atividade) !== Number(id_atividade)) {
      throw new NotFoundException('Pergunta não encontrada nesta atividade');
    }

    const peso = questao.peso ?? 1;
    if (pontuacao > peso) {
      throw new UnprocessableEntityException(`A pontuação máxima desta pergunta é ${peso}`);
    }

    const resposta = await this.db.respostas_atividade_aluno.findUnique({
      where: { id_atividade_id_questao_id_aluno: { id_atividade, id_questao, id_aluno } },
    });
    if (!resposta) throw new NotFoundException('O aluno ainda não respondeu esta pergunta');

    await this.db.respostas_atividade_aluno.update({
      where: { id_atividade_id_questao_id_aluno: { id_atividade, id_questao, id_aluno } },
      data: { pontuacao },
    });

    return this.recalcularNotaESalvar(id_atividade, id_aluno);
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
      include: { disciplinas: { select: { nome: true } } },
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

    const entrega = await this.db.$transaction(async (tx) => {
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

    const aluno = await this.db.alunos.findUnique({
      where: { id_aluno },
      select: { id_usuario: true },
    });

    if (aluno) {
      await this.notificacoesService.criar({
        id_usuario: Number(aluno.id_usuario),
        titulo: 'Atividade corrigida',
        mensagem: feedback
          ? `Sua atividade "${atividade.titulo}" foi corrigida. Nota: ${nota}. Feedback do professor: "${feedback}"`
          : `Sua atividade "${atividade.titulo}" foi corrigida. Nota: ${nota}.`,
        tipo: 'success',
        categoria: 'nota',
        disciplina: atividade.disciplinas.nome,
        referencia_tipo: 'atividade',
        referencia_id: id_atividade,
      });
    }

    return entrega;
  }
}
