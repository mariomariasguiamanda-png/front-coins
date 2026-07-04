import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateChamadoDto } from './dto/create-chamado.dto';
import { ResponderChamadoDto } from './dto/responder-chamado.dto';
import { UpdateStatusChamadoDto } from './dto/update-status-chamado.dto';

@Injectable()
export class SuporteService {
  constructor(private db: DatabaseService) {}

  async criarChamado(id_usuario: number, dto: CreateChamadoDto) {
    return this.db.suporte_chamados.create({
      data: { id_usuario, assunto: dto.assunto, mensagem: dto.mensagem },
    });
  }

  async findMeusChamados(id_usuario: number) {
    return this.db.suporte_chamados.findMany({
      where: { id_usuario },
      orderBy: { criado_em: 'desc' },
    });
  }

  async findAll(status?: string) {
    return this.db.suporte_chamados.findMany({
      where: { status },
      include: { usuarios: { select: { nome: true, email: true, tipo_usuario: true } } },
      orderBy: { criado_em: 'desc' },
    });
  }

  private async buscarChamado(id_chamado: bigint) {
    const chamado = await this.db.suporte_chamados.findUnique({ where: { id_chamado } });
    if (!chamado) throw new NotFoundException('Chamado não encontrado');
    return chamado;
  }

  async responder(id_chamado: bigint, dto: ResponderChamadoDto) {
    await this.buscarChamado(id_chamado);
    return this.db.suporte_chamados.update({
      where: { id_chamado },
      data: { resposta: dto.resposta, status: 'respondido', respondido_em: new Date() },
    });
  }

  async atualizarStatus(id_chamado: bigint, dto: UpdateStatusChamadoDto) {
    await this.buscarChamado(id_chamado);
    return this.db.suporte_chamados.update({
      where: { id_chamado },
      data: { status: dto.status },
    });
  }
}
