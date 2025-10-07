"use client";

import { useMemo } from "react";
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
  ArrowLeft,
  Award,
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
  return nome.toLowerCase();
}

function nomePorSlug(id: string) {
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

export default function DisciplinaDetalhePage() {
  const { query, back, push } = useRouter();
  const id = String(query.id || "");

  const disc = mockDisciplinas.find((d) => d.id === id);
  const atividades = useMemo(
    () => mockAtividades.filter((a) => a.disciplinaId === id),
    [id]
  );
  const resumos = useMemo(
    () => mockResumos.filter((r) => r.disciplinaId === id),
    [id]
  );
  const videos = useMemo(
    () => mockVideos.filter((v) => v.disciplinaId === id),
    [id]
  );

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const cor = disc?.cor || "#6B7280";
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });
  const IconComponent = iconByNome[tituloDisciplina.toLowerCase()] || FaBook;

  return (
    <AlunoLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => push("/homepage-aluno/disciplinas")}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
            >
              <IconComponent className={`h-6 w-6 ${tema.text}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: cor }}>
                {tituloDisciplina}
              </h1>
              <p className="text-sm text-gray-600">
                Explore atividades, resumos e videoaulas
              </p>
              {disc && (
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">
                      {disc.moedas} moedas
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Progresso: {disc.progresso}%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cards de navegação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => push(`/homepage-aluno/disciplinas/${id}/atividades`)}
          >
            <Card className="rounded-2xl bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10 inline-block mb-3`}
                >
                  <LActivity className={`h-6 w-6 ${tema.text}`} />
                </div>
                <h3 className="font-semibold mb-2">Atividades</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {atividades.length} atividade
                  {atividades.length !== 1 ? "s" : ""} disponível
                  {atividades.length !== 1 ? "is" : ""}
                </p>
                <div className="text-xs text-gray-500">
                  {atividades.filter((a) => a.status === "pendente").length}{" "}
                  pendente
                  {atividades.filter((a) => a.status === "pendente").length !==
                  1
                    ? "s"
                    : ""}
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => push(`/homepage-aluno/disciplinas/${id}/resumos`)}
          >
            <Card className="rounded-2xl bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10 inline-block mb-3`}
                >
                  <FileText className={`h-6 w-6 ${tema.text}`} />
                </div>
                <h3 className="font-semibold mb-2">Resumos</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {resumos.length} resumo{resumos.length !== 1 ? "s" : ""}{" "}
                  disponível{resumos.length !== 1 ? "is" : ""}
                </p>
                <div className="text-xs text-gray-500">Conteúdo organizado</div>
              </CardContent>
            </Card>
          </div>

          <div
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => push(`/homepage-aluno/disciplinas/${id}/videoaulas`)}
          >
            <Card className="rounded-2xl bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10 inline-block mb-3`}
                >
                  <Play className={`h-6 w-6 ${tema.text}`} />
                </div>
                <h3 className="font-semibold mb-2">Videoaulas</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {videos.length} vídeo{videos.length !== 1 ? "s" : ""}{" "}
                  disponível{videos.length !== 1 ? "is" : ""}
                </p>
                <div className="text-xs text-gray-500">Aprenda assistindo</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resumo da disciplina */}
        {disc && (
          <Card className="rounded-2xl bg-white border border-gray-200">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Resumo da Disciplina
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {disc.progresso}%
                  </div>
                  <div className="text-sm text-blue-700">Progresso</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">
                    {disc.moedas}
                  </div>
                  <div className="text-sm text-amber-700">Moedas</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {atividades.length}
                  </div>
                  <div className="text-sm text-green-700">Atividades</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {videos.length}
                  </div>
                  <div className="text-sm text-purple-700">Videoaulas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AlunoLayout>
  );
}
