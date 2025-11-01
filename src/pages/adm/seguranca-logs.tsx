import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FileText, Download } from "lucide-react";
import { listLogs as apiListLogs, exportLogsCsv } from "@/services/api/logs";

interface AdminLog {
  id: string;
  usuarioNome: string;
  usuarioPerfil: "Administrador" | "Professor" | "Aluno";
  acao: string;
  dataHora: string;
  ip?: string;
}

export default function SegurancaLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [logsSearch, setLogsSearch] = useState("");
  const [logsRole, setLogsRole] = useState<"todos" | AdminLog["usuarioPerfil"]>("todos");
  const [logsPage, setLogsPage] = useState(1);
  const logsPageSize = 10;

  useEffect(() => {
    apiListLogs().then((data) => setLogs(data as any));
  }, []);

  const filteredLogs = useMemo(() => {
    const q = logsSearch.toLowerCase();
    return logs
      .filter((l) => (logsRole === "todos" ? true : l.usuarioPerfil === logsRole))
      .filter((l) =>
        l.usuarioNome.toLowerCase().includes(q) ||
        l.acao.toLowerCase().includes(q) ||
        (l.ip ? l.ip.toLowerCase().includes(q) : false)
      )
      .sort((a, b) => +new Date(b.dataHora) - +new Date(a.dataHora));
  }, [logs, logsSearch, logsRole]);

  const totalLogsPages = Math.max(1, Math.ceil(filteredLogs.length / logsPageSize));
  const pageSafe = Math.min(logsPage, totalLogsPages);
  const logsSlice = filteredLogs.slice((pageSafe - 1) * logsPageSize, pageSafe * logsPageSize);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-500" />
            <h1 className="text-2xl font-bold">Logs de Atividades</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/adm/seguranca" className="hidden md:block">
              <Button variant="outline" className="rounded-xl">Voltar ao Hub</Button>
            </Link>
            <Button
              variant="outline"
              className="rounded-xl border-violet-100 hover:border-violet-200 hover:bg-violet-50/50"
              onClick={() => exportLogsCsv(filteredLogs)}
            >
              <div className="flex items-center justify-center">
                <Download className="mr-2 h-4 w-4 text-violet-500" />
                <span className="text-violet-700">Exportar</span>
              </div>
            </Button>
          </div>
        </header>

        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <Input
              placeholder="Buscar por usuário, ação ou IP..."
              className="rounded-lg"
              value={logsSearch}
              onChange={(e) => setLogsSearch(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={logsRole}
              onChange={(e) => setLogsRole(e.target.value as any)}
            >
              <option value="todos">Todos os perfis</option>
              <option value="Administrador">Administrador</option>
              <option value="Professor">Professor</option>
              <option value="Aluno">Aluno</option>
            </select>
          </div>
        </div>

        <div className="rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left text-sm font-medium">Data/Hora</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Usuário</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Ação</th>
                <th className="py-3 px-4 text-left text-sm font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {logsSlice.map((l) => (
                <tr key={l.id} className="border-b align-top">
                  <td className="py-3 px-4 text-sm whitespace-nowrap">
                    {new Date(l.dataHora).toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{l.usuarioNome}</span>
                      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                        {l.usuarioPerfil}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{l.acao}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{l.ip ?? "-"}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-sm text-muted-foreground">
                    Nenhum registro encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div>Mostrando {logsSlice.length} de {filteredLogs.length} registros</div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-lg"
              disabled={pageSafe <= 1}
              onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <span> Página {pageSafe} de {totalLogsPages} </span>
            <Button
              variant="outline"
              className="rounded-lg"
              disabled={pageSafe >= totalLogsPages}
              onClick={() => setLogsPage((p) => Math.min(totalLogsPages, p + 1))}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
