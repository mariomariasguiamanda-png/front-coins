import { useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  LineChart as LineChartIcon,
  Star,
  Search,
  Download,
  Filter,
  TrendingUp,
  Medal,
  Award,
  AlertTriangle,
  Coins,
  FileText,
  Table,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  LineChart,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interfaces
interface AlunoNota {
  disciplina: string;
  nota: number;
  mediaMinima: number;
  data: string;
}

interface MovimentacaoMoedas {
  id: string;
  tipo: "ganho" | "gasto";
  quantidade: number;
  motivo: string;
  disciplina: string;
  data: string;
}

interface DadosTurma {
  turma: string;
  disciplina: string;
  professor: string;
  mediaMoedas: number;
  mediaNotas: number;
  totalAlunos: number;
  distribuicaoMoedas: { nome: string; moedas: number }[];
  evolucaoMensal: {
    mes: string;
    moedas: number;
    notas: number;
  }[];
}

interface AlunoDesempenho {
  id: string;
  nome: string;
  matricula: string;
  turma: string;
  saldoMoedas: number;
  ranking: {
    posicaoTurma: number;
    totalAlunosTurma: number;
    posicaoEscola: number;
    totalAlunosEscola: number;
  };
  notas: AlunoNota[];
  historicoMoedas: MovimentacaoMoedas[];
}

// Mock data
const mockAlunos: AlunoDesempenho[] = [
  {
    id: "1",
    nome: "João Silva",
    matricula: "2023001",
    turma: "3º A",
    saldoMoedas: 450,
    ranking: {
      posicaoTurma: 2,
      totalAlunosTurma: 30,
      posicaoEscola: 5,
      totalAlunosEscola: 150
    },
    notas: [
      {
        disciplina: "Matemática",
        nota: 8.5,
        mediaMinima: 7.0,
        data: "2025-10-01"
      },
      {
        disciplina: "História",
        nota: 6.5,
        mediaMinima: 7.0,
        data: "2025-10-05"
      }
    ],
    historicoMoedas: [
      {
        id: "1",
        tipo: "ganho",
        quantidade: 20,
        motivo: "Atividade entregue com nota máxima",
        disciplina: "Matemática",
        data: "2025-10-01"
      },
      {
        id: "2",
        tipo: "gasto",
        quantidade: 50,
        motivo: "Compra de pontos",
        disciplina: "História",
        data: "2025-10-05"
      }
    ]
  }
];

// Mock data for charts
const mockTurmas: DadosTurma[] = [
  {
    turma: '3º A',
    disciplina: 'Matemática',
    professor: 'Prof. Carlos',
    mediaMoedas: 120,
    mediaNotas: 7.8,
    totalAlunos: 30,
    distribuicaoMoedas: [
      { nome: 'João', moedas: 150 },
      { nome: 'Maria', moedas: 130 },
      { nome: 'Pedro', moedas: 90 },
    ],
    evolucaoMensal: [
      { mes: 'Jan', moedas: 100, notas: 7.5 },
      { mes: 'Fev', moedas: 110, notas: 7.6 },
      { mes: 'Mar', moedas: 120, notas: 7.8 },
    ],
  },
  {
    turma: '3º B',
    disciplina: 'Português',
    professor: 'Profa. Ana',
    mediaMoedas: 110,
    mediaNotas: 8.2,
    totalAlunos: 28,
    distribuicaoMoedas: [
      { nome: 'Lucas', moedas: 140 },
      { nome: 'Julia', moedas: 120 },
      { nome: 'Carlos', moedas: 85 },
    ],
    evolucaoMensal: [
      { mes: 'Jan', moedas: 90, notas: 7.8 },
      { mes: 'Fev', moedas: 100, notas: 8.0 },
      { mes: 'Mar', moedas: 110, notas: 8.2 },
    ],
  },
];

export default function RelatoriosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAluno, setSelectedAluno] = useState<AlunoDesempenho | null>(null);
  const [filtroTurma, setFiltroTurma] = useState<string>("todas");
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("todas");
  const [periodoAnalise, setPeriodoAnalise] = useState<string>("30d");
  const [viewMode, setViewMode] = useState<"alunos" | "turmas">("alunos");

  const turmasUnicas = Array.from(new Set(mockAlunos.map(a => a.turma)));

  const alunosFiltrados = mockAlunos.filter(aluno => {
    const matchesSearch = aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aluno.matricula.includes(searchTerm);
    const matchesTurma = filtroTurma === "todas" || aluno.turma === filtroTurma;
    return matchesSearch && matchesTurma;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Relatórios de Desempenho</h1>
            <p className="text-muted-foreground">
              Análise detalhada do desempenho individual dos alunos
            </p>
          </div>
          <Button
            className="rounded-lg bg-violet-600 hover:bg-violet-700"
            onClick={() => {
              // Implementar exportação de relatório
              console.log("Exportar relatório");
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </header>

        {/* Tabs */}
        <div className="flex space-x-2 border-b">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              viewMode === "alunos"
                ? "border-b-2 border-violet-600 text-violet-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setViewMode("alunos")}
          >
            Visualização por Alunos
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              viewMode === "turmas"
                ? "border-b-2 border-violet-600 text-violet-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setViewMode("turmas")}
          >
            Análise por Turmas
          </button>
        </div>

        {/* Filtros */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex max-w-[320px] items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={viewMode === "alunos" ? "Buscar por nome ou matrícula..." : "Buscar por turma ou disciplina..."}
                  className="rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={filtroTurma}
                  onValueChange={setFiltroTurma}
                >
                  <SelectTrigger className="w-[180px] rounded-lg">
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as turmas</SelectItem>
                    {turmasUnicas.map((turma) => (
                      <SelectItem key={turma} value={turma}>
                        {turma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filtroDisciplina}
                  onValueChange={setFiltroDisciplina}
                >
                  <SelectTrigger className="w-[180px] rounded-lg">
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as disciplinas</SelectItem>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="portugues">Português</SelectItem>
                    <SelectItem value="historia">História</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={periodoAnalise}
                  onValueChange={setPeriodoAnalise}
                >
                  <SelectTrigger className="w-[180px] rounded-lg">
                    <SelectValue placeholder="Período de análise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="365d">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualização de Turmas */}
        {viewMode === "turmas" && (
          <div className="grid gap-6">
            {/* Resumo Geral */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Média de Moedas</p>
                      <h3 className="text-2xl font-bold text-violet-600">115</h3>
                    </div>
                    <Coins className="h-8 w-8 text-violet-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Média de Notas</p>
                      <h3 className="text-2xl font-bold text-violet-600">8.0</h3>
                    </div>
                    <TrendingUp className="h-8 w-8 text-violet-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Alunos</p>
                      <h3 className="text-2xl font-bold text-violet-600">58</h3>
                    </div>
                    <FileText className="h-8 w-8 text-violet-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Evolução Mensal */}
              <Card className="rounded-xl">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Evolução Mensal</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockTurmas[0].evolucaoMensal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="moedas"
                        stroke="#8b5cf6"
                        name="Moedas"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="notas"
                        stroke="#22c55e"
                        name="Notas"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribuição de Moedas */}
              <Card className="rounded-xl">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Distribuição de Moedas</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockTurmas[0].distribuicaoMoedas}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nome" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="moedas" fill="#8b5cf6">
                        {mockTurmas[0].distribuicaoMoedas.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.moedas > 100 ? "#22c55e" : "#8b5cf6"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Turmas */}
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Resumo por Turmas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-sm">
                        <th className="py-3 text-left font-medium">Turma</th>
                        <th className="py-3 text-left font-medium">Disciplina</th>
                        <th className="py-3 text-left font-medium">Professor</th>
                        <th className="py-3 text-left font-medium">Média Moedas</th>
                        <th className="py-3 text-left font-medium">Média Notas</th>
                        <th className="py-3 text-left font-medium">Total Alunos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTurmas.map((turma, index) => (
                        <tr
                          key={index}
                          className="border-b last:border-0 hover:bg-violet-50/50"
                        >
                          <td className="py-3">{turma.turma}</td>
                          <td className="py-3">{turma.disciplina}</td>
                          <td className="py-3">{turma.professor}</td>
                          <td className="py-3">{turma.mediaMoedas}</td>
                          <td className="py-3">{turma.mediaNotas.toFixed(1)}</td>
                          <td className="py-3">{turma.totalAlunos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Alunos */}
        {viewMode === "alunos" && (
          <div className="grid gap-6">
            {alunosFiltrados.map((aluno: AlunoDesempenho) => (
            <Card key={aluno.id} className="rounded-xl">
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{aluno.nome}</h3>
                        {aluno.ranking.posicaoTurma <= 3 && (
                          <div className="flex items-center gap-1 text-amber-500">
                            <Medal className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Top {aluno.ranking.posicaoTurma}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
                        <p>Matrícula: {aluno.matricula}</p>
                        <p>Turma: {aluno.turma}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Ranking</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Na Turma</p>
                          <p className="text-lg font-medium">
                            {aluno.ranking.posicaoTurma}º
                            <span className="text-sm text-muted-foreground">
                              /{aluno.ranking.totalAlunosTurma}
                            </span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Na Escola</p>
                          <p className="text-lg font-medium">
                            {aluno.ranking.posicaoEscola}º
                            <span className="text-sm text-muted-foreground">
                              /{aluno.ranking.totalAlunosEscola}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Saldo de Moedas</h4>
                      <div className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-amber-500" />
                        <span className="text-2xl font-bold text-violet-600">
                          {aluno.saldoMoedas}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Notas Recentes</h4>
                    <div className="space-y-3">
                      {aluno.notas.map((nota: AlunoNota, index: number) => (
                        <div
                          key={index}
                          className={`rounded-lg border p-3 ${
                            nota.nota < nota.mediaMinima
                              ? "border-red-200 bg-red-50"
                              : "border-green-200 bg-green-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{nota.disciplina}</span>
                            <span
                              className={`${
                                nota.nota < nota.mediaMinima
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {nota.nota.toFixed(1)}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Média mínima: {nota.mediaMinima.toFixed(1)}
                            </span>
                            <span className="text-muted-foreground">
                              {new Date(nota.data).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Histórico de Moedas */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Histórico de Moedas</h4>
                    <div className="space-y-3">
                      {aluno.historicoMoedas.map((movimento: MovimentacaoMoedas) => (
                        <div
                          key={movimento.id}
                          className="rounded-lg border border-violet-100 bg-violet-50/50 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{movimento.disciplina}</span>
                            <span
                              className={
                                movimento.tipo === "ganho"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {movimento.tipo === "ganho" ? "+" : "-"}
                              {movimento.quantidade}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {movimento.motivo}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(movimento.data).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Alertas */}
                {aluno.notas.some((nota: AlunoNota) => nota.nota < nota.mediaMinima) && (
                  <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <AlertTriangle className="h-5 w-5" />
                      <p className="font-medium">
                        Atenção: Este aluno possui notas abaixo da média mínima
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}