import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  BookOpen,
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Download,
  Filter,
} from "lucide-react";
import { mockTransacoes } from "@/lib/mock/compras";

export default function ComprasRelatoriosPage() {
  const router = useRouter();
  const [disciplina, setDisciplina] = useState<string>("todas");
  const [periodoDe, setPeriodoDe] = useState<string>("");
  const [periodoAte, setPeriodoAte] = useState<string>("");

  useEffect(() => {
    const q = router.query?.disciplina;
    if (typeof q === "string") setDisciplina(q);
  }, [router.query?.disciplina]);

  const disciplinas = useMemo(() => Array.from(new Set(mockTransacoes.map(t => t.disciplinaNome))), []);

  const data = useMemo(() => {
    return mockTransacoes.filter(t => {
      const okDisc = disciplina === "todas" || t.disciplinaNome === disciplina;
      const ts = new Date(t.data).getTime();
      const de = periodoDe ? new Date(periodoDe).getTime() : -Infinity;
      const ate = periodoAte ? new Date(periodoAte).getTime() + 24*60*60*1000 - 1 : Infinity;
      return okDisc && ts >= de && ts <= ate;
    });
  }, [disciplina, periodoDe, periodoAte]);

  const kpis = useMemo(() => {
    const totalPontos = data.reduce((s, t) => s + t.pontosComprados, 0);
    const totalMoedas = data.reduce((s, t) => s + t.moedasGastas, 0);
    const alunosUnicos = new Set(data.map((t) => t.alunoNome)).size;
    return { totalPontos, totalMoedas, transacoes: data.length, alunosUnicos };
  }, [data]);

  const handleLimpar = () => {
    setDisciplina("todas");
    setPeriodoDe("");
    setPeriodoAte("");
  };

  const handleExportar = () => {
    if (data.length === 0) {
      alert("Nenhuma transação para exportar");
      return;
    }

    const csv = [
      "Data,Aluno,Turma,Disciplina,Pontos Comprados,Moedas Gastas,Saldo Antes,Saldo Depois,Status",
      ...data.map(t =>
        `${t.data},${t.alunoNome},${t.alunoTurma},${t.disciplinaNome},${t.pontosComprados},${t.moedasGastas},${t.saldoAntes},${t.saldoDepois},${t.status}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-compras-${disciplina}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Relatórios e Análises</h1>
                <p className="text-gray-600 mt-1">Histórico detalhado por disciplina e período</p>
              </div>
            </div>
            <Link href="/adm/compras" className="no-underline">
              <Button variant="outline" className="rounded-lg inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar ao hub
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transações</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpis.transacoes}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pontos Comprados</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">+{kpis.totalPontos}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Moedas Gastas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">-{kpis.totalMoedas}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Alunos Únicos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpis.alunosUnicos}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Filters */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-wrap gap-3 flex-1">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Disciplina</label>
                  <Select value={disciplina} onValueChange={setDisciplina}>
                    <SelectTrigger className="w-full rounded-lg">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as disciplinas</SelectItem>
                      {disciplinas.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Período de
                    </label>
                    <Input
                      type="date"
                      value={periodoDe}
                      onChange={(e) => setPeriodoDe(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <span className="text-gray-500 pb-2">até</span>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Até
                    </label>
                    <Input
                      type="date"
                      value={periodoAte}
                      onChange={(e) => setPeriodoAte(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="rounded-lg" onClick={handleLimpar}>
                  Limpar
                </Button>
                <Button 
                  className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 inline-flex items-center gap-2"
                  onClick={handleExportar}
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Histórico de Transações {data.length > 0 && `(${data.length})`}
              </h3>
            </div>

            {data.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma transação encontrada</p>
                <p className="text-sm text-gray-400 mt-1">
                  Ajuste os filtros para ver os resultados
                </p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Data</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Aluno</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Turma</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Disciplina</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Pontos</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Moedas</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((t, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(t.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900">{t.alunoNome}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{t.alunoTurma}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{t.disciplinaNome}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-700 font-semibold text-xs">
                            +{t.pontosComprados}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-100 text-amber-700 font-semibold text-xs">
                            -{t.moedasGastas}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs text-gray-500">
                            <span className="text-gray-600">{t.saldoAntes}</span>
                            <span className="mx-1">→</span>
                            <span className="font-semibold text-gray-900">{t.saldoDepois}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
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
