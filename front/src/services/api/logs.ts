import { api } from "@/lib/api";

export type AdminLog = {
  id: string;
  usuarioNome: string;
  usuarioPerfil: "Administrador" | "Professor" | "Aluno";
  acao: string;
  dataHora: string; // ISO
  ip?: string;
};

const ROTULO_PERFIL: Record<string, AdminLog["usuarioPerfil"]> = {
  admin: "Administrador",
  professor: "Professor",
  aluno: "Aluno",
};

// Logs reais de auditoria (tabela logs_auditoria) - o backend registra
// automaticamente as ações administrativas via interceptor; o front só lê.
export async function listLogs(): Promise<AdminLog[]> {
  const rows = await api.get("/admin/logs");
  return (rows ?? []).map((r: any) => ({
    id: String(r.id_log),
    usuarioNome: r.usuarios?.nome ?? "Sistema",
    usuarioPerfil: ROTULO_PERFIL[r.usuarios?.tipo_usuario] ?? "Administrador",
    acao: r.detalhes ? `${r.acao} — ${r.detalhes}` : r.acao,
    dataHora: r.criado_em,
    ip: r.ip_address ?? undefined,
  }));
}

export async function exportLogsCsv(logs: AdminLog[]) {
  const header = ["id", "dataHora", "usuarioNome", "usuarioPerfil", "acao", "ip"];
  const rows = logs.map((l) =>
    [l.id, l.dataHora, l.usuarioNome, l.usuarioPerfil, l.acao.replace(/\n/g, " "), l.ip ?? ""].join(","),
  );
  const csv = [header.join(","), ...rows].join("\n");
  if (typeof window !== "undefined") {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  return csv;
}
