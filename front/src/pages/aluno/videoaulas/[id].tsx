"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { getAlunoLayout } from "@/components/aluno/AlunoLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { CheckCircle2, PlayCircle, Loader2, Sparkles } from "lucide-react";
import type { NextPageWithLayout } from "@/pages/_app";

type Videoaula = {
  id_videoaula: number;
  titulo: string;
  descricao?: string | null;
  url_video: string;
  id_disciplina: number;
  status: "pendente" | "assistida";
  percentual_assistido: number;
  recompensa_moedas: number | null;
};

// Detecta tipo do vídeo com base na URL
function getVideoType(url: string): "youtube" | "vimeo" | "file" | "other" {
  const lower = url.toLowerCase().trim();

  // YouTube (vários formatos)
  if (
    lower.includes("youtube.com/watch") ||
    lower.includes("youtube.com/embed") ||
    lower.includes("youtu.be/")
  ) {
    return "youtube";
  }

  // Vimeo
  if (lower.includes("vimeo.com/")) {
    return "vimeo";
  }

  // Arquivos de vídeo (mp4, webm, etc.)
  if (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".ogg") ||
    lower.includes("/storage/v1/object/") // supabase storage
  ) {
    return "file";
  }

  return "other";
}

// Extrai ID do YouTube de várias formas de URL
function extractYouTubeId(url: string): string | null {
  // Exemplos:
  // https://www.youtube.com/watch?v=ABC123
  // https://youtu.be/ABC123
  // https://www.youtube.com/embed/ABC123

  try {
    const u = new URL(url);

    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;

      const parts = u.pathname.split("/");
      const embedIndex = parts.indexOf("embed");
      if (embedIndex !== -1 && parts[embedIndex + 1]) {
        return parts[embedIndex + 1];
      }
    }

    if (u.hostname.includes("youtu.be")) {
      const parts = u.pathname.split("/");
      if (parts[1]) return parts[1];
    }
  } catch {
    // se não conseguir fazer parse, tenta algo bem simples
    const match = url.match(/v=([^&]+)/);
    if (match && match[1]) return match[1];
  }

  return null;
}

// Extrai ID básico do Vimeo
function extractVimeoId(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last && /^\d+$/.test(last)) return last;
  } catch {
    // fallback: regex simples
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) return match[1];
  }
  return null;
}

type VideoPlayerProps = {
  url: string;
  title: string;
  onComplete?: () => void; // chamado quando o vídeo chegar ao fim
};

const VideoPlayer = ({ url, title, onComplete }: VideoPlayerProps) => {
  const type = getVideoType(url);
  const videoTitle = title || "Videoaula";

  if (!url) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-sm text-gray-500">
        Nenhuma URL de vídeo foi informada para esta videoaula.
      </div>
    );
  }

  if (type === "youtube") {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return (
        <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-sm text-gray-500">
          Não foi possível carregar o vídeo do YouTube. Verifique a URL.
        </div>
      );
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title={videoTitle}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (type === "vimeo") {
    const videoId = extractVimeoId(url);
    if (!videoId) {
      return (
        <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-sm text-gray-500">
          Não foi possível carregar o vídeo do Vimeo. Verifique a URL.
        </div>
      );
    }

    const embedUrl = `https://player.vimeo.com/video/${videoId}`;

    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title={videoTitle}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (type === "file") {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const lastTimeRef = useRef(0);

    const handleTimeUpdate = () => {
      if (!videoRef.current) return;
      lastTimeRef.current = videoRef.current.currentTime;
    };

    const handleSeeking = () => {
      if (!videoRef.current) return;
      const current = videoRef.current.currentTime;
      if (current > lastTimeRef.current + 1) {
        videoRef.current.currentTime = lastTimeRef.current;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    };

    const togglePlay = () => {
      if (!videoRef.current) return;
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const p = videoRef.current.play();
        if (p && typeof p.then === "function") {
          p.then(() => setIsPlaying(true)).catch(() => {});
        } else {
          setIsPlaying(true);
        }
      }
    };

    return (
      <div className="space-y-3">
        <div className="w-full rounded-xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={url}
            className="w-full max-h-[70vh]"
            controls={false}
            onTimeUpdate={handleTimeUpdate}
            onSeeking={handleSeeking}
            onEnded={handleEnded}
          >
            Seu navegador não suporta a reprodução de vídeo.
          </video>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center gap-2 rounded-full bg-purple-600 text-white text-sm font-medium px-4 py-2 hover:bg-purple-700 transition-colors"
          >
            {isPlaying ? "Pausar" : "Reproduzir"}
          </button>

          <p className="text-xs text-gray-500">
            Para ganhar moedas, assista ao vídeo completo sem pular.
          </p>
        </div>
      </div>
    );
  }

  // Fallback: iframe genérico
  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
      <iframe
        src={url}
        title={videoTitle}
        className="w-full h-full"
        allowFullScreen
      />
    </div>
  );
};

const VideoaulaDetalhePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const [videoaula, setVideoaula] = useState<Videoaula | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Progresso da videoaula para o aluno logado (já vem achatado da API)
  const [statusVideo, setStatusVideo] = useState<"pendente" | "assistida">(
    "pendente"
  );
  const [percentualAssistido, setPercentualAssistido] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoaula = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const idNumber = Number(id);
        if (Number.isNaN(idNumber)) {
          throw new Error("ID de videoaula inválido.");
        }

        const data: Videoaula = await api.get(`/aluno/videoaulas/${idNumber}`);
        setVideoaula(data);
        setStatusVideo(data.status === "assistida" ? "assistida" : "pendente");
        setPercentualAssistido(data.percentual_assistido ?? 0);
      } catch (err: any) {
        setError(err.message ?? "Erro ao carregar a videoaula.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoaula();
  }, [id]);

  const handleVoltar = () => {
    router.back();
  };

  const handleMarcarAssistida = async () => {
    if (!videoaula || statusVideo === "assistida") return;

    try {
      setSaving(true);
      await api.patch(`/aluno/videoaulas/${videoaula.id_videoaula}/progresso`, {
        percentual_assistido: 100,
      });

      setStatusVideo("assistida");
      setPercentualAssistido(100);

      const recompensa = videoaula.recompensa_moedas ?? 0;
      setToastMessage(
        recompensa > 0 ? `+${recompensa} moedas adicionadas 🎉` : "Videoaula concluída! ✅"
      );

      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    } catch (err) {
      console.error("Erro ao salvar progresso de videoaula:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-8 py-6 max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-44 rounded-lg" />
          </div>
        </div>
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !videoaula) {
    return (
      <div className="px-8 py-6 space-y-4">
        <p className="text-sm text-red-500">
          {error || "Videoaula não encontrada."}
        </p>
        <button
          onClick={handleVoltar}
          className="inline-flex items-center rounded-lg bg-purple-600 text-white text-sm font-medium px-4 py-2 hover:bg-purple-700 transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  const videoType = getVideoType(videoaula.url_video);
  const isFileVideo = videoType === "file";

  return (
    <>
      {/* Toast de moedas */}
      {toastMessage && (
        <div className="fixed right-6 top-20 z-40">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{toastMessage}</span>
              <span className="text-[11px] text-white/80">
                Seu saldo será atualizado no dashboard da disciplina.
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="px-8 py-6 max-w-5xl space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {videoaula.titulo}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Videoaula #{videoaula.id_videoaula}
            </p>
            <div className="mt-2 inline-flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium ${
                  statusVideo === "assistida"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {statusVideo === "assistida"
                  ? "Assistida"
                  : "Ainda não assistida"}
              </span>
              {percentualAssistido > 0 && (
                <span className="text-[11px] text-gray-500">
                  Progresso registrado: {Math.round(percentualAssistido)}%
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleVoltar}
              className="inline-flex items-center rounded-lg border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>

            {!isFileVideo && (
              <button
                type="button"
                onClick={handleMarcarAssistida}
                disabled={statusVideo === "assistida" || saving}
                className={`inline-flex items-center gap-2 rounded-lg text-sm font-medium px-4 py-2 transition-colors ${
                  statusVideo === "assistida"
                    ? "bg-emerald-50 text-emerald-700 cursor-default"
                    : "bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
                }`}
              >
                {statusVideo === "assistida" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Assistida
                  </>
                ) : saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    Marcar como assistida
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Player */}
        <VideoPlayer
          url={videoaula.url_video}
          title={videoaula.titulo}
          onComplete={handleMarcarAssistida}
        />

        {/* Descrição */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-800">
            Sobre esta videoaula
          </h2>
          {videoaula.descricao ? (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {videoaula.descricao}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Nenhuma descrição adicional foi cadastrada para esta videoaula.
            </p>
          )}
          <p className="text-[11px] text-gray-400 mt-1">
            Dica: assista até o final para garantir o registro de progresso
            {(videoaula.recompensa_moedas ?? 0) > 0 ? " e receber suas moedas." : "."}
          </p>
        </div>

        {/* Progresso e recompensas */}
        <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-800">
            Progresso e recompensas
          </h2>
          {(videoaula.recompensa_moedas ?? 0) > 0 ? (
            <>
              <p className="text-sm text-gray-500">
                Esta videoaula vale{" "}
                <span className="font-semibold text-purple-700">
                  {videoaula.recompensa_moedas} moeda{videoaula.recompensa_moedas === 1 ? "" : "s"}
                </span>
                . Ao assistir pelo menos 90% do vídeo, seu progresso é registrado
                automaticamente e as moedas são creditadas no seu saldo da disciplina.
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Dica: assista até o final sem pular trechos para garantir que o
                sistema reconheça a conclusão e libere as moedas corretamente.
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Esta videoaula não vale moedas. Seu progresso ainda é registrado
              automaticamente ao assistir.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

VideoaulaDetalhePage.getLayout = getAlunoLayout;

export default VideoaulaDetalhePage;
