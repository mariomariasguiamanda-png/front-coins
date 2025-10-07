"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { DisciplinaBackButton } from "@/components/ui/DisciplinaBackButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useVideoProgress } from "@/hooks/useVideoProgress";

// 🔧 DEV: Instrumentação para diagnosticar loop de renderização
if (process.env.NODE_ENV !== "production") {
  console.log("[Videoaulas] Component module loaded");
}

// Tipos para os dados
interface Videoaula {
  id: string;
  disciplina: string;
  titulo: string;
  descricao: string;
  videoId: string; // YouTube video ID
  atividadeRelacionada: string;
}

// Mapeamento de cores e gradientes por disciplina
const coresDisciplinas = {
  mat: {
    nome: "Matemática",
    cor: "#3B82F6",
    gradiente: "from-blue-500 to-blue-600",
  },
  hist: {
    nome: "História",
    cor: "#F97316",
    gradiente: "from-orange-500 to-orange-600",
  },
  bio: {
    nome: "Biologia",
    cor: "#10B981",
    gradiente: "from-emerald-500 to-emerald-600",
  },
  fis: {
    nome: "Física",
    cor: "#8B5CF6",
    gradiente: "from-violet-500 to-violet-600",
  },
  geo: {
    nome: "Geografia",
    cor: "#14B8A6",
    gradiente: "from-teal-500 to-teal-600",
  },
  art: {
    nome: "Artes",
    cor: "#EC4899",
    gradiente: "from-pink-500 to-pink-600",
  },
  port: {
    nome: "Português",
    cor: "#22C55E",
    gradiente: "from-green-500 to-green-600",
  },
} as const;

// Dados mock das videoaulas
const videoaulasMock: Videoaula[] = [
  {
    id: "1",
    disciplina: "Matemática",
    titulo: "Funções do Primeiro Grau",
    descricao: "Explicação completa sobre funções lineares e seus gráficos",
    videoId: "dQw4w9WgXcQ", // ID de exemplo do YouTube
    atividadeRelacionada: "Revisão - Funções",
  },
  {
    id: "2",
    disciplina: "Matemática",
    titulo: "Teorema de Pitágoras",
    descricao: "Demonstração e aplicações práticas do teorema",
    videoId: "dQw4w9WgXcQ",
    atividadeRelacionada: "Geometria Plana - Lista 1",
  },
  {
    id: "3",
    disciplina: "História",
    titulo: "Revolução Industrial",
    descricao: "Transformações sociais e econômicas nos séculos XVIII-XIX",
    videoId: "dQw4w9WgXcQ",
    atividadeRelacionada: "Século XVIII - Transformações",
  },
  {
    id: "4",
    disciplina: "História",
    titulo: "Primeira Guerra Mundial",
    descricao: "Causas, desenvolvimento e consequências do conflito",
    videoId: "dQw4w9WgXcQ",
    atividadeRelacionada: "Conflitos do Século XX",
  },
  {
    id: "5",
    disciplina: "Biologia",
    titulo: "Divisão Celular",
    descricao: "Mitose e meiose: processos e diferenças",
    videoId: "dQw4w9WgXcQ",
    atividadeRelacionada: "Citologia - Processos",
  },
  {
    id: "6",
    disciplina: "Física",
    titulo: "Leis de Newton",
    descricao: "As três leis fundamentais da mecânica clássica",
    videoId: "dQw4w9WgXcQ",
    atividadeRelacionada: "Mecânica Clássica",
  },
  {
    id: "7",
    disciplina: "Geografia",
    titulo: "Relevo Brasileiro",
    descricao: "Características e formação do relevo no Brasil",
    videoId: "dQw4w9WgXcQ",
    atividadeRelacionada: "Geografia Física do Brasil",
  },
  {
    id: "8",
    disciplina: "Artes",
    titulo: "Renascimento Artístico",
    descricao: "Características e principais artistas do período",
    videoId: "dQw4w9WgXcQ",
    atividadeRelacionada: "História da Arte - Período Clássico",
  },
  {
    id: "9",
    disciplina: "Português",
    titulo: "Análise Sintática",
    descricao: "Como identificar e classificar termos da oração",
    videoId: "dQw4w9WgXcQ",
    atividadeRelacionada: "Gramática - Período Composto",
  },
];

export default function Videoaulas() {
  // 🔧 DEV: Log render do componente
  if (process.env.NODE_ENV !== "production") {
    console.log("[Videoaulas] Component rendering");
  }

  const router = useRouter();
  const { id } = router.query;
  const [isExiting, setIsExiting] = useState(false);

  // ✅ CORREÇÃO: Hooks sempre executados antes de qualquer return condicional

  // Valores seguros para usar nos hooks
  const safeId = typeof id === "string" ? id : "";
  const disciplinaInfo = safeId
    ? coresDisciplinas[safeId as keyof typeof coresDisciplinas]
    : null;

  // Filtrar videoaulas por disciplina de forma segura
  const videoaulas = disciplinaInfo
    ? videoaulasMock.filter(
        (video) =>
          video.disciplina.toLowerCase() === disciplinaInfo.nome.toLowerCase()
      )
    : [];

  // 🔧 DEV: Log videoaulas filtradas
  if (process.env.NODE_ENV !== "production") {
    console.log("[Videoaulas] Filtered videoaulas:", videoaulas.length);
    console.log(
      "[Videoaulas] VideoIds array:",
      videoaulas.map((v) => v.id)
    );
  }

  // Hook para gerenciar progresso dos vídeos - SEMPRE executado
  const { progress, liveProgress, updateLiveProgress, saveProgress } =
    useVideoProgress(
      safeId,
      videoaulas.map((v) => v.id) // ❌ PROBLEMA ORIGINAL: Array recriado a cada render!
    );

  // ✅ AGORA podemos fazer validações condicionais APÓS os hooks
  if (typeof id !== "string") {
    return <div>Carregando...</div>;
  }

  if (!disciplinaInfo) {
    return <div>Disciplina não encontrada</div>;
  }

  // Função aprimorada para voltar com animação
  const handleBack = () => {
    // 🔧 DEV: Log navegação
    if (process.env.NODE_ENV !== "production") {
      console.log("[Videoaulas] handleBack called - starting exit animation");
      console.time("videoaulas-navigation");
    }

    setIsExiting(true);
    setTimeout(() => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Videoaulas] Executing router.back()");
      }
      router.back();
    }, 300);
  };

  // Configurar listeners de progresso para vídeos do YouTube via postMessage
  useEffect(() => {
    // 🔧 DEV: Log setup do event listener
    if (process.env.NODE_ENV !== "production") {
      console.log("[Videoaulas] Setting up YouTube event listener");
      console.log("[Videoaulas] Dependencies changed:", {
        videoaulasLength: videoaulas.length,
        updateLiveProgressRef: !!updateLiveProgress,
        saveProgressRef: !!saveProgress,
      });
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;

      // 🔧 DEV: Log YouTube message
      if (process.env.NODE_ENV !== "production") {
        console.log("[YouTube] postMessage received:", event.data);
      }

      const data = event.data;
      if (data && data.info && data.info.videoId) {
        const youtubeVideoId = data.info.videoId;
        const currentTime = data.info.currentTime || 0;
        const duration = data.info.duration || 1;
        const progressPercent = Math.min(100, (currentTime / duration) * 100);

        // Encontrar o ID do vídeo correspondente nos nossos dados
        const matchingVideo = videoaulas.find(
          (v) => v.videoId === youtubeVideoId
        );
        if (matchingVideo) {
          // 🔧 DEV: Log progress update
          if (process.env.NODE_ENV !== "production") {
            console.log("[YouTube] Updating progress:", {
              videoId: matchingVideo.id,
              progress: progressPercent,
            });
          }

          updateLiveProgress(matchingVideo.id, progressPercent);

          // Salvar progresso periodicamente (a cada 5%)
          if (Math.floor(progressPercent) % 5 === 0) {
            saveProgress(matchingVideo.id, Math.floor(progressPercent));
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      // 🔧 DEV: Log cleanup
      if (process.env.NODE_ENV !== "production") {
        console.log("[Videoaulas] Cleaning up YouTube event listener");
      }
      window.removeEventListener("message", handleMessage);
    };
  }, [videoaulas, updateLiveProgress, saveProgress]); // ❌ PROBLEMA: Dependências instáveis!

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-10">
      <div
        className={`max-w-6xl mx-auto space-y-8 transition-all duration-300 ${
          isExiting
            ? "opacity-0 translate-x-[-10px]"
            : "opacity-100 translate-x-0"
        }`}
        style={{
          animation: isExiting ? "none" : "fadeInUp 0.4s ease-out",
        }}
      >
        {/* Botão de voltar */}
        <div className="flex items-center justify-between">
          <DisciplinaBackButton disciplinaInfo={disciplinaInfo} />
        </div>

        {/* Cabeçalho */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl text-white">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Videoaulas</h1>
              <p className="text-gray-600 text-sm">
                Precisa de ajuda? Assista à video-aula!
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Videoaulas */}
        {videoaulas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {videoaulas.map((video, index) => {
              const savedProgress = progress[video.id] || 0;
              const currentProgress = liveProgress[video.id];
              return (
                <div
                  key={video.id}
                  className="animate-card-enter hover:scale-[1.02] transition-all duration-300"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <Card className="rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {video.titulo}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {video.descricao}
                        </p>
                      </div>

                      {/* YouTube embed */}
                      <div className="aspect-video rounded-lg overflow-hidden shadow">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${
                            video.videoId
                          }?enablejsapi=1&origin=${
                            typeof window !== "undefined"
                              ? window.location.origin
                              : ""
                          }`}
                          title="Videoaula"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>

                      {/* Progresso */}
                      <ProgressBar
                        progress={savedProgress}
                        liveProgress={currentProgress}
                        label="Progresso"
                        showPercentage={true}
                        gradient="from-violet-500 to-violet-700"
                      />

                      {/* Atividade relacionada */}
                      <p className="text-xs text-gray-500 italic">
                        Complementa: {video.atividadeRelacionada}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : (
          /* Estado Vazio */
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <Video className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium">Sem videoaulas</p>
            <p className="text-sm text-gray-400">
              Quando os professores publicarem, aparecem aqui.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
