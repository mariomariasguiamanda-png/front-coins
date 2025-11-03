import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart as LineChartIcon,
  Search,
  Coins,
  TrendingUp,
  Medal,
  ChevronLeft,
  Award,
  BookOpen,
  Calendar,
  User,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  TrendingDown,
  Activity,
} from "lucide-react";

interface AlunoNota {
  disciplina: string;
  nota: number;
  mediaMinima: number;
  data: string;
}

interface Mov {
  id: string;
  tipo: "ganho" | "gasto";
  quantidade: number;
  motivo: string;
  disciplina: string;
  data: string;
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
  historicoMoedas: Mov[];
}

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
      totalAlunosEscola: 150,
    },
    notas: [
      { disciplina: "Matemática", nota: 8.5, mediaMinima: 7, data: "2025-10-01" },
      { disciplina: "História", nota: 6.5, mediaMinima: 7, data: "2025-10-05" },
      { disciplina: "Português", nota: 9.0, mediaMinima: 7, data: "2025-10-10" },
      { disciplina: "Física", nota: 7.5, mediaMinima: 7, data: "2025-10-12" },
    ],
    historicoMoedas: [
      {
        id: "1",
        tipo: "ganho",
        quantidade: 20,
        motivo: "Atividade com nota máxima",
        disciplina: "Matemática",
        data: "2025-10-01",
      },
      {
        id: "2",
        tipo: "ganho",
        quantidade: 15,
        motivo: "Resumo postado",
        disciplina: "Português",
        data: "2025-10-03",
      },
      {
        id: "3",
        tipo: "gasto",
        quantidade: 30,
        motivo: "Troca por material",
        disciplina: "Matemática",
        data: "2025-10-05",
      },
    ],
  },
  {
    id: "2",
    nome: "Maria Fernandes",
    matricula: "2023002",
    turma: "3º A",
    saldoMoedas: 510,
    ranking: {
      posicaoTurma: 1,
      totalAlunosTurma: 30,
      posicaoEscola: 2,
      totalAlunosEscola: 150,
    },
    notas: [
      { disciplina: "História", nota: 8.1, mediaMinima: 7, data: "2025-10-05" },
      { disciplina: "Matemática", nota: 9.5, mediaMinima: 7, data: "2025-10-08" },
    ],
    historicoMoedas: [
      {
        id: "4",
        tipo: "gasto",
        quantidade: 30,
        motivo: "Compra de bônus",
        disciplina: "Matemática",
        data: "2025-09-30",
      },
    ],
  },
  {
    id: "3",
    nome: "Pedro Santos",
    matricula: "2023003",
    turma: "3º B",
    saldoMoedas: 380,
    ranking: {
      posicaoTurma: 3,
      totalAlunosTurma: 28,
      posicaoEscola: 12,
      totalAlunosEscola: 150,
    },
    notas: [
      { disciplina: "Física", nota: 7.8, mediaMinima: 7, data: "2025-10-02" },
      { disciplina: "Química", nota: 8.2, mediaMinima: 7, data: "2025-10-06" },
    ],
    historicoMoedas: [
      {
        id: "5",
        tipo: "ganho",
        quantidade: 25,
        motivo: "Quiz concluído",
        disciplina: "Física",
        data: "2025-10-04",
      },
    ],
  },
];

export default function RelatoriosAlunosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTurma, setFiltroTurma] = useState<string>("todas");

  const turmasUnicas = useMemo(
    () => Array.from(new Set(mockAlunos.map((a) => a.turma))),
    []
  );

  const alunosFiltrados = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();
    return mockAlunos.filter(
      (a) =>
        (!termo ||
          a.nome.toLowerCase().includes(termo) ||
          a.matricula.includes(searchTerm.trim())) &&
        (filtroTurma === "todas" || a.turma === filtroTurma)
    );
  }, [searchTerm, filtroTurma]);

  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null);

  useEffect(() => {
    if (!alunosFiltrados.length) {
      setSelectedAlunoId(null);
      return;
    }
    if (
      !selectedAlunoId ||
      !alunosFiltrados.some((a) => a.id === selectedAlunoId)
    ) {
      setSelectedAlunoId(alunosFiltrados[0].id);
    }
  }, [alunosFiltrados, selectedAlunoId]);

  const alunoAtivo = useMemo(() => {
    if (!alunosFiltrados.length) return null;
    return (
      alunosFiltrados.find((a) => a.id === selectedAlunoId) ??
      alunosFiltrados[0]
    );
  }, [alunosFiltrados, selectedAlunoId]);

  const timelineOrdenada = useMemo(
    () =>
      alunoAtivo
        ? [...alunoAtivo.historicoMoedas].sort(
            (a, b) =>
              new Date(b.data).getTime() - new Date(a.data).getTime()
          )
        : [],
    [alunoAtivo]
  );

  const notasOrdenadas = useMemo(
    () =>
      alunoAtivo
        ? [...alunoAtivo.notas].sort(
            (a, b) =>
              new Date(b.data).getTime() - new Date(a.data).getTime()
          )
        : [],
    [alunoAtivo]
  );

  const mediaGeral = useMemo(
    () =>
      alunoAtivo && alunoAtivo.notas.length > 0
        ? (
            alunoAtivo.notas.reduce((acc, n) => acc + n.nota, 0) /
            alunoAtivo.notas.length
          ).toFixed(1)
        : "0.0",
    [alunoAtivo]
  );

  const totalGanhos = useMemo(
    () =>
      alunoAtivo
        ? alunoAtivo.historicoMoedas
            .filter((m) => m.tipo === "ganho")
            .reduce((acc, m) => acc + m.quantidade, 0)
        : 0,
    [alunoAtivo]
  );

  const totalGastos = useMemo(
    () =>
      alunoAtivo
        ? alunoAtivo.historicoMoedas
            .filter((m) => m.tipo === "gasto")
            .reduce((acc, m) => acc + m.quantidade, 0)
        : 0,
    [alunoAtivo]
  );

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <LineChartIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Relatórios por Alunos
                </h1>
                <p className="text-gray-600 mt-1">
                  Painel individual, ranking e linha do tempo
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
            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{mockAlunos.length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Turmas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{turmasUnicas.length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Filtrados</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{alunosFiltrados.length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Selecionado</p>
                    <p className="text-lg font-bold text-gray-900 mt-1 truncate">
                      {alunoAtivo?.nome.split(" ")[0] ?? "-"}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Medal className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Filters */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative max-w-[320px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou matrícula..."
                  className="rounded-lg pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={filtroTurma} onValueChange={setFiltroTurma}>
                  <SelectTrigger className="w-[180px] rounded-lg">
                    <SelectValue placeholder="Turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as turmas</SelectItem>
                    {turmasUnicas.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  disabled={!alunosFiltrados.length}
                  value={selectedAlunoId ?? (alunosFiltrados[0]?.id ?? "")}
                  onValueChange={setSelectedAlunoId}
                >
                  <SelectTrigger className="w-[260px] rounded-lg">
                    <SelectValue placeholder="Selecionar aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunosFiltrados.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.nome} • {a.turma} • {a.matricula}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {alunoAtivo ? (
          <>
            {/* Student Info Card */}
            <Card className="rounded-xl shadow-sm border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {alunoAtivo.nome.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{alunoAtivo.nome}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Matrícula: {alunoAtivo.matricula}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        Turma: {alunoAtivo.turma}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Coins className="h-6 w-6 text-amber-500" />
                    <p className="text-sm font-medium text-gray-600">Saldo de Moedas</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{alunoAtivo.saldoMoedas}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="text-green-600">+{totalGanhos}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-red-600">-{totalGastos}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Medal className="h-6 w-6 text-emerald-500" />
                    <p className="text-sm font-medium text-gray-600">Ranking na Turma</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {alunoAtivo.ranking.posicaoTurma}º
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    de {alunoAtivo.ranking.totalAlunosTurma} alunos
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-l-4 border-l-sky-500 bg-gradient-to-br from-sky-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="h-6 w-6 text-sky-500" />
                    <p className="text-sm font-medium text-gray-600">Ranking na Escola</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {alunoAtivo.ranking.posicaoEscola}º
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    de {alunoAtivo.ranking.totalAlunosEscola} alunos
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-l-4 border-l-violet-500 bg-gradient-to-br from-violet-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-6 w-6 text-violet-500" />
                    <p className="text-sm font-medium text-gray-600">Média Geral</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{mediaGeral}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {alunoAtivo.notas.length} disciplinas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Details Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Notas Card */}
              <Card className="rounded-xl shadow-sm">
                <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      Notas por Disciplina
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {notasOrdenadas.map((n) => {
                      const borderColorClass = n.nota >= n.mediaMinima ? "border-green-500" : "border-red-500";
                      return (
                        <Card
                          key={`${n.disciplina}-${n.data}`}
                          className={`rounded-lg border-2 hover:shadow-sm transition-shadow ${borderColorClass}`}
                        >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-gray-900">{n.disciplina}</h5>
                                {n.nota >= n.mediaMinima ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {new Date(n.data).toLocaleDateString("pt-BR")} • Mínima:{" "}
                                {n.mediaMinima.toFixed(1)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-2xl font-bold ${
                                  n.nota >= n.mediaMinima ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {n.nota.toFixed(1)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Card */}
              <Card className="rounded-xl shadow-sm">
                <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-xl"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      Linha do Tempo de Moedas
                    </h4>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute left-2 top-0 bottom-0 w-px bg-amber-200" />
                    <div className="space-y-4">
                      {timelineOrdenada.map((m) => {
                        const config = {
                          ganho: {
                            icon: Plus,
                            color: "text-green-600",
                            bg: "bg-green-100",
                            border: "border-green-400",
                            sign: "+",
                          },
                          gasto: {
                            icon: Minus,
                            color: "text-red-600",
                            bg: "bg-red-100",
                            border: "border-red-400",
                            sign: "-",
                          },
                        };
                        const cfg = config[m.tipo];
                        const IconComponent = cfg.icon;

                        return (
                          <div key={m.id} className="relative">
                            <span
                              className={`absolute -left-[7px] mt-2 h-3 w-3 rounded-full border-2 ${cfg.border} bg-white`}
                            />
                            <Card className={`rounded-lg border-l-4 ${cfg.border}`}>
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-2 flex-1">
                                    <div className={`h-6 w-6 rounded ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                                      <IconComponent className={`h-3 w-3 ${cfg.color}`} />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-sm text-gray-900">
                                        {m.disciplina}
                                      </p>
                                      <p className="text-xs text-gray-600 mt-1">{m.motivo}</p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {new Date(m.data).toLocaleDateString("pt-BR")}
                                      </p>
                                    </div>
                                  </div>
                                  <span className={`text-lg font-bold ${cfg.color}`}>
                                    {cfg.sign}
                                    {m.quantidade}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="rounded-xl border-dashed border-2 border-gray-300">
            <CardContent className="p-10 text-center">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Nenhum aluno encontrado com os filtros aplicados.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
