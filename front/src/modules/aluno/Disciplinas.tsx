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
  CheckCircle,
  TrendingUp,
  Calculator,
  Atom,
  Palette,
  Zap,
  Globe2,
  Flame,
  ScrollText,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type IconComponent = React.ComponentType<{ className?: string }>;

type DisciplinaUI = {
  id: number;
  codigo: string; // mat, hist, bio, qui, etc
  nome: string;
  icon: IconComponent;
  cor: keyof typeof cores;
  progresso: number;
  moedas_conquistadas: number;
  moedas_totais_disciplina?: number;
  atividades: { total: number; concluidas: number; pendentes: number };
  resumos: number;
  videoaulas: { total: number; assistidas: number };
};

type DisciplinaDb = {
  id_disciplina: number;
  nome?: string | null;
  nome_disciplina?: string | null;
  codigo: string | null;
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
  orange: {
    grad: "from-orange-500 to-red-500",
    text: "text-orange-600",
    bgLight: "bg-orange-50",
    border: "border-orange-200",
    bar: "bg-orange-600",
    iconBg: "bg-orange-100",
  },
} as const;

// Só visual (ícone + cor), nada de número mock
const DISCIPLINA_VISUAL: Record<
  string,
  { icon: IconComponent; cor: keyof typeof cores }
> = {
  matematica: { icon: Calculator, cor: "blue" },
  historia: { icon: ScrollText, cor: "amber" },
  biologia: { icon: Atom, cor: "green" },
  fisica: { icon: Zap, cor: "purple" },
  geografia: { icon: Globe2, cor: "teal" },
  artes: { icon: Palette, cor: "pink" },
  portugues: { icon: BookOpen, cor: "green" },
  quimica: { icon: Flame, cor: "orange" },
};

// Normaliza nome vindo do banco (remove acentos e põe minúsculo)
// e já trata null/undefined pra não quebrar
function normalizarNome(nome?: string | null): string {
  if (!nome) return "";
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const Disciplinas = () => {
  const router = useRouter();
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<
    number | null
  >(null);
  const [aba, setAba] = useState<"resumos" | "atividades" | "videoaulas">(
    "resumos"
  );

  const [disciplinas, setDisciplinas] = useState<DisciplinaUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega disciplinas + stats reais do aluno logado
  useEffect(() => {
    async function carregarDisciplinasAluno() {
      try {
        setLoading(true);
        setErro(null);

        // 1. Usuário autenticado (Supabase Auth)
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user || !user.id) {
          setErro("Usuário não autenticado.");
          setLoading(false);
          return;
        }

        // 2. Busca o id_usuario na tabela usuarios via auth_user_id
        const { data: usuario, error: usuarioError } = await supabase
          .from("usuarios")
          .select("id_usuario, email")
          .eq("auth_user_id", user.id)
          .single();

        if (usuarioError || !usuario) {
          setErro("Usuário não encontrado na tabela de usuários.");
          setLoading(false);
          return;
        }

        // 3. Busca o aluno vinculado a esse usuário, com turma
        const { data: aluno, error: alunoError } = await supabase
          .from("alunos")
          .select("id_aluno, id_turma")
          .eq("id_usuario", usuario.id_usuario)
          .single();

        if (alunoError || !aluno) {
          setErro("Aluno não encontrado.");
          setLoading(false);
          return;
        }

        if (!aluno.id_turma) {
          setErro("Aluno não está vinculado a nenhuma turma.");
          setLoading(false);
          return;
        }

        const idAluno = aluno.id_aluno;

        // 4. Buscar diretamente da view agregada vw_disciplinas_moedas_aluno
        const { data: vwRows, error: vwError } = await supabase
          .from("vw_disciplinas_moedas_aluno")
          .select("*")
          .eq("id_aluno", idAluno);

        if (vwError) throw vwError;

        if (!vwRows || vwRows.length === 0) {
          setDisciplinas([]);
          setLoading(false);
          return;
        }

        // Monta UI com base na view, usando colunas já agregadas por aluno
        const disciplinasUI: DisciplinaUI[] = vwRows.map((row: any) => {
          const nomeDisciplina: string =
            row.nome_disciplina || row.nome || "Disciplina";
          const codigoDisciplina: string = row.codigo || "";

          const key = normalizarNome(nomeDisciplina);
          const visual =
            DISCIPLINA_VISUAL[key] || DISCIPLINA_VISUAL["matematica"];

          return {
            id: row.id_disciplina,
            codigo: codigoDisciplina,
            nome: nomeDisciplina,
            icon: visual.icon,
            cor: visual.cor,

            // agora vem direto da view, já calculado por aluno
            progresso: row.progresso_percent ?? 0,
            moedas_conquistadas: row.moedas_conquistadas ?? 0,
            moedas_totais_disciplina: row.moedas_totais_disciplina ?? 0,

            atividades: {
              total: row.total_atividades ?? 0,
              concluidas: row.atividades_concluidas ?? 0,
              pendentes: row.atividades_pendentes ?? 0,
            },
            resumos: row.total_resumos ?? 0,
            videoaulas: {
              total: row.total_videoaulas ?? 0,
              assistidas: row.videoaulas_assistidas ?? 0,
            },
          };
        });

        setDisciplinas(disciplinasUI);
        setLoading(false);
      } catch (e: any) {
        console.error(e);
        setErro("Erro ao carregar disciplinas.");
        setLoading(false);
      }
    }

    carregarDisciplinasAluno();
  }, []);

  // Sempre que mudar de disciplina, voltar a aba padrão
  useEffect(() => {
    setAba("resumos");
  }, [disciplinaSelecionada]);

  const selecionada =
    disciplinas.find((d) => d.id === disciplinaSelecionada) || null;

  // Estado de carregamento / erro
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Disciplinas</h1>
        </div>
        <p className="text-gray-600">Carregando suas disciplinas...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Disciplinas</h1>
        </div>
        <p className="text-red-500 text-sm">{erro}</p>
      </div>
    );
  }

  if (!disciplinas.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Disciplinas</h1>
        </div>
        <p className="text-gray-600">
          Nenhuma disciplina encontrada para o seu usuário.
        </p>
      </div>
    );
  }

  // Tela de detalhes quando uma disciplina está selecionada
  if (selecionada) {
    const t = cores[selecionada.cor];
    const Icon = selecionada.icon;

    const percVideo =
      selecionada.videoaulas.total > 0
        ? Math.round(
            (selecionada.videoaulas.assistidas / selecionada.videoaulas.total) *
              100
          )
        : 0;

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
                {selecionada.moedas_conquistadas} moedas conquistadas
                {typeof selecionada.moedas_totais_disciplina === "number" && (
                  <> / {selecionada.moedas_totais_disciplina}</>
                )}
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
                    <span>{percVideo}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${t.bar} transition-all duration-300`}
                      style={{
                        width: `${percVideo}%`,
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

      {/* Cards das disciplinas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {disciplinas.map((disciplina) => {
          const t = cores[disciplina.cor];
          const Icon = disciplina.icon;
          const n = disciplina.nome.toLowerCase();
          return (
            <Card
              key={disciplina.id}
              className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 h-[140px]"
            >
              <CardContent className="p-4 h-full">
                <div
                  className="cursor-pointer h-full flex flex-col justify-between"
                  onClick={() => {
                    // Usa codigo direto da disciplina (mat, hist, bio, qui, etc)
                    const slug = disciplina.codigo || String(disciplina.id);
                    // Normaliza nome para tema (remove acentos e deixa minúsculo)
                    const tema = disciplina.nome
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase();
                    setDisciplinaSelecionada(disciplina.id);
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
                        {disciplina.moedas_conquistadas} moedas conquistadas
                        {typeof disciplina.moedas_totais_disciplina ===
                          "number" && (
                          <> / {disciplina.moedas_totais_disciplina}</>
                        )}
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
