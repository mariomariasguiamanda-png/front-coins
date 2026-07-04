"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { CheckCircle2, PlayCircle, Loader2, Sparkles } from "lucide-react";

type Videoaula = {
  id_videoaula: number;
  titulo: string;
  descricao?: string | null;
  url: string;
  id_disciplina: number;
  created_at?: string;
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

const VideoaulaDetalhePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [videoaula, setVideoaula] = useState<Videoaula | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Progresso da videoaula para o aluno logado
  const [alunoId, setAlunoId] = useState<number | null>(null);
  const [statusVideo, setStatusVideo] = useState<"pendente" | "assistida">(
    "pendente"
  );
  const [percentualAssistido, setPercentualAssistido] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAlunoId = async (): Promise<number | null> => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.id) {
        console.warn("Nenhum usuário autenticado para progresso de videoaula.");
        return null;
      }

      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (usuarioError || !usuario) {
        console.warn("Usuário não encontrado na tabela usuarios.");
        return null;
      }

      const { data: aluno, error: alunoError } = await supabase
        .from("alunos")
        .select("id_aluno")
        .eq("id_usuario", usuario.id_usuario)
        .maybeSingle();

      if (alunoError || !aluno) {
        console.warn("Aluno não encontrado na tabela alunos.");
        return null;
      }

      return aluno.id_aluno as number;
    } catch (err) {
      console.error(
        "Erro ao buscar id_aluno para progresso de videoaula:",
        err
      );
      return null;
    }
  };

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

        // 1) Busca a própria vídeo-aula
        const { data, error } = await supabase
          .from("videoaulas")
          .select("*")
          .eq("id_videoaula", idNumber)
          .maybeSingle();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error("Videoaula não encontrada.");
        }

        setVideoaula(data as Videoaula);

        // 2) Descobre o aluno logado
        const alunoIdLocal = await fetchAlunoId();
        if (!alunoIdLocal) {
          return; // sem aluno, não tem como registrar progresso
        }
        setAlunoId(alunoIdLocal);

        // 3) Busca progresso dessa videoaula para esse aluno
        const { data: prog, error: progError } = await supabase
          .from("progresso_videoaulas")
          .select("status, percentual_assistido")
          .eq("id_videoaula", idNumber)
          .eq("id_aluno", alunoIdLocal)
          .maybeSingle();

        if (progError) {
          console.warn("Erro ao buscar progresso_videoaulas:", progError);
          return;
        }

        if (prog) {
          const status =
            prog.status === "assistida" ||
            (typeof prog.percentual_assistido === "number" &&
              prog.percentual_assistido >= 90)
              ? "assistida"
              : "pendente";

          setStatusVideo(status);
          setPercentualAssistido(
            typeof prog.percentual_assistido === "number"
              ? prog.percentual_assistido
              : 0
          );
        } else {
          setStatusVideo("pendente");
          setPercentualAssistido(0);
        }
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
    if (!videoaula || !alunoId || statusVideo === "assistida") return;

    try {
      setSaving(true);

      const { error } = await supabase.from("progresso_videoaulas").upsert(
        {
          id_videoaula: videoaula.id_videoaula,
          id_aluno: alunoId,
          status: "assistida",
          percentual_assistido: 100,
          assistido_em: new Date().toISOString(),
        },
        {
          onConflict: "id_videoaula,id_aluno",
        }
      );

      if (error) {
        console.error("Erro ao salvar progresso de videoaula:", error);
        return;
      }

      setStatusVideo("assistida");
      setPercentualAssistido(100);
      setToastMessage("+80 moedas adicionadas 🎉");

      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AlunoLayout>
        <div className="px-8 py-6 text-sm text-gray-600">
          Carregando videoaula...
        </div>
      </AlunoLayout>
    );
  }

  if (error || !videoaula) {
    return (
      <AlunoLayout>
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
      </AlunoLayout>
    );
  }

  const videoType = getVideoType(videoaula.url);
  const isFileVideo = videoType === "file";

  return (
    <AlunoLayout>
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
                disabled={!alunoId || statusVideo === "assistida" || saving}
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
          url={videoaula.url}
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
            Dica: assista até o final para garantir o registro de progresso e
            receber moedas em versões futuras da plataforma.
          </p>
        </div>

        {/* Progresso e recompensas */}
        <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-800">
            Progresso e recompensas
          </h2>
          <p className="text-sm text-gray-500">
            Ao finalizar esta videoaula, seu progresso é registrado
            automaticamente e as moedas correspondentes são adicionadas ao seu
            dashboard da disciplina.
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Dica: assista até o final sem pular trechos para garantir que o
            sistema reconheça a conclusão e libere as moedas corretamente.
          </p>
        </div>
      </div>
    </AlunoLayout>
  );
};

export default VideoaulaDetalhePage;
