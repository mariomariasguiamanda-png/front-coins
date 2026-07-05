import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MailService } from '../common/mail/mail.service';
import type { AuthUser } from '../common/types/auth-user';

const JANELA_ALERTA_PRAZO_MS = 48 * 60 * 60 * 1000;

@Injectable()
export class NotificacoesService {
  private readonly logger = new Logger(NotificacoesService.name);

  constructor(
    private db: DatabaseService,
    private mailService: MailService,
  ) {}

  async criar(dados: {
    id_usuario: number;
    titulo: string;
    mensagem: string;
    tipo?: string;
    categoria?: string;
    disciplina?: string;
    referencia_tipo?: string;
    referencia_id?: bigint;
  }) {
    const notificacao = await this.db.notificacoes.create({ data: dados });

    // E-mail é best-effort: um SMTP fora do ar não pode derrubar fluxos como
    // correção de atividade ou a própria listagem de notificações.
    this.enviarEmailNotificacao(dados.id_usuario, dados.titulo, dados.mensagem).catch((err) =>
      this.logger.error('Falha ao enviar e-mail de notificação', err),
    );

    return notificacao;
  }

  private async enviarEmailNotificacao(id_usuario: number, titulo: string, mensagem: string) {
    const usuario = await this.db.usuarios.findUnique({
      where: { id_usuario },
      select: { email: true },
    });
    if (!usuario) return;

    await this.mailService.sendNotificacao(usuario.email, titulo, mensagem);
  }

  async findByUsuario(id_usuario: number) {
    return this.db.notificacoes.findMany({
      where: { id_usuario },
      orderBy: { criado_em: 'desc' },
    });
  }

  // Gera (de forma idempotente) alertas de prazo de entrega e lembretes de
  // revisão/estudo agendados pelo próprio aluno. Sem um scheduler no projeto
  // ainda, isso roda sob demanda sempre que o aluno abre as notificações -
  // suficiente aqui porque notificação só importa quando alguém for olhar.
  async sincronizarAlertasAluno(user: AuthUser) {
    const id_aluno = user.id_aluno as number;
    const id_usuario = user.sub;
    const agora = new Date();

    const matriculas = await this.db.matriculas_aluno_disciplina.findMany({
      where: { id_aluno },
      select: { id_disciplina: true },
    });
    const idsDisciplinas = matriculas.map((m) => m.id_disciplina);

    if (idsDisciplinas.length > 0) {
      const limite = new Date(agora.getTime() + JANELA_ALERTA_PRAZO_MS);

      const atividadesProximas = await this.db.atividades.findMany({
        where: {
          id_disciplina: { in: idsDisciplinas },
          ativo: true,
          data_vencimento: { gte: agora, lte: limite },
        },
        include: {
          disciplinas: { select: { nome: true } },
          aluno_atividade: { where: { id_aluno } },
        },
      });

      for (const atividade of atividadesProximas) {
        const statusAtual = atividade.aluno_atividade[0]?.status;
        const jaEntregou = statusAtual === 'entregue' || statusAtual === 'corrigida';
        if (jaEntregou) continue;

        const jaExiste = await this.db.notificacoes.findFirst({
          where: {
            id_usuario,
            referencia_tipo: 'atividade',
            referencia_id: atividade.id_atividade,
            categoria: 'atividade',
          },
        });
        if (jaExiste) continue;

        const diasRestantes = Math.max(
          1,
          Math.ceil((atividade.data_vencimento!.getTime() - agora.getTime()) / (24 * 60 * 60 * 1000)),
        );

        await this.criar({
          id_usuario,
          titulo: 'Prazo se aproximando',
          mensagem: `Sua atividade "${atividade.titulo}" (${atividade.disciplinas.nome}) vence em ${diasRestantes} dia${diasRestantes > 1 ? 's' : ''}.`,
          tipo: 'warning',
          categoria: 'atividade',
          disciplina: atividade.disciplinas.nome,
          referencia_tipo: 'atividade',
          referencia_id: atividade.id_atividade,
        });
      }
    }

    const eventosPendentes = await this.db.agenda_estudos.findMany({
      where: { id_aluno, concluido: false, data_estudo: { lte: agora } },
    });

    for (const evento of eventosPendentes) {
      const jaExiste = await this.db.notificacoes.findFirst({
        where: {
          id_usuario,
          referencia_tipo: 'agenda_estudo',
          referencia_id: evento.id_evento,
          categoria: 'prazo',
        },
      });
      if (jaExiste) continue;

      const rotulo =
        evento.tipo === 'exam' ? 'Prova' : evento.tipo === 'revision' ? 'Revisão' : 'Estudo';

      await this.criar({
        id_usuario,
        titulo: `${rotulo} agendada`,
        mensagem: `Hoje é o dia de "${evento.titulo}"${evento.assunto ? ` (${evento.assunto})` : ''} - você mesmo agendou isso no seu calendário.`,
        tipo: evento.tipo === 'exam' ? 'warning' : 'info',
        categoria: 'prazo',
        referencia_tipo: 'agenda_estudo',
        referencia_id: evento.id_evento,
      });
    }
  }

  async marcarLida(id_notificacao: bigint, id_usuario: number) {
    const notificacao = await this.db.notificacoes.findUnique({
      where: { id_notificacao },
    });
    if (!notificacao) throw new NotFoundException('Notificação não encontrada');
    if (Number(notificacao.id_usuario) !== id_usuario) {
      throw new ForbiddenException('Esta notificação não pertence ao usuário logado');
    }

    return this.db.notificacoes.update({
      where: { id_notificacao },
      data: { lida: true },
    });
  }

  async marcarTodasLidas(id_usuario: number) {
    const { count } = await this.db.notificacoes.updateMany({
      where: { id_usuario, lida: false },
      data: { lida: true },
    });
    return { atualizadas: count };
  }
}
