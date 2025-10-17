// Simple in-memory log service for client-side sessions
// Replace with real API calls when backend is available

export type UserRole = "Administrador" | "Professor" | "Aluno";

export interface AdminLog {
  id: string;
  usuarioNome: string;
  usuarioPerfil: UserRole | string; // allow custom when needed
  acao: string;
  dataHora: string; // ISO
  ip?: string;
}

let logsStore: AdminLog[] = [
  {
    id: "l1",
    usuarioNome: "Maria Souza",
    usuarioPerfil: "Administrador",
    acao:
      "Adicionou 50 moedas ao aluno João Silva (justificativa: participação em evento)",
    dataHora: "2025-09-15T14:32:00Z",
    ip: "200.200.10.12",
  },
  {
    id: "l2",
    usuarioNome: "Carlos Mendes",
    usuarioPerfil: "Professor",
    acao:
      "Alterou a permissão: Visualização de Relatórios para o perfil Professor",
    dataHora: "2025-09-10T09:15:00Z",
  },
];

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export async function listLogs(): Promise<AdminLog[]> {
  // Simulate async
  return Promise.resolve([...logsStore]);
}

export async function createLog(log: Partial<AdminLog> & {
  usuarioNome: string;
  usuarioPerfil: UserRole | string;
  acao: string;
  dataHora?: string;
}): Promise<AdminLog> {
  const entry: AdminLog = {
    id: log.id ?? genId(),
    usuarioNome: log.usuarioNome,
    usuarioPerfil: log.usuarioPerfil,
    acao: log.acao,
    dataHora: log.dataHora ?? new Date().toISOString(),
    ip: log.ip,
  };
  logsStore = [entry, ...logsStore];
  return Promise.resolve(entry);
}

export function exportLogsCsv(logs: AdminLog[], filename = "logs.csv") {
  const header = ["dataHora", "usuarioNome", "usuarioPerfil", "acao", "ip"];
  const rows = logs.map((l) => [
    new Date(l.dataHora).toLocaleString("pt-BR"),
    l.usuarioNome,
    l.usuarioPerfil,
    l.acao.replace(/\n/g, " "),
    l.ip ?? "",
  ]);
  const csv = [header.join(";"), ...rows.map((r) => r.map(escapeCsv).join(";"))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCsv(value: any) {
  const str = String(value ?? "");
  if (/[;"\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// For tests/dev only
export function __resetLogsStore(initial?: AdminLog[]) {
  logsStore = initial ?? [];
}
