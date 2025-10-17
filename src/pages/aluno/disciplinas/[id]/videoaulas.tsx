"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  videoaulas as mockVideos,
} from "@/lib/mock/aluno";
import { Video, ArrowLeft, Play } from "lucide-react";
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

const iconByDisciplina: Record<string, IconComponent> = {
  mat: (p) => <FaCalculator {...p} />,
  port: (p) => <FaBook {...p} />,
  hist: (p) => <FaBook {...p} />,
  geo: (p) => <FaGlobeAmericas {...p} />,
  bio: (p) => <FaFlask {...p} />,
  fis: (p) => <FaAtom {...p} />,
  art: (p) => <FaPalette {...p} />,
};

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

export default function VideoaulasPage() {
  const { query, push } = useRouter();
  const id = String(query.id || "");

  const disc = mockDisciplinas.find((d) => d.id === id);
  const videos = useMemo(
    () => mockVideos.filter((v) => v.disciplinaId === id),
    [id]
  );

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });
  const IconComponent = iconByDisciplina[id] || FaBook;

  return (
    <AlunoLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => push(`/aluno/disciplinas/${id}`)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: disc?.cor || "#6B7280" }}
            >
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: disc?.cor || "#6B7280" }}
              >
                Videoaulas
              </h1>
              <p className="text-sm text-gray-600">
                Aprenda assistindo conteúdo em vídeo
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {tituloDisciplina} · {videos.length} vídeo
                {videos.length !== 1 ? "s" : ""} disponível
                {videos.length !== 1 ? "is" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de videoaulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="rounded-2xl bg-white border border-gray-200"
            >
              <CardContent className="p-5">
                <div className="space-y-4">
                  {/* Thumbnail do vídeo */}
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                      alt={video.titulo}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback para thumbnail padrão se não encontrar
                        e.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        <Play className="h-6 w-6 text-gray-800" />
                      </div>
                    </div>
                  </div>

                  {/* Informações do vídeo */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad}`}
                      >
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">{video.titulo}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {video.descricao}
                    </p>
                    <button
                      onClick={() =>
                        push(`/aluno/disciplinas/${id}/videoaulas/${video.id}`)
                      }
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Assistir Vídeo
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <Card className="rounded-2xl bg-white border border-gray-200">
            <CardContent className="p-8 text-center">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma videoaula disponível
              </h3>
              <p className="text-gray-600">
                As videoaulas aparecerão aqui conforme forem disponibilizadas.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AlunoLayout>
  );
}
