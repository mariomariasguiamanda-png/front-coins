import { api } from "@/lib/api";

export type TicketStatus = "aberto" | "em_andamento" | "resolvido";

export type TicketResponse = {
  id: string;
  autorId: string;
  autorNome: string;
  mensagem: string;
  dataHora: string; // ISO
};

export type Ticket = {
  id: string;
  solicitante: string;
  solicitantePerfil?: string;
  tipo: "tecnico" | "pedagogico" | "administrativo";
  descricao: string;
  assunto?: string;
  anexos?: string[];
  status: TicketStatus;
  dataAbertura: string; // ISO
  prazoEstimado: string; // ISO
  responsavel: string | null;
  respostas: TicketResponse[];
};

// O backend guarda uma resposta única por chamado (campo resposta +
// respondido_em); a UI trabalha com lista de respostas, então mapeamos a
// resposta existente como o único item da lista.
const STATUS_API_PARA_UI: Record<string, TicketStatus> = {
  aberto: "aberto",
  em_andamento: "em_andamento",
  respondido: "resolvido",
  fechado: "resolvido",
};
const STATUS_UI_PARA_API: Record<TicketStatus, string> = {
  aberto: "aberto",
  em_andamento: "em_andamento",
  resolvido: "fechado",
};

const PRAZO_PADRAO_MS = 48 * 60 * 60 * 1000;

function mapChamado(row: any): Ticket {
  const abertura = row.criado_em ?? new Date().toISOString();
  return {
    id: String(row.id_chamado),
    solicitante: row.usuarios?.nome ?? "Usuário",
    solicitantePerfil: row.usuarios?.tipo_usuario,
    tipo: "administrativo",
    assunto: row.assunto ?? undefined,
    descricao: row.assunto ? `${row.assunto}${row.mensagem ? ` — ${row.mensagem}` : ""}` : (row.mensagem ?? ""),
    anexos: row.anexos ?? [],
    status: STATUS_API_PARA_UI[row.status ?? "aberto"] ?? "aberto",
    dataAbertura: abertura,
    prazoEstimado: new Date(new Date(abertura).getTime() + PRAZO_PADRAO_MS).toISOString(),
    responsavel: row.resposta ? "Equipe ADM" : null,
    respostas: row.resposta
      ? [
          {
            id: `resp_${row.id_chamado}`,
            autorId: "adm",
            autorNome: "Equipe ADM",
            mensagem: row.resposta,
            dataHora: row.respondido_em ?? abertura,
          },
        ]
      : [],
  };
}

export async function getTickets(): Promise<Ticket[]> {
  const rows = await api.get("/admin/suporte/chamados");
  return (rows ?? []).map(mapChamado);
}

export async function addTicketResponse(
  ticketId: string,
  response: { autorId: string; autorNome: string; mensagem: string },
): Promise<Ticket> {
  const row = await api.patch(`/admin/suporte/chamados/${ticketId}/responder`, {
    resposta: response.mensagem,
  });
  return mapChamado(row);
}

export async function updateTicket(next: Ticket): Promise<Ticket> {
  const row = await api.patch(`/admin/suporte/chamados/${next.id}/status`, {
    status: STATUS_UI_PARA_API[next.status] ?? next.status,
  });
  return mapChamado({ ...row, usuarios: undefined });
}

// ===== FAQs (tabelas faq_categorias + faqs) =====

export type FaqItem = {
  id: string;
  pergunta: string;
  resposta: string;
};

export type FaqCategory = {
  id: string;
  nome: string;
  perguntas: FaqItem[];
};

function mapCategoria(row: any): FaqCategory {
  return {
    id: String(row.id_categoria),
    nome: row.nome,
    perguntas: (row.perguntas ?? []).map((f: any) => ({
      id: String(f.id_faq),
      pergunta: f.pergunta,
      resposta: f.resposta,
    })),
  };
}

export async function getFaqCategories(): Promise<FaqCategory[]> {
  const rows = await api.get("/faqs");
  return (rows ?? []).map(mapCategoria);
}

export async function createFaqCategory(nome: string): Promise<FaqCategory> {
  const row = await api.post("/admin/faqs/categorias", { nome });
  return mapCategoria(row);
}

export async function updateFaqCategory(id: string, nome: string): Promise<FaqCategory> {
  const row = await api.patch(`/admin/faqs/categorias/${id}`, { nome });
  return { ...mapCategoria(row), perguntas: [] };
}

export async function deleteFaqCategory(id: string): Promise<void> {
  await api.delete(`/admin/faqs/categorias/${id}`);
}

export async function addFaqItem(categoryId: string, pergunta: string, resposta: string): Promise<FaqItem> {
  const row = await api.post(`/admin/faqs/categorias/${categoryId}/perguntas`, { pergunta, resposta });
  return { id: String(row.id_faq), pergunta: row.pergunta, resposta: row.resposta };
}

export async function updateFaqItem(
  _categoryId: string,
  faqId: string,
  data: { pergunta: string; resposta: string },
): Promise<FaqItem> {
  const row = await api.patch(`/admin/faqs/${faqId}`, data);
  return { id: String(row.id_faq), pergunta: row.pergunta, resposta: row.resposta };
}

export async function deleteFaqItem(_categoryId: string, faqId: string): Promise<void> {
  await api.delete(`/admin/faqs/${faqId}`);
}

// ===== Respostas padrão (tabela suporte_respostas_padrao) =====

export type StandardResponse = {
  id: string;
  categoria: string;
  titulo: string;
  texto: string;
  tags?: string[];
};

function mapResposta(row: any): StandardResponse {
  return {
    id: String(row.id_resposta),
    categoria: row.categoria,
    titulo: row.titulo,
    texto: row.texto,
    tags: row.tags ?? [],
  };
}

export async function getStandardResponses(): Promise<StandardResponse[]> {
  const rows = await api.get("/admin/suporte/respostas-padrao");
  return (rows ?? []).map(mapResposta);
}

export async function createStandardResponse(
  response: Omit<StandardResponse, "id">,
): Promise<StandardResponse> {
  const row = await api.post("/admin/suporte/respostas-padrao", response);
  return mapResposta(row);
}

export async function updateStandardResponse(
  id: string,
  updates: Partial<StandardResponse>,
): Promise<StandardResponse> {
  const row = await api.patch(`/admin/suporte/respostas-padrao/${id}`, updates);
  return mapResposta(row);
}

export async function deleteStandardResponse(id: string): Promise<void> {
  await api.delete(`/admin/suporte/respostas-padrao/${id}`);
}
