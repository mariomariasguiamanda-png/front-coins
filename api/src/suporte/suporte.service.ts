import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MailService } from '../common/mail/mail.service';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
import { CreateChamadoDto } from './dto/create-chamado.dto';
import { ResponderChamadoDto } from './dto/responder-chamado.dto';
import { UpdateStatusChamadoDto } from './dto/update-status-chamado.dto';

@Injectable()
export class SuporteService {
  constructor(
    private db: DatabaseService,
    private mailService: MailService,
    private notificacoesService: NotificacoesService,
  ) {}

  async criarChamado(id_usuario: number, dto: CreateChamadoDto, anexos: string[] = []) {
    const chamado = await this.db.suporte_chamados.create({
      data: { id_usuario, assunto: dto.assunto, mensagem: dto.mensagem, anexos },
      include: { usuarios: { select: { nome: true, email: true } } },
    });

    await this.mailService.sendNovoChamadoSuporte({
      id_chamado: chamado.id_chamado,
      assunto: chamado.assunto,
      mensagem: chamado.mensagem,
      usuarioNome: chamado.usuarios.nome,
      usuarioEmail: chamado.usuarios.email,
      anexos,
    });

    return chamado;
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
    const chamado = await this.buscarChamado(id_chamado);
    const atualizado = await this.db.suporte_chamados.update({
      where: { id_chamado },
      data: { resposta: dto.resposta, status: 'respondido', respondido_em: new Date() },
    });

    // Avisa quem abriu o chamado que a resposta chegou (in-app + e-mail).
    await this.notificacoesService.criar({
      id_usuario: Number(chamado.id_usuario),
      titulo: 'Seu chamado de suporte foi respondido',
      mensagem: `Chamado #${Number(id_chamado)}${chamado.assunto ? ` ("${chamado.assunto}")` : ''}: ${dto.resposta}`,
      tipo: 'info',
      categoria: 'sistema',
    });

    return atualizado;
  }

  async atualizarStatus(id_chamado: bigint, dto: UpdateStatusChamadoDto) {
    await this.buscarChamado(id_chamado);
    return this.db.suporte_chamados.update({
      where: { id_chamado },
      data: { status: dto.status },
    });
  }

  // ===== FAQs (categorias + perguntas) =====

  async listarFaqs() {
    const categorias = await this.db.faq_categorias.findMany({
      include: { faqs: { orderBy: { id_faq: 'asc' } } },
      orderBy: { id_categoria: 'asc' },
    });
    return categorias.map((c) => ({
      id_categoria: Number(c.id_categoria),
      nome: c.nome,
      perguntas: c.faqs.map((f) => ({
        id_faq: Number(f.id_faq),
        pergunta: f.pergunta,
        resposta: f.resposta,
      })),
    }));
  }

  async criarFaqCategoria(nome: string) {
    const cat = await this.db.faq_categorias.create({ data: { nome } });
    return { id_categoria: Number(cat.id_categoria), nome: cat.nome, perguntas: [] };
  }

  async renomearFaqCategoria(id_categoria: bigint, nome: string) {
    const cat = await this.db.faq_categorias.update({ where: { id_categoria }, data: { nome } });
    return { id_categoria: Number(cat.id_categoria), nome: cat.nome };
  }

  async excluirFaqCategoria(id_categoria: bigint) {
    await this.db.faq_categorias.delete({ where: { id_categoria } });
    return { sucesso: true };
  }

  async criarFaq(id_categoria: bigint, pergunta: string, resposta: string) {
    const faq = await this.db.faqs.create({ data: { id_categoria, pergunta, resposta } });
    return { id_faq: Number(faq.id_faq), pergunta: faq.pergunta, resposta: faq.resposta };
  }

  async atualizarFaq(id_faq: bigint, pergunta: string, resposta: string) {
    const faq = await this.db.faqs.update({ where: { id_faq }, data: { pergunta, resposta } });
    return { id_faq: Number(faq.id_faq), pergunta: faq.pergunta, resposta: faq.resposta };
  }

  async excluirFaq(id_faq: bigint) {
    await this.db.faqs.delete({ where: { id_faq } });
    return { sucesso: true };
  }

  // ===== Respostas padrão do suporte =====

  async listarRespostasPadrao() {
    const rows = await this.db.suporte_respostas_padrao.findMany({
      orderBy: { id_resposta: 'asc' },
    });
    return rows.map((r) => ({
      id_resposta: Number(r.id_resposta),
      categoria: r.categoria,
      titulo: r.titulo,
      texto: r.texto,
      tags: r.tags,
    }));
  }

  async criarRespostaPadrao(dados: { categoria: string; titulo: string; texto: string; tags?: string[] }) {
    const r = await this.db.suporte_respostas_padrao.create({
      data: {
        categoria: dados.categoria,
        titulo: dados.titulo,
        texto: dados.texto,
        tags: dados.tags ?? [],
      },
    });
    return { id_resposta: Number(r.id_resposta), categoria: r.categoria, titulo: r.titulo, texto: r.texto, tags: r.tags };
  }

  async atualizarRespostaPadrao(
    id_resposta: bigint,
    dados: { categoria?: string; titulo?: string; texto?: string; tags?: string[] },
  ) {
    const r = await this.db.suporte_respostas_padrao.update({
      where: { id_resposta },
      data: dados,
    });
    return { id_resposta: Number(r.id_resposta), categoria: r.categoria, titulo: r.titulo, texto: r.texto, tags: r.tags };
  }

  async excluirRespostaPadrao(id_resposta: bigint) {
    await this.db.suporte_respostas_padrao.delete({ where: { id_resposta } });
    return { sucesso: true };
  }
}
