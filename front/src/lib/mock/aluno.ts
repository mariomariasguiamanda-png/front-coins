// Mock data centralizado para área do aluno

export type Disciplina = {
  id: string;
  nome: string;
  cor: string; // cor temática
  moedas: number; // saldo de moedas por disciplina
  progresso: number; // 0-100
};

export type Questao = {
  id: string;
  enunciado: string;
  alternativas: string[];
  respostaCorreta: number; // índice da resposta correta
};

export type Atividade = {
  id: string;
  titulo: string;
  disciplinaId: string;
  prazo: string; // ISO date
  moedas: number;
  status: "pendente" | "enviado" | "corrigido";
  tipo?: "discursiva" | "multipla_escolha";
  questoes?: Questao[]; // para atividades de múltipla escolha
  descricao?: string;
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
  avaliacoes: Array<{
    nome: string;
    nota: number;
    max: number;
    status?: "revisao" | "ok";
  }>; // status de revisao destaca em roxo
};

export type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "atividade" | "nota" | "revisao" | "sistema" | "moedas";
  dataHora: string; // ISO date
  lida: boolean;
  disciplina?: string;
  icone: string;
  cor: string;
};

export const aluno = {
  id: "aluno-1",
  nome: "Ana Souza",
  matricula: "202500123",
  saldoTotal: 420,
};

export const disciplinas: Disciplina[] = [
  { id: "mat", nome: "Matemática", cor: "#2563EB", moedas: 120, progresso: 72 }, // Azul
  { id: "port", nome: "Português", cor: "#DC2626", moedas: 80, progresso: 58 }, // Vermelho
  { id: "hist", nome: "História", cor: "#D97706", moedas: 60, progresso: 44 }, // Laranja
  { id: "geo", nome: "Geografia", cor: "#059669", moedas: 40, progresso: 37 }, // Verde
  { id: "bio", nome: "Biologia", cor: "#7C3AED", moedas: 70, progresso: 63 }, // Roxo
  { id: "fis", nome: "Física", cor: "#1F2937", moedas: 50, progresso: 41 }, // Cinza escuro
  { id: "art", nome: "Artes", cor: "#EC4899", moedas: 30, progresso: 25 }, // Rosa
];

export const rankingTurma = [
  { posicao: 1, nome: "Carlos Silva", moedas: 590 },
  { posicao: 2, nome: "Bianca Santos", moedas: 540 },
  { posicao: 3, nome: "Diego Oliveira", moedas: 500 },
  { posicao: 4, nome: "Fernanda Costa", moedas: 485 },
  { posicao: 5, nome: "Gabriel Lima", moedas: 470 },
  { posicao: 6, nome: "Helena Rodrigues", moedas: 450 },
  { posicao: 7, nome: aluno.nome, moedas: aluno.saldoTotal },
  { posicao: 8, nome: "Igor Pereira", moedas: 400 },
  { posicao: 9, nome: "Julia Alves", moedas: 385 },
  { posicao: 10, nome: "Lucas Ferreira", moedas: 370 },
  { posicao: 11, nome: "Mariana Souza", moedas: 355 },
  { posicao: 12, nome: "Nicolas Barbosa", moedas: 340 },
  { posicao: 13, nome: "Olivia Martins", moedas: 325 },
  { posicao: 14, nome: "Pedro Gomes", moedas: 310 },
  { posicao: 15, nome: "Rafaela Dias", moedas: 295 },
  { posicao: 16, nome: "Samuel Castro", moedas: 280 },
  { posicao: 17, nome: "Thaís Rocha", moedas: 265 },
  { posicao: 18, nome: "Victor Cardoso", moedas: 250 },
  { posicao: 19, nome: "Yasmin Nunes", moedas: 235 },
  { posicao: 20, nome: "Zion Mendes", moedas: 220 },
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
  {
    id: "a1",
    titulo: "Lista de Equações 1",
    disciplinaId: "mat",
    prazo: new Date(Date.now() + 86400000).toISOString(),
    moedas: 20,
    status: "pendente",
  },
  {
    id: "a2",
    titulo: "Interpretação de Texto",
    disciplinaId: "port",
    prazo: new Date(Date.now() + 3 * 86400000).toISOString(),
    moedas: 15,
    status: "pendente",
  },
  {
    id: "a3",
    titulo: "Período Colonial",
    disciplinaId: "hist",
    prazo: new Date(Date.now() - 2 * 86400000).toISOString(),
    moedas: 25,
    status: "enviado",
  },
  {
    id: "a4",
    titulo: "Quiz - Função Quadrática",
    disciplinaId: "mat",
    prazo: new Date(Date.now() + 5 * 86400000).toISOString(),
    moedas: 30,
    status: "pendente",
  },
  {
    id: "a5",
    titulo: "Experimento - Fotossíntese",
    disciplinaId: "bio",
    prazo: new Date(Date.now() + 7 * 86400000).toISOString(),
    moedas: 35,
    status: "pendente",
  },
  {
    id: "a6",
    titulo: "Mapa Mental - Relevo",
    disciplinaId: "geo",
    prazo: new Date(Date.now()).toISOString(),
    moedas: 20,
    status: "pendente",
  },
  {
    id: "a7",
    titulo: "Relatório - Leis de Newton",
    disciplinaId: "fis",
    prazo: new Date(Date.now() - 86400000).toISOString(),
    moedas: 40,
    status: "enviado",
  },
  {
    id: "a8",
    titulo: "Redação - Meio Ambiente",
    disciplinaId: "port",
    prazo: new Date(Date.now() + 2 * 86400000).toISOString(),
    moedas: 25,
    status: "pendente",
  },
  {
    id: "a9",
    titulo: "Quiz - Funções Matemáticas",
    disciplinaId: "mat",
    prazo: new Date(Date.now() + 4 * 86400000).toISOString(),
    moedas: 35,
    status: "pendente",
    tipo: "multipla_escolha",
    descricao:
      "Teste seus conhecimentos sobre funções matemáticas com este quiz de múltipla escolha.",
    questoes: [
      {
        id: "q1",
        enunciado: "Qual é o valor de f(2) para a função f(x) = 3x + 5?",
        alternativas: ["8", "11", "13", "16"],
        respostaCorreta: 1,
      },
      {
        id: "q2",
        enunciado: "Uma função quadrática tem a forma geral:",
        alternativas: [
          "f(x) = ax + b",
          "f(x) = ax² + bx + c",
          "f(x) = a/x",
          "f(x) = aˣ",
        ],
        respostaCorreta: 1,
      },
      {
        id: "q3",
        enunciado: "O gráfico de uma função linear é:",
        alternativas: [
          "Uma parábola",
          "Uma reta",
          "Uma hipérbole",
          "Um círculo",
        ],
        respostaCorreta: 1,
      },
      {
        id: "q4",
        enunciado: "Qual é a raiz da equação 2x - 6 = 0?",
        alternativas: ["x = 2", "x = 3", "x = 4", "x = 6"],
        respostaCorreta: 1,
      },
    ],
  },
  {
    id: "a10",
    titulo: "Quiz - Sistema Digestório",
    disciplinaId: "bio",
    prazo: new Date(Date.now() + 6 * 86400000).toISOString(),
    moedas: 30,
    status: "pendente",
    tipo: "multipla_escolha",
    descricao: "Avalie seus conhecimentos sobre o sistema digestório humano.",
    questoes: [
      {
        id: "q1",
        enunciado: "Qual é a função principal do estômago?",
        alternativas: [
          "Absorver nutrientes",
          "Digerir proteínas",
          "Produzir bile",
          "Filtrar toxinas",
        ],
        respostaCorreta: 1,
      },
      {
        id: "q2",
        enunciado: "Onde ocorre a maior parte da absorção de nutrientes?",
        alternativas: [
          "Estômago",
          "Intestino delgado",
          "Intestino grosso",
          "Esôfago",
        ],
        respostaCorreta: 1,
      },
      {
        id: "q3",
        enunciado: "A bile é produzida por qual órgão?",
        alternativas: ["Pâncreas", "Vesícula biliar", "Fígado", "Duodeno"],
        respostaCorreta: 2,
      },
    ],
  },
  {
    id: "a11",
    titulo: "Quiz - Brasil Colonial",
    disciplinaId: "hist",
    prazo: new Date(Date.now() + 3 * 86400000).toISOString(),
    moedas: 25,
    status: "pendente",
    tipo: "multipla_escolha",
    descricao: "Teste seus conhecimentos sobre o período colonial brasileiro.",
    questoes: [
      {
        id: "q1",
        enunciado: "Em que ano o Brasil foi descoberto pelos portugueses?",
        alternativas: ["1498", "1500", "1502", "1504"],
        respostaCorreta: 1,
      },
      {
        id: "q2",
        enunciado:
          "Qual foi o primeiro sistema econômico implementado no Brasil colonial?",
        alternativas: [
          "Mineração",
          "Pecuária",
          "Exploração do pau-brasil",
          "Cultivo de café",
        ],
        respostaCorreta: 2,
      },
      {
        id: "q3",
        enunciado: "As capitanias hereditárias foram criadas por:",
        alternativas: [
          "D. Pedro I",
          "D. João III",
          "Marquês de Pombal",
          "Tomé de Souza",
        ],
        respostaCorreta: 1,
      },
    ],
  },
  {
    id: "a12",
    titulo: "Quiz - Figuras de Linguagem",
    disciplinaId: "port",
    prazo: new Date(Date.now() + 5 * 86400000).toISOString(),
    moedas: 20,
    status: "pendente",
    tipo: "multipla_escolha",
    descricao: "Identifique as figuras de linguagem nos exemplos apresentados.",
    questoes: [
      {
        id: "q1",
        enunciado:
          "Na frase 'Seus olhos são estrelas brilhantes', temos qual figura de linguagem?",
        alternativas: ["Metáfora", "Comparação", "Personificação", "Hipérbole"],
        respostaCorreta: 0,
      },
      {
        id: "q2",
        enunciado: "A frase 'O vento sussurrava segredos' é um exemplo de:",
        alternativas: ["Metáfora", "Ironia", "Personificação", "Antítese"],
        respostaCorreta: 2,
      },
      {
        id: "q3",
        enunciado: "Em 'João é forte como um touro', identificamos:",
        alternativas: ["Metáfora", "Comparação", "Metonímia", "Sinestesia"],
        respostaCorreta: 1,
      },
    ],
  },
];

export const resumos: Resumo[] = [
  {
    id: "r1",
    disciplinaId: "mat",
    titulo: "Funções Afins",
    atividadeVinculada: "Lista de Equações 1",
    conteudo: "Definições, gráficos e aplicações de funções do 1º grau.",
  },
  {
    id: "r2",
    disciplinaId: "hist",
    titulo: "Brasil Colônia",
    conteudo: "Resumo dos ciclos econômicos e administração colonial.",
  },
  {
    id: "r3",
    disciplinaId: "bio",
    titulo: "Células",
    conteudo:
      "Organelas, funções e diferenças entre células eucariontes e procariontes.",
  },
  {
    id: "r4",
    disciplinaId: "mat",
    titulo: "Função Quadrática",
    atividadeVinculada: "Quiz - Função Quadrática",
    conteudo: "Parábolas, vértices, zeros e aplicações das funções de 2º grau.",
  },
  {
    id: "r5",
    disciplinaId: "geo",
    titulo: "Relevo Brasileiro",
    conteudo: "Características, classificação e formação do relevo no Brasil.",
  },
  {
    id: "r6",
    disciplinaId: "fis",
    titulo: "Leis de Newton",
    conteudo: "Princípios fundamentais da dinâmica e suas aplicações.",
  },
  {
    id: "r7",
    disciplinaId: "port",
    titulo: "Texto Dissertativo",
    conteudo: "Estrutura, argumentação e técnicas de redação dissertativa.",
  },
  {
    id: "r8",
    disciplinaId: "bio",
    titulo: "Fotossíntese",
    atividadeVinculada: "Experimento - Fotossíntese",
    conteudo:
      "Processo de produção de energia nas plantas através da luz solar.",
  },
];

export const videoaulas: Videoaula[] = [
  {
    id: "v1",
    disciplinaId: "mat",
    titulo: "Introdução a Funções",
    descricao: "Conceitos fundamentais de funções.",
    youtubeId: "f02mOEt11OQ",
  },
  {
    id: "v2",
    disciplinaId: "hist",
    titulo: "Brasil Colônia - Resumo",
    descricao: "Linha do tempo do período colonial.",
    youtubeId: "Z1YmY6YJzV8",
  },
  {
    id: "v3",
    disciplinaId: "mat",
    titulo: "Função Quadrática - Gráficos",
    descricao: "Como construir e interpretar gráficos de parábolas.",
    youtubeId: "X1Y2Z3W456",
  },
  {
    id: "v4",
    disciplinaId: "bio",
    titulo: "Fotossíntese Explicada",
    descricao: "Processo completo da fotossíntese nas plantas.",
    youtubeId: "A4B5C6D789",
  },
  {
    id: "v5",
    disciplinaId: "fis",
    titulo: "Leis de Newton na Prática",
    descricao: "Experimentos demonstrando as leis da dinâmica.",
    youtubeId: "E7F8G9H012",
  },
  {
    id: "v6",
    disciplinaId: "geo",
    titulo: "Relevo e Paisagem",
    descricao: "Formação do relevo brasileiro e suas características.",
    youtubeId: "I3J4K5L678",
  },
  {
    id: "v7",
    disciplinaId: "port",
    titulo: "Como Escrever uma Redação",
    descricao: "Técnicas para uma redação nota 1000.",
    youtubeId: "M9N0O1P234",
  },
];

export const notas: Nota[] = [
  {
    disciplinaId: "mat",
    avaliacoes: [
      { nome: "Prova 1", nota: 7.2, max: 10 },
      { nome: "Trabalho 1", nota: 8.5, max: 10, status: "revisao" },
    ],
  },
  {
    disciplinaId: "port",
    avaliacoes: [
      { nome: "Prova 1", nota: 6.1, max: 10 },
      { nome: "Redação", nota: 5.5, max: 10 },
    ],
  },
  {
    disciplinaId: "hist",
    avaliacoes: [{ nome: "Prova 1", nota: 8.8, max: 10 }],
  },
];

export const professores = [
  { id: "p1", nome: "Prof. Maria (Português)" },
  { id: "p2", nome: "Prof. João (Matemática)" },
  { id: "p3", nome: "Prof. Carla (História)" },
];

export const precosPontosPorDisciplina = disciplinas.map((d) => ({
  disciplinaId: d.id,
  nome: d.nome,
  precoPorPonto: 0.5 + Math.round(Math.random() * 50) / 100, // 0.5 - 1.0
  disponivel: 1000,
}));

export const calendarioRevisao = [
  {
    titulo: "Funções afins",
    dataBase: new Date().toISOString(),
    repeticoes: [1, 3, 7, 15],
  },
  {
    titulo: "Brasil Colônia",
    dataBase: new Date(Date.now() - 2 * 86400000).toISOString(),
    repeticoes: [1, 3, 7, 15],
  },
];

export const notificacoes: Notificacao[] = [
  {
    id: "notif-1",
    titulo: "Nova Atividade Disponível",
    mensagem:
      "A atividade 'Exercícios de Funções Quadráticas' foi publicada em Matemática",
    tipo: "atividade",
    dataHora: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    lida: false,
    disciplina: "Matemática",
    icone: "📚",
    cor: "text-blue-600",
  },
  {
    id: "notif-2",
    titulo: "Moedas Recebidas!",
    mensagem: "Você ganhou 25 moedas por completar a atividade de História",
    tipo: "moedas",
    dataHora: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 horas atrás
    lida: false,
    disciplina: "História",
    icone: "🪙",
    cor: "text-yellow-600",
  },
  {
    id: "notif-3",
    titulo: "Nota Publicada",
    mensagem: "Sua nota da prova de Literatura foi publicada: 8.5/10",
    tipo: "nota",
    dataHora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
    lida: true,
    disciplina: "Literatura",
    icone: "📊",
    cor: "text-green-600",
  },
  {
    id: "notif-4",
    titulo: "Hora de Revisar!",
    mensagem: "É hora de revisar o conteúdo 'Células' de Biologia",
    tipo: "revisao",
    dataHora: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 horas atrás
    lida: false,
    disciplina: "Biologia",
    icone: "🔄",
    cor: "text-purple-600",
  },
  {
    id: "notif-5",
    titulo: "Sistema Atualizado",
    mensagem:
      "Nova funcionalidade de calendário disponível! Confira suas revisões programadas",
    tipo: "sistema",
    dataHora: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
    lida: true,
    disciplina: undefined,
    icone: "⚙️",
    cor: "text-gray-600",
  },
];

export function moedaBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);
}