// Mock data centralizado para área do aluno

export type Disciplina = {
  id: string;
  nome: string;
  cor: string; // cor temática
  moedas: number; // saldo de moedas por disciplina
  progresso: number; // 0-100
};

export type Atividade = {
  id: string;
  titulo: string;
  disciplinaId: string;
  prazo: string; // ISO date
  moedas: number;
  status: "pendente" | "enviado" | "corrigido";
};

export type Resumo = {
  id: string;
  disciplinaId: string;
  titulo: string;
  atividadeVinculada?: string;
  conteudo: string;
};

export type Videoaula = {
  id: string;
  disciplinaId: string;
  titulo: string;
  descricao: string;
  youtubeId: string;
};

export type Nota = {
  disciplinaId: string;
  avaliacoes: Array<{ nome: string; nota: number; max: number; status?: "revisao" | "ok" }>; // status de revisao destaca em roxo
};

export const aluno = {
  id: "aluno-1",
  nome: "Ana Souza",
  matricula: "202500123",
  saldoTotal: 420,
};

export const disciplinas: Disciplina[] = [
  { id: "mat", nome: "Matemática", cor: "#8B5CF6", moedas: 120, progresso: 72 },
  { id: "port", nome: "Português", cor: "#A78BFA", moedas: 80, progresso: 58 },
  { id: "hist", nome: "História", cor: "#7C3AED", moedas: 60, progresso: 44 },
  { id: "geo", nome: "Geografia", cor: "#6D28D9", moedas: 40, progresso: 37 },
  { id: "bio", nome: "Biologia", cor: "#5B21B6", moedas: 70, progresso: 63 },
  { id: "fis", nome: "Física", cor: "#4C1D95", moedas: 50, progresso: 41 },
];

export const rankingTurma = [
  { posicao: 1, nome: "Carlos", moedas: 590 },
  { posicao: 2, nome: "Bianca", moedas: 540 },
  { posicao: 3, nome: "Diego", moedas: 500 },
  { posicao: 7, nome: aluno.nome, moedas: aluno.saldoTotal },
];

export const moedasPorMes = [
  { mes: "Jan", valor: 20 },
  { mes: "Fev", valor: 35 },
  { mes: "Mar", valor: 40 },
  { mes: "Abr", valor: 55 },
  { mes: "Mai", valor: 60 },
  { mes: "Jun", valor: 75 },
  { mes: "Jul", valor: 50 },
  { mes: "Ago", valor: 85 },
  { mes: "Set", valor: 0 },
  { mes: "Out", valor: 0 },
  { mes: "Nov", valor: 0 },
  { mes: "Dez", valor: 0 },
];

export const atividades: Atividade[] = [
  { id: "a1", titulo: "Lista de Equações 1", disciplinaId: "mat", prazo: new Date(Date.now()+86400000).toISOString(), moedas: 20, status: "pendente" },
  { id: "a2", titulo: "Interpretação de Texto", disciplinaId: "port", prazo: new Date(Date.now()+3*86400000).toISOString(), moedas: 15, status: "pendente" },
  { id: "a3", titulo: "Período Colonial", disciplinaId: "hist", prazo: new Date(Date.now()-2*86400000).toISOString(), moedas: 25, status: "enviado" },
];

export const resumos: Resumo[] = [
  { id: "r1", disciplinaId: "mat", titulo: "Funções Afins", atividadeVinculada: "Lista de Equações 1", conteudo: "Definições, gráficos e aplicações de funções do 1º grau." },
  { id: "r2", disciplinaId: "hist", titulo: "Brasil Colônia", conteudo: "Resumo dos ciclos econômicos e administração colonial." },
  { id: "r3", disciplinaId: "bio", titulo: "Células", conteudo: "Organelas, funções e diferenças entre células eucariontes e procariontes." },
];

export const videoaulas: Videoaula[] = [
  { id: "v1", disciplinaId: "mat", titulo: "Introdução a Funções", descricao: "Conceitos fundamentais de funções.", youtubeId: "f02mOEt11OQ" },
  { id: "v2", disciplinaId: "hist", titulo: "Brasil Colônia - Resumo", descricao: "Linha do tempo do período colonial.", youtubeId: "Z1YmY6YJzV8" },
];

export const notas: Nota[] = [
  { disciplinaId: "mat", avaliacoes: [
    { nome: "Prova 1", nota: 7.2, max: 10 },
    { nome: "Trabalho 1", nota: 8.5, max: 10, status: "revisao" },
  ]},
  { disciplinaId: "port", avaliacoes: [
    { nome: "Prova 1", nota: 6.1, max: 10 },
    { nome: "Redação", nota: 5.5, max: 10 },
  ]},
  { disciplinaId: "hist", avaliacoes: [
    { nome: "Prova 1", nota: 8.8, max: 10 },
  ]},
];

export const professores = [
  { id: "p1", nome: "Prof. Maria (Português)" },
  { id: "p2", nome: "Prof. João (Matemática)" },
  { id: "p3", nome: "Prof. Carla (História)" },
];

export const precosPontosPorDisciplina = disciplinas.map((d) => ({
  disciplinaId: d.id,
  nome: d.nome,
  precoPorPonto: 0.5 + Math.round(Math.random()*50)/100, // 0.5 - 1.0
  disponivel: 1000,
}));

export const calendarioRevisao = [
  { titulo: "Funções afins", dataBase: new Date().toISOString(), repeticoes: [1,3,7,15] },
  { titulo: "Brasil Colônia", dataBase: new Date(Date.now()-2*86400000).toISOString(), repeticoes: [1,3,7,15] },
];

export function moedaBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}
