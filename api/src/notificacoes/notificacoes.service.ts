import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class NotificacoesService {
  constructor(private db: DatabaseService) {}

  async criar(dados: {
    id_usuario: number;
    titulo: string;
    mensagem: string;
    tipo?: string;
    categoria?: string;
    disciplina?: string;
  }) {
    return this.db.notificacoes.create({ data: dados });
  }

  async findByUsuario(id_usuario: number) {
    return this.db.notificacoes.findMany({
      where: { id_usuario },
      orderBy: { criado_em: 'desc' },
    });
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
