// In-memory Support service: tickets, FAQs, and standard responses

export type TicketType = "tecnico" | "pedagogico" | "administrativo";
export type TicketStatus = "aberto" | "em_andamento" | "resolvido";

export type TicketResponse = {
  id: string;
  autorId: string;
  autorNome: string;
  mensagem: string;
  data: string; // ISO
};

export type Ticket = {
  id: string;
  solicitante: string;
  tipo: TicketType;
  status: TicketStatus;
  descricao: string;
  dataAbertura: string; // ISO
  prazoEstimado: string; // ISO
  responsavel: string | null;
  respostas: TicketResponse[];
};

export type FaqItem = { id: string; pergunta: string; resposta: string };
export type FaqCategory = { id: string; nome: string; perguntas: FaqItem[] };

export type StandardResponse = { id: string; titulo: string; texto: string; categoria: string };

let tickets: Ticket[] = [
  {
    id: "1",
    solicitante: "João Silva",
    tipo: "tecnico",
    status: "aberto",
    descricao: "Não consigo acessar as videoaulas",
    dataAbertura: "2025-10-12",
    prazoEstimado: "2025-10-14",
    responsavel: null,
    respostas: [],
  },
  {
    id: "2",
    solicitante: "Maria Santos",
    tipo: "pedagogico",
    status: "em_andamento",
    descricao: "Dúvida sobre pontuação de atividades",
    dataAbertura: "2025-10-11",
    prazoEstimado: "2025-10-13",
    responsavel: "Ana Suporte",
    respostas: [
      { id: "r1", autorId: "sup_1", autorNome: "Ana Suporte", mensagem: "Olá, estou analisando sua dúvida...", data: "2025-10-11" },
    ],
  },
];

let faqCategories: FaqCategory[] = [
  {
    id: "c1",
    nome: "Moedas e Pontos",
    perguntas: [
      { id: "f1", pergunta: "Como ganho moedas?", resposta: "As moedas são adquiridas ao completar atividades, assistir videoaulas e participar de revisões." },
    ],
  },
];

let standardResponses: StandardResponse[] = [
  { id: "s1", titulo: "Ganho de Moedas", texto: "As moedas são adquiridas ao completar atividades, assistir videoaulas e participar de revisões.", categoria: "Moedas e Pontos" },
];

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 10)}`;

// Tickets
export async function getTickets(): Promise<Ticket[]> { await delay(); return clone(tickets); }
export async function updateTicket(next: Ticket): Promise<Ticket> {
  await delay();
  tickets = tickets.map((t) => (t.id === next.id ? clone(next) : t));
  return clone(next);
}
export async function addTicketResponse(ticketId: string, resp: Omit<TicketResponse, "id" | "data"> & { data?: string }): Promise<Ticket> {
  await delay();
  const t = tickets.find((x) => x.id === ticketId);
  if (!t) throw new Error("Ticket não encontrado");
  const newResp: TicketResponse = { id: uid("r"), data: resp.data || new Date().toISOString(), autorId: resp.autorId, autorNome: resp.autorNome, mensagem: resp.mensagem };
  t.respostas.push(newResp);
  return clone(t);
}

// FAQs
export async function getFaqCategories(): Promise<FaqCategory[]> { await delay(); return clone(faqCategories); }
export async function createFaqCategory(nome: string): Promise<FaqCategory> {
  await delay();
  const cat: FaqCategory = { id: uid("c"), nome, perguntas: [] };
  faqCategories.push(cat);
  return clone(cat);
}
export async function updateFaqCategory(id: string, nome: string): Promise<FaqCategory> {
  await delay();
  faqCategories = faqCategories.map((c) => (c.id === id ? { ...c, nome } : c));
  const cat = faqCategories.find((c) => c.id === id)!;
  return clone(cat);
}
export async function deleteFaqCategory(id: string): Promise<void> {
  await delay();
  faqCategories = faqCategories.filter((c) => c.id !== id);
}
export async function addFaqItem(categoryId: string, pergunta: string, resposta: string): Promise<FaqItem> {
  await delay();
  const cat = faqCategories.find((c) => c.id === categoryId);
  if (!cat) throw new Error("Categoria não encontrada");
  const item: FaqItem = { id: uid("f"), pergunta, resposta };
  cat.perguntas.push(item);
  return clone(item);
}
export async function updateFaqItem(categoryId: string, itemId: string, updates: Partial<Pick<FaqItem, "pergunta" | "resposta">>): Promise<FaqItem> {
  await delay();
  const cat = faqCategories.find((c) => c.id === categoryId);
  if (!cat) throw new Error("Categoria não encontrada");
  cat.perguntas = cat.perguntas.map((f) => (f.id === itemId ? { ...f, ...updates } : f));
  const item = cat.perguntas.find((f) => f.id === itemId)!;
  return clone(item);
}
export async function deleteFaqItem(categoryId: string, itemId: string): Promise<void> {
  await delay();
  const cat = faqCategories.find((c) => c.id === categoryId);
  if (!cat) throw new Error("Categoria não encontrada");
  cat.perguntas = cat.perguntas.filter((f) => f.id !== itemId);
}

// Respostas padrão
export async function getStandardResponses(): Promise<StandardResponse[]> { await delay(); return clone(standardResponses); }
export async function createStandardResponse(input: Omit<StandardResponse, "id">): Promise<StandardResponse> {
  await delay();
  const sr: StandardResponse = { id: uid("s"), ...input };
  standardResponses.push(sr);
  return clone(sr);
}
export async function updateStandardResponse(id: string, updates: Partial<Omit<StandardResponse, "id">>): Promise<StandardResponse> {
  await delay();
  standardResponses = standardResponses.map((s) => (s.id === id ? { ...s, ...updates } : s));
  const sr = standardResponses.find((s) => s.id === id)!;
  return clone(sr);
}
export async function deleteStandardResponse(id: string): Promise<void> {
  await delay();
  standardResponses = standardResponses.filter((s) => s.id !== id);
}
