"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/Card";
import {
  disciplinas as mockDisciplinas,
  videoaulas as mockVideos,
} from "@/lib/mock/aluno";
import { Video } from "lucide-react";
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

export default function VideoaulasPage() {
  const { query, back, push } = useRouter();
  const id = String(query.id || "");
  const disc = mockDisciplinas.find((d) => d.id === id);
  const videos = useMemo(
    () => mockVideos.filter((v) => v.disciplinaId === id),
    [id]
  );

  // progresso salvo (0-100) por video em localStorage
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  useEffect(() => {
    const map: Record<string, number> = {};
    videos.forEach((v) => {
      const key = `videoProgress:${id}:${v.id}`;
      const saved = Number(localStorage.getItem(key) || "0");
      map[v.id] = isNaN(saved) ? 0 : Math.max(0, Math.min(100, saved));
    });
    setProgressMap(map);
    const onVis = () => {
      const m: Record<string, number> = {};
      videos.forEach((v) => {
        const key = `videoProgress:${id}:${v.id}`;
        const saved = Number(localStorage.getItem(key) || "0");
        m[v.id] = isNaN(saved) ? 0 : Math.max(0, Math.min(100, saved));
      });
      setProgressMap(m);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [id, videos]);

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const cor = disc?.cor || "#6B7280";
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });

  return (
    <div className="min-h-dvh bg-white text-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => back()}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} bg-opacity-10`}
            >
              <Video className={`h-5 w-5 ${tema.text}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Videoaulas</h1>
              <p className="text-sm text-gray-600">
                Precisa de ajuda? Assista à videoaula!
              </p>
              {disc && (
                <p className="text-xs text-gray-600 mt-1">
                  {tituloDisciplina} · Moedas: {disc.moedas} · Progresso:{" "}
                  {disc.progresso}%
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Estado vazio */}
        {videos.length === 0 ? (
          <div className="text-center py-16">
            <Video className="w-12 h-12 mx-auto text-gray-400" />
            <div className="text-gray-700 font-medium mt-2">
              Sem videoaulas.
            </div>
            <div className="text-sm text-gray-600">
              Quando os professores publicarem, aparecerão aqui.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => {
              const progress = progressMap[v.id] ?? 0;
              const isNovo = progress === 0; // destaque "Novo" se nunca assistiu
              return (
                <Card
                  key={v.id}
                  className="rounded-2xl bg-white border border-gray-200 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${v.youtubeId}`}
                        title={v.titulo}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-gray-900 leading-snug">
                            {v.titulo}
                          </div>
                          {v.descricao && (
                            <div className="text-xs text-gray-700">
                              {v.descricao}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            Complementa conteúdos de {tituloDisciplina}
                          </div>
                        </div>
                        {isNovo && (
                          <span
                            className={`text-[10px] uppercase rounded-full px-2 py-0.5 font-semibold ${tema.text} bg-gradient-to-br ${tema.grad} bg-opacity-10`}
                          >
                            Novo
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progresso</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${tema.bar}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                          onClick={() =>
                            push(`/disciplinas/${id}/videoaulas/${v.id}`)
                          }
                        >
                          Abrir
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
