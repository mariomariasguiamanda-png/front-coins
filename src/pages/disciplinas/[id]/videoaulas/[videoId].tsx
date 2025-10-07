"use client";

import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  videoaulas as mockVideos,
} from "@/lib/mock/aluno";
import { ArrowLeft, Play } from "lucide-react";
import { resolverTema } from "@/modules/aluno/tema";

export default function VideoaulaDetalhePage() {
  const { query, back } = useRouter();
  const id = String(query.id || "");
  const videoId = String(query.videoId || "");

  const disc = mockDisciplinas.find((d) => d.id === id);
  const video = mockVideos.find(
    (v) => v.id === videoId && v.disciplinaId === id
  );
  const cor = disc?.cor || "#6B7280";
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });
  const [progress, setProgress] = useState(40); // mock de progresso salvo

  const grad = useMemo(() => {
    const darken = (hex: string, amt = 30) => {
      const h = hex.replace("#", "");
      if (h.length !== 6) return hex;
      const num = parseInt(h, 16);
      let r = (num >> 16) & 0xff;
      let g = (num >> 8) & 0xff;
      let b = num & 0xff;
      r = Math.max(0, r - amt);
      g = Math.max(0, g - amt);
      b = Math.max(0, b - amt);
      const toHex = (v: number) => v.toString(16).padStart(2, "0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };
    return `linear-gradient(90deg, ${cor}, ${darken(cor)})`;
  }, [cor]);

  // Salvar progresso no localStorage e permitir que a lista reflita a mudança
  useEffect(() => {
    if (!id || !videoId) return;
    const key = `videoProgress:${id}:${videoId}`;
    localStorage.setItem(key, String(progress));
  }, [id, videoId, progress]);

  if (!video) {
    return (
      <div className="min-h-dvh grid place-items-center bg-white text-black p-6">
        Videoaula não encontrada.
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white text-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => back()}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
            >
              <Play className={`h-5 w-5 ${tema.text}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${tema.text}`}>
                {video.titulo}
              </h1>
              {disc && <p className="text-sm text-gray-600">{disc.nome}</p>}
            </div>
          </div>
        </div>

        <Card className="border border-gray-200 rounded-2xl">
          <CardContent className="p-0">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 rounded-2xl">
          <CardContent className="p-6 space-y-3">
            <div className="text-sm text-gray-700">{video.descricao}</div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Progresso do vídeo</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${tema.bar}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                onClick={() => setProgress(Math.max(0, progress - 10))}
              >
                -10%
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-white text-sm ${tema.bar} hover:opacity-90`}
                onClick={() => setProgress(Math.min(100, progress + 10))}
              >
                +10%
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
