import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

// Documento único de configurações do sistema (branding, integrações,
// calendário acadêmico e permissões por papel). A UI do admin edita o
// documento inteiro de uma vez, então persistimos como JSON em uma linha
// da tabela system_settings em vez de normalizar em várias tabelas.
const CHAVE_GERAL = 'geral';

const PADRAO: Record<string, unknown> = {
  branding: {
    logoUrl: '/logo-coins.png',
    primaryColor: '#7C3AED',
    secondaryColor: '#06B6D4',
    fontFamily: 'Roboto',
  },
  periods: [],
  integrations: [],
  permissions: [],
};

@Injectable()
export class ConfiguracoesService {
  constructor(private db: DatabaseService) {}

  async getSettings() {
    const row = await this.db.system_settings.findUnique({ where: { chave: CHAVE_GERAL } });
    if (!row) return PADRAO;
    // Mescla com o padrão para que chaves novas adicionadas depois do primeiro
    // save não sumam da resposta.
    return { ...PADRAO, ...(row.valor as Record<string, unknown>) };
  }

  async updateSettings(valor: Record<string, unknown>) {
    const row = await this.db.system_settings.upsert({
      where: { chave: CHAVE_GERAL },
      create: { chave: CHAVE_GERAL, valor: valor as Prisma.InputJsonValue },
      update: { valor: valor as Prisma.InputJsonValue, atualizado_em: new Date() },
    });
    return { ...PADRAO, ...(row.valor as Record<string, unknown>) };
  }

  // Cria uma notificação in-app para todos os alunos ativos (usado pelo
  // calendário acadêmico ao publicar um evento com "notificar" ligado).
  // Insere via createMany de propósito: broadcast não dispara e-mail por
  // aluno, senão um evento viraria centenas de envios de uma vez.
  async broadcastParaAlunos(titulo: string, mensagem: string, categoria = 'sistema') {
    const alunos = await this.db.usuarios.findMany({
      where: { tipo_usuario: 'aluno', status: 'ativo' },
      select: { id_usuario: true },
    });

    if (alunos.length === 0) return { notificados: 0 };

    const { count } = await this.db.notificacoes.createMany({
      data: alunos.map((a) => ({
        id_usuario: a.id_usuario,
        titulo,
        mensagem,
        tipo: 'info',
        categoria,
      })),
    });

    return { notificados: count };
  }
}
