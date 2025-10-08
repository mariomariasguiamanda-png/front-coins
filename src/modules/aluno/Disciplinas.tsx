import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/Card";
import {
  BookOpen,
  Play,
  FileText,
  Activity,
  ArrowRight,
  ArrowLeft,
  Award,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import {
  FaCalculator,
  FaFlask,
  FaGlobeAmericas,
  FaBook,
  FaAtom,
  FaPalette,
} from "react-icons/fa";

type IconComponent = React.ComponentType<{ className?: string }>;

type Disciplina = {
  id: number;
  nome: string;
  icon: IconComponent;
  cor: keyof typeof cores;
  progresso: number;
  moedas: number;
  totalMoedas: number;
  atividades: { total: number; concluidas: number; pendentes: number };
  resumos: number;
  videoaulas: { total: number; assistidas: number };
};

const cores = {
  blue: {
    grad: "from-blue-500 to-blue-600",
    text: "text-blue-600",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    bar: "bg-blue-600",
    iconBg: "bg-blue-100",
  },
  amber: {
    grad: "from-amber-500 to-amber-600",
    text: "text-amber-600",
    bgLight: "bg-amber-50",
    border: "border-amber-200",
    bar: "bg-amber-600",
    iconBg: "bg-amber-100",
  },
  green: {
    grad: "from-green-500 to-green-600",
    text: "text-green-600",
    bgLight: "bg-green-50",
    border: "border-green-200",
    bar: "bg-green-600",
    iconBg: "bg-green-100",
  },
  purple: {
    grad: "from-purple-500 to-purple-600",
    text: "text-purple-600",
    bgLight: "bg-purple-50",
    border: "border-purple-200",
    bar: "bg-purple-600",
    iconBg: "bg-purple-100",
  },
  teal: {
    grad: "from-teal-500 to-teal-600",
    text: "text-teal-600",
    bgLight: "bg-teal-50",
    border: "border-teal-200",
    bar: "bg-teal-600",
    iconBg: "bg-teal-100",
  },
  pink: {
    grad: "from-pink-500 to-pink-600",
    text: "text-pink-600",
    bgLight: "bg-pink-50",
    border: "border-pink-200",
    bar: "bg-pink-600",
    iconBg: "bg-pink-100",
  },
} as const;

const Disciplinas = () => {
  const router = useRouter();
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<
    number | null
  >(null);
  const [aba, setAba] = useState<"resumos" | "atividades" | "videoaulas">(
    "resumos"
  );

  const disciplinas: Disciplina[] = [
    {
      id: 1,
      nome: "Matemática",
      icon: FaCalculator,
      cor: "blue",
      progresso: 75,
      moedas: 450,
      totalMoedas: 600,
      atividades: { total: 12, concluidas: 9, pendentes: 3 },
      resumos: 8,
      videoaulas: { total: 15, assistidas: 12 },
    },
    {
      id: 2,
      nome: "História",
      icon: FaBook,
      cor: "amber",
      progresso: 60,
      moedas: 320,
      totalMoedas: 550,
      atividades: { total: 10, concluidas: 6, pendentes: 4 },
      resumos: 12,
      videoaulas: { total: 18, assistidas: 10 },
    },
    {
      id: 3,
      nome: "Biologia",
      icon: FaFlask,
      cor: "green",
      progresso: 85,
      moedas: 520,
      totalMoedas: 600,
      atividades: { total: 14, concluidas: 12, pendentes: 2 },
      resumos: 6,
      videoaulas: { total: 20, assistidas: 17 },
    },
    {
      id: 4,
      nome: "Física",
      icon: FaAtom,
      cor: "purple",
      progresso: 45,
      moedas: 180,
      totalMoedas: 400,
      atividades: { total: 8, concluidas: 4, pendentes: 4 },
      resumos: 5,
      videoaulas: { total: 12, assistidas: 5 },
    },
    {
      id: 5,
      nome: "Geografia",
      icon: FaGlobeAmericas,
      cor: "teal",
      progresso: 70,
      moedas: 350,
      totalMoedas: 500,
      atividades: { total: 11, concluidas: 8, pendentes: 3 },
      resumos: 9,
      videoaulas: { total: 16, assistidas: 11 },
    },
    {
      id: 6,
      nome: "Artes",
      icon: FaPalette,
      cor: "pink",
      progresso: 90,
      moedas: 270,
      totalMoedas: 300,
      atividades: { total: 6, concluidas: 6, pendentes: 0 },
      resumos: 4,
      videoaulas: { total: 8, assistidas: 8 },
    },
  ];

  const selecionada =
    disciplinas.find((d) => d.id === disciplinaSelecionada) || null;

  // Sempre que mudar de disciplina, voltar a aba padrão
  useEffect(() => {
    setAba("resumos");
  }, [disciplinaSelecionada]);

  if (disciplinaSelecionada && selecionada) {
    const t = cores[selecionada.cor];
    const Icon = selecionada.icon;

    return (
      <div className="space-y-6 transition-all duration-300">
        {/* Header da disciplina */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDisciplinaSelecionada(null)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${t.grad}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selecionada.nome}
              </h1>
              <p className="text-sm text-gray-600">
                {selecionada.moedas} de {selecionada.totalMoedas} moedas
                conquistadas
              </p>
            </div>
          </div>
        </div>

        {/* Gráfico de desempenho */}
        <Card className={`bg-gradient-to-br ${t.bgLight} ${t.border} border`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Desempenho na Disciplina
              </h3>
              <span className={`${t.text} font-bold text-2xl`}>
                {selecionada.progresso}%
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progresso Geral</span>
                  <span>{selecionada.progresso}%</span>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${t.grad} transition-all duration-500`}
                    style={{ width: `${selecionada.progresso}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${t.text}`}>
                    {selecionada.moedas}
                  </div>
                  <div className="text-sm text-gray-600">Moedas</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${t.text}`}>
                    {selecionada.atividades.concluidas}
                  </div>
                  <div className="text-sm text-gray-600">Concluídas</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${t.text}`}>
                    {selecionada.videoaulas.assistidas}
                  </div>
                  <div className="text-sm text-gray-600">Videoaulas</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Abas internas */}
        <div className="flex items-center gap-2 border-b border-gray-200">
          {(
            [
              { key: "resumos", label: "Resumos" },
              { key: "atividades", label: "Atividades" },
              { key: "videoaulas", label: "Videoaulas" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setAba(tab.key)}
              className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors ${
                aba === tab.key
                  ? `${t.text} border-current`
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo da aba */}
        <div className="mt-4">
          {aba === "resumos" && (
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${t.iconBg} rounded-lg`}>
                      <FileText className={`h-5 w-5 ${t.text}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900">Resumos</h3>
                  </div>
                  <span className={`text-2xl font-bold ${t.text}`}>
                    {selecionada.resumos}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Acesse os materiais postados pelos professores.
                </p>
              </CardContent>
            </Card>
          )}

          {aba === "atividades" && (
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${t.iconBg} rounded-lg`}>
                    <Activity className={`h-5 w-5 ${t.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Atividades</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />{" "}
                      Concluídas
                    </span>
                    <span className="font-semibold">
                      {selecionada.atividades.concluidas}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-orange-500" /> Pendentes
                    </span>
                    <span className="font-semibold">
                      {selecionada.atividades.pendentes}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {aba === "videoaulas" && (
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${t.iconBg} rounded-lg`}>
                    <Play className={`h-5 w-5 ${t.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Videoaulas</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progresso</span>
                    <span>
                      {Math.round(
                        (selecionada.videoaulas.assistidas /
                          selecionada.videoaulas.total) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${t.bar} transition-all duration-300`}
                      style={{
                        width: `${
                          (selecionada.videoaulas.assistidas /
                            selecionada.videoaulas.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {selecionada.videoaulas.assistidas} de{" "}
                    {selecionada.videoaulas.total} assistidas
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Opções disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resumos */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (selecionada) {
                    const slug =
                      selecionada.nome.toLowerCase() === "matemática"
                        ? "mat"
                        : selecionada.nome.toLowerCase() === "português"
                        ? "port"
                        : selecionada.nome.toLowerCase() === "história"
                        ? "hist"
                        : selecionada.nome.toLowerCase() === "geografia"
                        ? "geo"
                        : selecionada.nome.toLowerCase() === "biologia"
                        ? "bio"
                        : selecionada.nome.toLowerCase() === "física"
                        ? "fis"
                        : selecionada.nome.toLowerCase() === "artes"
                        ? "art"
                        : String(selecionada.id);
                    router.push(`/aluno/disciplinas/${slug}/resumos`);
                  }
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === "Enter") {
                    if (selecionada) {
                      const slug =
                        selecionada.nome.toLowerCase() === "matemática"
                          ? "mat"
                          : selecionada.nome.toLowerCase() === "português"
                          ? "port"
                          : selecionada.nome.toLowerCase() === "história"
                          ? "hist"
                          : selecionada.nome.toLowerCase() === "geografia"
                          ? "geo"
                          : selecionada.nome.toLowerCase() === "biologia"
                          ? "bio"
                          : selecionada.nome.toLowerCase() === "física"
                          ? "fis"
                          : selecionada.nome.toLowerCase() === "artes"
                          ? "art"
                          : String(selecionada.id);
                      router.push(`/aluno/disciplinas/${slug}/resumos`);
                    }
                  }
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 ${t.iconBg} rounded-lg`}>
                    <FileText className={`h-5 w-5 ${t.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Resumos</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Materiais de estudo e resumos postados pelos professores
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${t.text}`}>
                    {selecionada.resumos}
                  </span>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atividades */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (selecionada) {
                    const slug =
                      selecionada.nome.toLowerCase() === "matemática"
                        ? "mat"
                        : selecionada.nome.toLowerCase() === "português"
                        ? "port"
                        : selecionada.nome.toLowerCase() === "história"
                        ? "hist"
                        : selecionada.nome.toLowerCase() === "geografia"
                        ? "geo"
                        : selecionada.nome.toLowerCase() === "biologia"
                        ? "bio"
                        : selecionada.nome.toLowerCase() === "física"
                        ? "fis"
                        : selecionada.nome.toLowerCase() === "artes"
                        ? "art"
                        : String(selecionada.id);
                    router.push(`/aluno/disciplinas/${slug}/atividades`);
                  }
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === "Enter") {
                    if (selecionada) {
                      const slug =
                        selecionada.nome.toLowerCase() === "matemática"
                          ? "mat"
                          : selecionada.nome.toLowerCase() === "português"
                          ? "port"
                          : selecionada.nome.toLowerCase() === "história"
                          ? "hist"
                          : selecionada.nome.toLowerCase() === "geografia"
                          ? "geo"
                          : selecionada.nome.toLowerCase() === "biologia"
                          ? "bio"
                          : selecionada.nome.toLowerCase() === "física"
                          ? "fis"
                          : selecionada.nome.toLowerCase() === "artes"
                          ? "art"
                          : String(selecionada.id);
                      router.push(`/aluno/disciplinas/${slug}/atividades`);
                    }
                  }
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 ${t.iconBg} rounded-lg`}>
                    <Activity className={`h-5 w-5 ${t.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Atividades</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Tarefas, quizzes e exercícios com prazos e status
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Concluídas
                    </span>
                    <span className="font-semibold">
                      {selecionada.atividades.concluidas}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-orange-500" />
                      Pendentes
                    </span>
                    <span className="font-semibold">
                      {selecionada.atividades.pendentes}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Videoaulas */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (selecionada) {
                    const slug =
                      selecionada.nome.toLowerCase() === "matemática"
                        ? "mat"
                        : selecionada.nome.toLowerCase() === "português"
                        ? "port"
                        : selecionada.nome.toLowerCase() === "história"
                        ? "hist"
                        : selecionada.nome.toLowerCase() === "geografia"
                        ? "geo"
                        : selecionada.nome.toLowerCase() === "biologia"
                        ? "bio"
                        : selecionada.nome.toLowerCase() === "física"
                        ? "fis"
                        : selecionada.nome.toLowerCase() === "artes"
                        ? "art"
                        : String(selecionada.id);
                    router.push(`/aluno/disciplinas/${slug}/videoaulas`);
                  }
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === "Enter") {
                    if (selecionada) {
                      const slug =
                        selecionada.nome.toLowerCase() === "matemática"
                          ? "mat"
                          : selecionada.nome.toLowerCase() === "português"
                          ? "port"
                          : selecionada.nome.toLowerCase() === "história"
                          ? "hist"
                          : selecionada.nome.toLowerCase() === "geografia"
                          ? "geo"
                          : selecionada.nome.toLowerCase() === "biologia"
                          ? "bio"
                          : selecionada.nome.toLowerCase() === "física"
                          ? "fis"
                          : selecionada.nome.toLowerCase() === "artes"
                          ? "art"
                          : String(selecionada.id);
                      router.push(`/aluno/disciplinas/${slug}/videoaulas`);
                    }
                  }
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 ${t.iconBg} rounded-lg`}>
                    <Play className={`h-5 w-5 ${t.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Videoaulas</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Player integrado com progresso salvo automaticamente
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progresso</span>
                    <span>
                      {Math.round(
                        (selecionada.videoaulas.assistidas /
                          selecionada.videoaulas.total) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${t.bar} transition-all duration-300`}
                      style={{
                        width: `${
                          (selecionada.videoaulas.assistidas /
                            selecionada.videoaulas.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {selecionada.videoaulas.assistidas} de{" "}
                    {selecionada.videoaulas.total} assistidas
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tela inicial de disciplinas (listagem)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Disciplinas</h1>
      </div>
      <p className="text-gray-600">
        Acompanhe seu progresso em cada disciplina e acesse conteúdos
        exclusivos.
      </p>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Disciplinas
              </p>
              <p className="text-2xl font-bold text-violet-700">
                {disciplinas.length}
              </p>
            </div>
            <div className="p-3 rounded-xl text-white bg-gradient-to-br from-violet-400 to-violet-500">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Progresso Médio
              </p>
              <p className="text-2xl font-bold text-violet-700">
                {Math.round(
                  disciplinas.reduce((acc, d) => acc + d.progresso, 0) /
                    disciplinas.length
                )}
                %
              </p>
            </div>
            <div className="p-3 rounded-xl text-white bg-gradient-to-br from-green-400 to-green-500">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Moedas
              </p>
              <p className="text-2xl font-bold text-violet-700">
                {disciplinas.reduce((acc, d) => acc + d.moedas, 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl text-white bg-gradient-to-br from-yellow-400 to-yellow-500">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {disciplinas.map((disciplina) => {
          const t = cores[disciplina.cor];
          const Icon = disciplina.icon;
          return (
            <Card
              key={disciplina.id}
              className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 h-[140px]"
            >
              <CardContent className="p-4 h-full">
                <div
                  className="cursor-pointer h-full flex flex-col justify-between"
                  onClick={() => {
                    const n = disciplina.nome.toLowerCase();
                    const slug =
                      n === "matemática"
                        ? "mat"
                        : n === "português"
                        ? "port"
                        : n === "história" || n === "historia"
                        ? "hist"
                        : n === "geografia"
                        ? "geo"
                        : n === "biologia"
                        ? "bio"
                        : n === "física" || n === "fisica"
                        ? "fis"
                        : n === "artes"
                        ? "art"
                        : String(disciplina.id);
                    const tema =
                      n === "matemática"
                        ? "matematica"
                        : n === "português"
                        ? "portugues"
                        : n === "história" || n === "historia"
                        ? "historia"
                        : n === "geografia"
                        ? "geografia"
                        : n === "biologia"
                        ? "biologia"
                        : n === "física" || n === "fisica"
                        ? "fisica"
                        : n === "artes"
                        ? "artes"
                        : "matematica";
                    router.push({
                      pathname: `/aluno/disciplinas/${slug}`,
                      query: { tema },
                    });
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${t.grad}`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {disciplina.nome}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {disciplina.moedas} moedas conquistadas
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progresso</span>
                      <span className="font-medium text-violet-700">
                        {disciplina.progresso}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${t.grad}`}
                        style={{ width: `${disciplina.progresso}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Disciplinas;
