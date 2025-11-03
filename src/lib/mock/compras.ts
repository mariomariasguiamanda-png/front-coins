export interface Transacao {
  id: string;
  alunoId: string;
  alunoNome: string;
  alunoTurma: string;
  disciplinaId: string;
  disciplinaNome: string;
  professorNome: string;
  pontosComprados: number;
  moedasGastas: number;
  saldoAntes: number;
  saldoDepois: number;
  data: string;
  status: "concluida" | "cancelada";
  cancelamento?: {
    data: string;
    adminNome: string;
    motivo: string;
  };
}

export const mockTransacoes: Transacao[] = [
  {
    id: "1",
    alunoId: "1",
    alunoNome: "Ana Souza",
    alunoTurma: "3º A",
    disciplinaId: "1",
    disciplinaNome: "Matemática",
    professorNome: "João Silva",
    pontosComprados: 3,
    moedasGastas: 60,
    saldoAntes: 150,
    saldoDepois: 90,
    data: "2025-10-12T10:30:00Z",
    status: "concluida",
  },
  {
    id: "2",
    alunoId: "2",
    alunoNome: "Pedro Santos",
    alunoTurma: "3º B",
    disciplinaId: "2",
    disciplinaNome: "História",
    professorNome: "Maria Oliveira",
    pontosComprados: 2,
    moedasGastas: 40,
    saldoAntes: 100,
    saldoDepois: 60,
    data: "2025-10-12T09:15:00Z",
    status: "cancelada",
    cancelamento: {
      data: "2025-10-12T09:30:00Z",
      adminNome: "Admin Principal",
      motivo: "Erro técnico no sistema",
    },
  },
  {
    id: "3",
    alunoId: "1",
    alunoNome: "Ana Souza",
    alunoTurma: "3º A",
    disciplinaId: "2",
    disciplinaNome: "História",
    professorNome: "Maria Oliveira",
    pontosComprados: 1,
    moedasGastas: 20,
    saldoAntes: 90,
    saldoDepois: 70,
    data: "2025-10-13T11:20:00Z",
    status: "concluida",
  },
];
