"use client";

import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  atividades as mockAtividades,
  resumos as mockResumos,
  videoaulas as mockVideos,
} from "@/lib/mock/aluno";
import {
  BookOpen,
  FileText,
  Activity as LActivity,
  Play,
  Award,
  Clock,
  Users,
} from "lucide-react";
import {
  FaCalculator,
  FaFlask,
  FaGlobeAmericas,
  FaBook,
  FaAtom,
  FaPalette,
} from "react-icons/fa";
import { resolverTema } from "@/modules/aluno/tema";

type IconComponent = (props: { className?: string }) => JSX.Element;

const iconByNome: Record<string, IconComponent> = {
  matemática: (p) => <FaCalculator {...p} />,
  português: (p) => <FaBook {...p} />,
  historia: (p) => <FaBook {...p} />,
  história: (p) => <FaBook {...p} />,
  biologia: (p) => <FaFlask {...p} />,
  física: (p) => <FaAtom {...p} />,
  geografia: (p) => <FaGlobeAmericas {...p} />,
  artes: (p) => <FaPalette {...p} />,
};

function nomeToSlug(nome: string): string {
  const n = nome.toLowerCase();
  if (n === "matemática") return "mat";
  if (n === "português") return "port";
  if (n === "história" || n === "historia") return "hist";
  if (n === "geografia") return "geo";
  if (n === "biologia") return "bio";
  if (n === "física" || n === "fisica") return "fis";
  if (n === "artes") return "art";
  return n;
}

function nomePorSlug(id: string): string {
  const mapa: Record<string, string> = {
    mat: "Matemática",
    port: "Português",
    hist: "História",
    geo: "Geografia",
    bio: "Biologia",
    fis: "Física",
    art: "Artes",
  };
  return mapa[id] || id;
}

export default function MateriaDashboardPage() {
  const { query, push } = useRouter();
  const id = String(query.id || "");

  // Buscar dados da disciplina
  const disciplina = mockDisciplinas.find((d) => d.id === id);
  const nome = disciplina?.nome || nomePorSlug(id);
  const tema = resolverTema({ id, nome, queryTema: query.tema });
  const Icon: IconComponent =
    iconByNome[nome.toLowerCase()] || ((p) => <BookOpen {...p} />);

  // Estatísticas da matéria
  const atividades = mockAtividades.filter((a) => a.disciplinaId === id);
  const resumos = mockResumos.filter((r) => r.disciplinaId === id);
  const videos = mockVideos.filter((v) => v.disciplinaId === id);

  const atividadesPendentes = atividades.filter(
    (a) => a.status === "pendente"
  ).length;
  const atividadesConcluidas = atividades.filter(
    (a) => a.status === "corrigido" || a.status === "enviado"
  ).length;
  const proximaAtividade = atividades.find((a) => a.status === "pendente");

  return (
    <AlunoLayout>
      <div className="space-y-6">
        {/* Cabeçalho da Matéria */}
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-xl bg-gradient-to-br ${tema.grad} text-white`}
          >
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{nome}</h1>
            <p className="text-gray-600">Dashboard da disciplina</p>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Atividades Pendentes
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {atividadesPendentes}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Concluídas
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {atividadesConcluidas}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Videoaulas
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {videos.length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Play className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resumos</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {resumos.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acesso Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => push(`/aluno/disciplinas/${id}/atividades`)}
          >
            <Card className="border border-gray-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${tema.grad} text-white`}
                  >
                    <LActivity className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Atividades</h3>
                    <p className="text-sm text-gray-600">
                      {atividadesPendentes} pendentes • {atividadesConcluidas}{" "}
                      concluídas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => push(`/aluno/disciplinas/${id}/videoaulas`)}
          >
            <Card className="border border-gray-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${tema.grad} text-white`}
                  >
                    <Play className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Videoaulas</h3>
                    <p className="text-sm text-gray-600">
                      {videos.length} vídeos disponíveis
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => push(`/aluno/disciplinas/${id}/resumos`)}
          >
            <Card className="border border-gray-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${tema.grad} text-white`}
                  >
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Resumos</h3>
                    <p className="text-sm text-gray-600">
                      {resumos.length} materiais de estudo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Próxima Atividade */}
        {proximaAtividade && (
          <Card className="border border-gray-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Próxima Atividade
                  </h3>
                  <p className="font-medium text-gray-900">
                    {proximaAtividade.titulo}
                  </p>
                  <p className="text-sm text-orange-600 mt-2">
                    Prazo:{" "}
                    {new Date(proximaAtividade.prazo).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
                <button
                  onClick={() =>
                    push(`/disciplinas/${id}/atividades/${proximaAtividade.id}`)
                  }
                  className={`px-4 py-2 rounded-lg bg-gradient-to-r ${tema.grad} text-white hover:opacity-90 transition-opacity`}
                >
                  Fazer Agora
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AlunoLayout>
  );
}
