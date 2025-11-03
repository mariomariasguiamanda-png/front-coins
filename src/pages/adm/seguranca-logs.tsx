import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FileText, Download, Activity, Calendar, User, Globe } from "lucide-react";
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

  // Stats calculation
  const statsLogs = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const semana = new Date(hoje);
    semana.setDate(hoje.getDate() - 7);

    return {
      total: logs.length,
      hoje: logs.filter(l => new Date(l.dataHora) >= hoje).length,
      semana: logs.filter(l => new Date(l.dataHora) >= semana).length,
      admins: logs.filter(l => l.usuarioPerfil === "Administrador").length,
    };
  }, [logs]);

  const totalLogsPages = Math.max(1, Math.ceil(filteredLogs.length / logsPageSize));
  const pageSafe = Math.min(logsPage, totalLogsPages);
  const logsSlice = filteredLogs.slice((pageSafe - 1) * logsPageSize, pageSafe * logsPageSize);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Logs de Atividades</h1>
              <p className="text-gray-600 mt-1">Histórico completo de ações administrativas do sistema</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Logs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statsLogs.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hoje</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statsLogs.hoje}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statsLogs.semana}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Administradores</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statsLogs.admins}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 items-center">
            <Link href="/adm/seguranca">
              <Button variant="outline" className="rounded-lg">Voltar</Button>
            </Link>
            <Button
              onClick={() => exportLogsCsv(filteredLogs)}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </header>

        {/* Filters Card */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
          <CardContent className="p-6">
            <div className="grid gap-3 md:grid-cols-3">
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-0">
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Data/Hora</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Usuário</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Ação</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">IP</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {logsSlice.map((l) => (
                    <tr key={l.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm whitespace-nowrap text-gray-900">
                        {new Date(l.dataHora).toLocaleString("pt-BR")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{l.usuarioNome}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            l.usuarioPerfil === "Administrador" ? "bg-red-100 text-red-700" :
                            l.usuarioPerfil === "Professor" ? "bg-blue-100 text-blue-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {l.usuarioPerfil}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{l.acao}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 flex items-center gap-1">
                        {l.ip ? (
                          <>
                            <Globe className="h-3 w-3 text-gray-400" />
                            {l.ip}
                          </>
                        ) : "-"}
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 px-4 text-center">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">Nenhum registro encontrado com os filtros atuais.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-gray-600">
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
            <span className="font-medium"> Página {pageSafe} de {totalLogsPages} </span>
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
