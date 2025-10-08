"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  videoaulas as mockVideos,
} from "@/lib/mock/aluno";
import { ArrowLeft, Play, ExternalLink } from "lucide-react";
import { resolverTema } from "@/modules/aluno/tema";

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

export default function VideoaulaDetalhePage() {
  const { query, push } = useRouter();
  const id = String(query.id || "");
  const videoId = String(query.videoId || "");

  const [assistindo, setAssistindo] = useState(false);

  const disc = mockDisciplinas.find((d) => d.id === id);
  const video = mockVideos.find((v) => v.id === videoId);

  if (!video) {
    return (
      <AlunoLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Videoaula não encontrada
          </h2>
          <button
            onClick={() => push(`/aluno/disciplinas/${id}/videoaulas`)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voltar às Videoaulas
          </button>
        </div>
      </AlunoLayout>
    );
  }

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });

  return (
    <AlunoLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => push(`/aluno/disciplinas/${id}/videoaulas`)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
            >
              <Play className={`h-5 w-5 ${tema.text}`} />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: disc?.cor || "#6B7280" }}
              >
                {video.titulo}
              </h1>
              <p className="text-sm text-gray-600">{tituloDisciplina}</p>
            </div>
          </div>
        </div>

        {/* Player do vídeo */}
        <Card className="rounded-2xl bg-white border border-gray-200">
          <CardContent className="p-6">
            {assistindo ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                  title={video.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div
                className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setAssistindo(true)}
              >
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                  alt={video.titulo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-purple-600 rounded-full p-4 hover:bg-purple-700 transition">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-70 rounded-lg p-3">
                    <h3 className="text-white font-semibold">{video.titulo}</h3>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Descrição */}
        <Card className="rounded-2xl bg-white border border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Sobre esta videoaula</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {video.descricao}
            </p>

            {/* Ações */}
            <div className="flex flex-wrap gap-3">
              {!assistindo && (
                <button
                  onClick={() => setAssistindo(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Assistir Agora
                </button>
              )}

              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir no YouTube
              </a>

              <button
                onClick={() => push(`/aluno/disciplinas/${id}/videoaulas`)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Outras Videoaulas
              </button>

              <button
                onClick={() => push(`/aluno/disciplinas/${id}`)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Voltar à Disciplina
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card className="rounded-2xl bg-green-50 border border-green-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-800 mb-3">
              🎯 Dicas para Assistir
            </h3>
            <ul className="text-green-700 text-sm space-y-2">
              <li>• Faça anotações dos pontos principais</li>
              <li>• Pause quando necessário para processar o conteúdo</li>
              <li>• Revise os conceitos após assistir</li>
              <li>
                • Use a velocidade de reprodução que melhor se adequa ao seu
                ritmo
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AlunoLayout>
  );
}
