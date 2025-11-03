import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart as LineChartIcon,
  TrendingUp,
  Coins,
  FileText,
  ChevronLeft,
  Users,
  Award,
  BookOpen,
  Activity,
  Medal,
  TrendingDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface DadosTurma {
  turma: string;
  disciplina: string;
  professor: string;
  mediaMoedas: number;
  mediaNotas: number;
  totalAlunos: number;
  distribuicaoMoedas: { nome: string; moedas: number }[];
  evolucaoMensal: { mes: string; moedas: number; notas: number }[];
}

const mockTurmas: DadosTurma[] = [
  {
    turma: "3º A",
    disciplina: "Matemática",
    professor: "Prof. Carlos",
    mediaMoedas: 120,
    mediaNotas: 7.8,
    totalAlunos: 30,
    distribuicaoMoedas: [
      { nome: "Maria", moedas: 160 },
      { nome: "João", moedas: 150 },
      { nome: "Pedro", moedas: 95 },
      { nome: "Camila", moedas: 80 },
      { nome: "Lucas", moedas: 115 },
    ],
    evolucaoMensal: [
      { mes: "Jan", moedas: 100, notas: 7.5 },
      { mes: "Fev", moedas: 110, notas: 7.6 },
      { mes: "Mar", moedas: 125, notas: 7.9 },
      { mes: "Abr", moedas: 130, notas: 8.0 },
      { mes: "Mai", moedas: 135, notas: 8.1 },
      { mes: "Jun", moedas: 140, notas: 8.2 },
    ],
  },
  {
    turma: "3º B",
    disciplina: "Português",
    professor: "Profa. Ana",
    mediaMoedas: 110,
    mediaNotas: 8.2,
    totalAlunos: 28,
    distribuicaoMoedas: [
      { nome: "Lucas", moedas: 140 },
      { nome: "Julia", moedas: 125 },
      { nome: "Carlos", moedas: 85 },
      { nome: "Sofia", moedas: 75 },
      { nome: "Rafael", moedas: 105 },
    ],
    evolucaoMensal: [
      { mes: "Jan", moedas: 90, notas: 7.8 },
      { mes: "Fev", moedas: 102, notas: 8.1 },
      { mes: "Mar", moedas: 114, notas: 8.3 },
      { mes: "Abr", moedas: 118, notas: 8.4 },
      { mes: "Mai", moedas: 122, notas: 8.3 },
      { mes: "Jun", moedas: 125, notas: 8.5 },
    ],
  },
];

type Periodo = "semana" | "mes" | "bimestre" | "semestre" | "ano";

export default function RelatoriosTurmasPage() {
  const [periodo, setPeriodo] = useState<Periodo>("semestre");
  const [turmaIndex, setTurmaIndex] = useState(0);

  const turmaRef = mockTurmas[turmaIndex];

  const evolucao = useMemo(() => {
    const base = turmaRef.evolucaoMensal;
    const size = base.length;
    switch (periodo) {
      case "semana":
        return base.slice(Math.max(0, size - 1));
      case "bimestre":
        return base.slice(Math.max(0, size - 2));
      case "mes":
        return base.slice(Math.max(0, size - 1));
      case "semestre":
        return base;
      case "ano":
        return base.slice(-12);
      default:
        return base;
    }
  }, [periodo, turmaRef]);

  const ranking = useMemo(
    () => [...turmaRef.distribuicaoMoedas].sort((a, b) => b.moedas - a.moedas),
    [turmaRef]
  );

  const mediaMoedasTurma = turmaRef.mediaMoedas;

  // Calcula tendência
  const tendencia = useMemo(() => {
    if (evolucao.length < 2) return 0;
    const primeiro = evolucao[0].moedas;
    const ultimo = evolucao[evolucao.length - 1].moedas;
    return ((ultimo - primeiro) / primeiro) * 100;
  }, [evolucao]);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <LineChartIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Relatórios por Turmas</h1>
                <p className="text-gray-600 mt-1">
                  Evolução mensal, distribuição e ranking
                </p>
              </div>
            </div>
            <Link href="/adm/relatorios-hub" className="no-underline">
              <Button variant="outline" className="rounded-lg inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar ao hub
              </Button>
            </Link>
          </div>

          {/* Stats Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Turmas Totais</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{mockTurmas.length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Alunos Total</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {mockTurmas.reduce((acc, t) => acc + t.totalAlunos, 0)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Média de Moedas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {(
                        mockTurmas.reduce((acc, t) => acc + t.mediaMoedas, 0) /
                        mockTurmas.length
                      ).toFixed(0)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Média de Notas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {(
                        mockTurmas.reduce((acc, t) => acc + t.mediaNotas, 0) /
                        mockTurmas.length
                      ).toFixed(1)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Filters */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={String(turmaIndex)}
                onValueChange={(v) => setTurmaIndex(Number(v))}
              >
                <SelectTrigger className="w-[280px] rounded-lg">
                  <SelectValue placeholder="Selecionar turma" />
                </SelectTrigger>
                <SelectContent>
                  {mockTurmas.map((t, idx) => (
                    <SelectItem key={idx} value={String(idx)}>
                      {t.turma} • {t.disciplina} • {t.professor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={periodo} onValueChange={(v) => setPeriodo(v as Periodo)}>
                <SelectTrigger className="w-[200px] rounded-lg">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Semana</SelectItem>
                  <SelectItem value="mes">Mês</SelectItem>
                  <SelectItem value="bimestre">Bimestre</SelectItem>
                  <SelectItem value="semestre">Semestre</SelectItem>
                  <SelectItem value="ano">Ano letivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Turma Info */}
        <Card className="rounded-xl shadow-sm border-0 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {turmaRef.turma} - {turmaRef.disciplina}
                </h2>
                <p className="text-gray-600 mt-1">Professor: {turmaRef.professor}</p>
              </div>
              <div className="flex items-center gap-2">
                {tendencia > 0 ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-semibold">+{tendencia.toFixed(1)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm font-semibold">{tendencia.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Média de Moedas</p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {turmaRef.mediaMoedas.toFixed(1)}
                  </h3>
                  <p className="mt-2 text-xs text-gray-600">por aluno</p>
                </div>
                <Coins className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-l-4 border-l-violet-500 bg-gradient-to-br from-violet-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Média de Notas</p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {turmaRef.mediaNotas.toFixed(1)}
                  </h3>
                  <p className="mt-2 text-xs text-gray-600">desempenho geral</p>
                </div>
                <Award className="h-8 w-8 text-violet-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Total de Alunos</p>
                  <h3 className="text-3xl font-bold text-gray-900">{turmaRef.totalAlunos}</h3>
                  <p className="mt-2 text-xs text-gray-600">matriculados</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Evolução Mensal */}
          <Card className="rounded-xl shadow-sm">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Evolução no Período</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucao}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="mes" stroke="#6B7280" style={{ fontSize: "12px" }} />
                  <YAxis yAxisId="left" stroke="#6B7280" style={{ fontSize: "12px" }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#6B7280"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="moedas"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    name="Moedas"
                    dot={{ fill: "#F59E0B", r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="notas"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    name="Notas"
                    dot={{ fill: "#8B5CF6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição de Moedas */}
          <Card className="rounded-xl shadow-sm">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Medal className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Distribuição de Moedas (Top 5)
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={turmaRef.distribuicaoMoedas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="nome" stroke="#6B7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="moedas" radius={[8, 8, 0, 0]}>
                    {turmaRef.distribuicaoMoedas.map((e, i) => (
                      <Cell
                        key={`c-${i}`}
                        fill={e.moedas >= mediaMoedasTurma ? "#10B981" : "#8B5CF6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Ranking Card */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Medal className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Ranking de Alunos</h3>
            </div>
            <div className="space-y-3">
              {ranking.map((aluno, idx) => {
                const borderColorClass = 
                  idx === 0 ? "border-l-amber-500" : 
                  idx === 1 ? "border-l-gray-400" : 
                  idx === 2 ? "border-l-orange-600" : 
                  "border-l-violet-500";
                return (
                  <Card
                    key={aluno.nome}
                    className={`rounded-lg border-l-4 hover:shadow-sm transition-shadow ${borderColorClass}`}
                  >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-white ${
                            idx === 0
                              ? "bg-gradient-to-br from-amber-400 to-amber-600"
                              : idx === 1
                              ? "bg-gradient-to-br from-gray-400 to-gray-600"
                              : idx === 2
                              ? "bg-gradient-to-br from-orange-400 to-orange-600"
                              : "bg-gradient-to-br from-violet-400 to-violet-600"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{aluno.nome}</p>
                          <p className="text-xs text-gray-600">
                            {aluno.moedas >= mediaMoedasTurma ? "Acima da média" : "Abaixo da média"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-600">{aluno.moedas}</p>
                        <p className="text-xs text-gray-500">moedas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
