export const professor = {
  nome: "Ana Silva",
  email: "ana.silva@escola.edu.br",
  disciplina: "Matemática",
  turmas: ["1º A", "2º B", "3º C"],
};

export type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  dataHora: string;
  lida: boolean;
  icone: string;
  disciplina?: string;
  cor?: string;
};

export const notificacoes: Notificacao[] = [
  {
    id: "1",
    titulo: "Novo Resumo para Revisar",
    mensagem: "Um aluno enviou um resumo para sua revisão",
    dataHora: "2025-10-08T09:30:00",
    lida: false,
    icone: "📝",
    disciplina: "Matemática",
    cor: "text-blue-600",
  },
  {
    id: "2",
    titulo: "Prazo de Avaliação",
    mensagem: "Lembrete: Prazo para lançamento de notas se encerra amanhã",
    dataHora: "2025-10-08T08:15:00",
    lida: false,
    icone: "📅",
    disciplina: "Sistema",
    cor: "text-red-600",
  },
  {
    id: "3",
    titulo: "Conquista da Turma",
    mensagem: "Sua turma 2º B atingiu a meta de atividades do mês",
    dataHora: "2025-10-07T14:20:00",
    lida: true,
    icone: "🏆",
    disciplina: "Matemática",
    cor: "text-green-600",
  },
  {
    id: "4",
    titulo: "Material Disponível",
    mensagem: "Novo material de apoio disponível na biblioteca",
    dataHora: "2025-10-07T11:45:00",
    lida: true,
    icone: "📚",
    disciplina: "Sistema",
    cor: "text-purple-600",
  },
];
