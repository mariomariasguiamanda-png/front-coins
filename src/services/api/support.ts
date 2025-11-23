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
  tipo: "tecnico" | "pedagogico" | "administrativo";
  descricao: string;
  status: TicketStatus;
  dataAbertura: string; // ISO
  prazoEstimado: string; // ISO
  responsavel: string | null;
  respostas: TicketResponse[];
};

const memory: { tickets: Ticket[] } = {
  tickets: [
    {
      id: "t_1",
      solicitante: "Ana Paula",
      tipo: "tecnico",
      descricao: "Não consigo acessar a plataforma no celular.",
      status: "aberto",
      dataAbertura: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      prazoEstimado: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      responsavel: null,
      respostas: [],
    },
    {
      id: "t_2",
      solicitante: "Carlos Mendes",
      tipo: "administrativo",
      descricao: "Solicitação de ajuste de cadastro.",
      status: "em_andamento",
      dataAbertura: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      prazoEstimado: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      responsavel: "Equipe ADM",
      respostas: [
        {
          id: "r_1",
          autorId: "sup_1",
          autorNome: "Atendente 01",
          mensagem: "Estamos analisando sua solicitação.",
          dataHora: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
      ],
    },
  ],
};

export async function getTickets(): Promise<Ticket[]> {
  // return a shallow copy to avoid external mutation
  return [...memory.tickets];
}

export async function addTicketResponse(
  ticketId: string,
  response: { autorId: string; autorNome: string; mensagem: string }
): Promise<Ticket> {
  const t = memory.tickets.find((x) => x.id === ticketId);
  if (!t) throw new Error("Ticket não encontrado");
  const r: TicketResponse = {
    id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    autorId: response.autorId,
    autorNome: response.autorNome,
    mensagem: response.mensagem,
    dataHora: new Date().toISOString(),
  };
  t.respostas.push(r);
  // opcional: marcar como em andamento ao responder
  if (t.status === "aberto") t.status = "em_andamento";
  return { ...t };
}

export async function updateTicket(next: Ticket): Promise<Ticket> {
  const idx = memory.tickets.findIndex((x) => x.id === next.id);
  if (idx === -1) throw new Error("Ticket não encontrado");
  memory.tickets[idx] = { ...next, respostas: next.respostas ?? memory.tickets[idx].respostas };
  return { ...memory.tickets[idx] };
}

// FAQs types and functions
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

const faqMemory: { categories: FaqCategory[] } = {
  categories: [
    {
      id: "cat_1",
      nome: "Geral",
      perguntas: [
        {
          id: "faq_1",
          pergunta: "Como faço para acessar a plataforma?",
          resposta: "Você pode acessar a plataforma através do site oficial utilizando seu e-mail e senha cadastrados.",
        },
      ],
    },
  ],
};

export async function getFaqCategories(): Promise<FaqCategory[]> {
  return [...faqMemory.categories];
}

export async function createFaqCategory(nome: string): Promise<FaqCategory> {
  const cat: FaqCategory = {
    id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    nome,
    perguntas: [],
  };
  faqMemory.categories.push(cat);
  return { ...cat };
}

export async function updateFaqCategory(id: string, nome: string): Promise<FaqCategory> {
  const cat = faqMemory.categories.find((c) => c.id === id);
  if (!cat) throw new Error("Categoria não encontrada");
  cat.nome = nome;
  return { ...cat };
}

export async function deleteFaqCategory(id: string): Promise<void> {
  const idx = faqMemory.categories.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Categoria não encontrada");
  faqMemory.categories.splice(idx, 1);
}

export async function addFaqItem(categoryId: string, pergunta: string, resposta: string): Promise<FaqItem> {
  const cat = faqMemory.categories.find((c) => c.id === categoryId);
  if (!cat) throw new Error("Categoria não encontrada");
  const item: FaqItem = {
    id: `faq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    pergunta,
    resposta,
  };
  cat.perguntas.push(item);
  return { ...item };
}

export async function updateFaqItem(
  categoryId: string,
  faqId: string,
  data: { pergunta: string; resposta: string }
): Promise<FaqItem> {
  const cat = faqMemory.categories.find((c) => c.id === categoryId);
  if (!cat) throw new Error("Categoria não encontrada");
  const item = cat.perguntas.find((f) => f.id === faqId);
  if (!item) throw new Error("FAQ não encontrado");
  item.pergunta = data.pergunta;
  item.resposta = data.resposta;
  return { ...item };
}

export async function deleteFaqItem(categoryId: string, faqId: string): Promise<void> {
  const cat = faqMemory.categories.find((c) => c.id === categoryId);
  if (!cat) throw new Error("Categoria não encontrada");
  const idx = cat.perguntas.findIndex((f) => f.id === faqId);
  if (idx === -1) throw new Error("FAQ não encontrado");
  cat.perguntas.splice(idx, 1);
}

// Standard Responses
export type StandardResponse = {
  id: string;
  categoria: string;
  titulo: string;
  texto: string;
  tags?: string[];
};

let responses: StandardResponse[] = [
  {
    id: "1",
    categoria: "Técnico",
    titulo: "Problema de Login",
    texto: "Para resolver problemas de login, tente limpar o cache do navegador e verificar se suas credenciais estão corretas.",
    tags: ["login", "acesso"],
  },
];

export async function getStandardResponses(): Promise<StandardResponse[]> {
  return JSON.parse(JSON.stringify(responses));
}

export async function createStandardResponse(response: Omit<StandardResponse, "id">): Promise<StandardResponse> {
  const newResponse: StandardResponse = {
    ...response,
    id: `${Date.now()}`,
  };
  responses.push(newResponse);
  return newResponse;
}

export async function updateStandardResponse(id: string, updates: Partial<StandardResponse>): Promise<StandardResponse> {
  const idx = responses.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Response not found");
  responses[idx] = { ...responses[idx], ...updates };
  return responses[idx];
}

export async function deleteStandardResponse(id: string): Promise<void> {
  responses = responses.filter((r) => r.id !== id);
}