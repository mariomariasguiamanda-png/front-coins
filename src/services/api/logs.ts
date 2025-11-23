export type AdminLog = {
  id: string;
  usuarioNome: string;
  usuarioPerfil: "Administrador" | "Professor" | "Aluno";
  acao: string;
  dataHora: string; // ISO
  ip?: string;
};

const memory: { logs: AdminLog[] } = {
  logs: [
    {
      id: "l_1",
      usuarioNome: "Sistema",
      usuarioPerfil: "Administrador",
      acao: "Serviço de logs inicializado",
      dataHora: new Date().toISOString(),
    },
  ],
};

export async function createLog(entry: {
  usuarioNome: string;
  usuarioPerfil: AdminLog["usuarioPerfil"];
  acao: string;
  dataHora?: string;
  ip?: string;
}) {
  const log: AdminLog = {
    id: `l_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    dataHora: entry.dataHora || new Date().toISOString(),
    usuarioNome: entry.usuarioNome,
    usuarioPerfil: entry.usuarioPerfil,
    acao: entry.acao,
    ip: entry.ip,
  };
  memory.logs.unshift(log);
  return log;
}

export async function listLogs(): Promise<AdminLog[]> {
  return [...memory.logs];
}

export async function exportLogsCsv(logs: AdminLog[] = memory.logs) {
  const header = ["id","dataHora","usuarioNome","usuarioPerfil","acao","ip"]; 
  const rows = logs.map((l) => [l.id, l.dataHora, l.usuarioNome, l.usuarioPerfil, l.acao.replace(/\n/g, " "), l.ip ?? ""].join(","));
  const csv = [header.join(","), ...rows].join("\n");
  if (typeof window !== "undefined") {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  return csv;
}

// Aliases used by some pages
export { listLogs as apiListLogs };