import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmBackButton } from "@/components/adm/AdmBackButton";
import { AdmFiltersCard } from "@/components/adm/AdmFiltersCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coins, Download, Search, TrendingDown, TrendingUp, Users, Wallet } from "lucide-react";
import { api } from "@/lib/api";

type SaldoAluno = {
  id_aluno: number;
  nome: string;
  email: string;
  matricula: string;
  turma: string | null;
  saldo_total: number;
  total_recebido: number;
  total_gasto: number;
  ultima_transacao: string | null;
  por_disciplina: { id_disciplina: number; nome: string; saldo: number | null }[];
};

import { useRouter } from "next/router";

export default function MoedasSaldosPage() {
  const router = useRouter();
  const fromDashboard = router.query.from === "dashboard";
  const [saldos, setSaldos] = useState<SaldoAluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [turma, setTurma] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get("/admin/moedas/saldos");
        setSaldos(data ?? []);
      } catch (err) {
        console.error("Erro ao carregar saldos:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const turmas = useMemo(
    () => Array.from(new Set(saldos.map((s) => s.turma).filter((t): t is string => !!t))),
    [saldos],
  );

  const filtrados = useMemo(() => {
    const s = search.trim().toLowerCase();
    return saldos.filter((a) => {
      const matchesText =
        !s ||
        a.nome.toLowerCase().includes(s) ||
        a.email.toLowerCase().includes(s) ||
        a.matricula.toLowerCase().includes(s);
      const matchesTurma = turma === "all" || a.turma === turma;
      return matchesText && matchesTurma;
    });
  }, [saldos, search, turma]);

  const stats = useMemo(
    () => ({
      alunos: filtrados.length,
      circulacao: filtrados.reduce((s, a) => s + a.saldo_total, 0),
      recebido: filtrados.reduce((s, a) => s + a.total_recebido, 0),
      gasto: filtrados.reduce((s, a) => s + a.total_gasto, 0),
    }),
    [filtrados],
  );

  const handleExportar = () => {
    const csv = [
      "Aluno,Matrícula,Turma,Saldo Atual,Total Recebido,Total Gasto,Última Transação",
      ...filtrados.map((a) =>
        [
          `"${a.nome}"`,
          a.matricula,
          `"${a.turma ?? "Sem turma"}"`,
          a.saldo_total,
          a.total_recebido,
          a.total_gasto,
          a.ultima_transacao ? new Date(a.ultima_transacao).toLocaleDateString("pt-BR") : "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `saldos-moedas-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saldos de Moedas</h1>
              <p className="text-gray-600 mt-1">Saldo atual e movimentação de cada aluno</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AdmBackButton href={fromDashboard ? "/adm/dashboard" : "/adm/moedas"} className="hidden md:block" />
            <Button className="rounded-lg bg-violet-600 hover:bg-violet-700" onClick={handleExportar}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alunos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.alunos}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
          <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Circulação</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.circulacao}</p>
              </div>
              <Coins className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>
          <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Recebido</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.recebido}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
          <Card className="rounded-xl border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gasto</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.gasto}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <AdmFiltersCard accentClassName="from-amber-500 to-amber-600">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-[340px] items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por aluno, e-mail ou matrícula..."
                className="rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={turma} onValueChange={setTurma}>
              <SelectTrigger className="w-[180px] rounded-lg">
                <SelectValue placeholder="Turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as turmas</SelectItem>
                {turmas.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </AdmFiltersCard>

        {/* Tabela */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            {loading ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Carregando saldos...</p>
            ) : (
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-100">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Aluno</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Turma</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-slate-700">Saldo Atual</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-slate-700">Recebido</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-slate-700">Gasto</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Por Disciplina</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Última Transação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map((a) => (
                      <tr key={a.id_aluno} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <p className="font-medium">{a.nome}</p>
                          <p className="text-sm text-muted-foreground">{a.matricula}</p>
                        </td>
                        <td className="py-3 px-4 text-sm">{a.turma ?? "Sem turma"}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-bold text-amber-600">{a.saldo_total}</span>
                        </td>
                        <td className="py-3 px-4 text-right text-green-600 font-medium">
                          +{a.total_recebido}
                        </td>
                        <td className="py-3 px-4 text-right text-red-600 font-medium">
                          -{a.total_gasto}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {a.por_disciplina.length === 0 && (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                            {a.por_disciplina.map((d) => (
                              <span
                                key={d.id_disciplina}
                                className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700"
                              >
                                {d.nome}: {d.saldo ?? 0}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {a.ultima_transacao
                            ? new Date(a.ultima_transacao).toLocaleDateString("pt-BR")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                    {filtrados.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                          Nenhum aluno encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
