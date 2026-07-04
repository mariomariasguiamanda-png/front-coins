import { useState, useEffect, useCallback } from "react";

// 🔧 DEV: Instrumentação para diagnosticar loop de renderização
if (process.env.NODE_ENV !== "production") {
  console.log("[VideoProgress] Hook module loaded");
}

interface VideoProgressHook {
  progress: Record<string, number>;
  liveProgress: Record<string, number>;
  updateProgress: (videoId: string, progress: number) => void;
  updateLiveProgress: (videoId: string, progress: number) => void;
  saveProgress: (videoId: string, progress: number) => void;
}

export const useVideoProgress = (
  disciplinaId: string,
  videoIds: string[]
): VideoProgressHook => {
  // 🔧 DEV: Log chamada do hook
  if (process.env.NODE_ENV !== "production") {
    console.log("[VideoProgress] Hook called with:", {
      disciplinaId,
      videoIds: videoIds.length,
    });
  }

  const [progress, setProgress] = useState<Record<string, number>>({});
  const [liveProgress, setLiveProgress] = useState<Record<string, number>>({});

  // Carregar progresso salvo do localStorage
  useEffect(() => {
    // 🔧 DEV: Log execução do useEffect
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[VideoProgress] useEffect triggered - videoIds changed:",
        videoIds
      );
      console.time("videoProgress-useEffect");
    }

    const loadedProgress: Record<string, number> = {};
    const initialLiveProgress: Record<string, number> = {};

    videoIds.forEach((videoId) => {
      const key = `videoProgress:${disciplinaId}:${videoId}`;
      const saved = localStorage.getItem(key);
      loadedProgress[videoId] = saved ? parseInt(saved) : 0;
      initialLiveProgress[videoId] = 0;
    });

    // 🔧 DEV: Log setState calls
    if (process.env.NODE_ENV !== "production") {
      console.log("[VideoProgress] setProgress called with:", loadedProgress);
      console.log(
        "[VideoProgress] setLiveProgress called with:",
        initialLiveProgress
      );
    }

    setProgress(loadedProgress);
    setLiveProgress(initialLiveProgress);

    // 🔧 DEV: Log tempo de execução
    if (process.env.NODE_ENV !== "production") {
      console.timeEnd("videoProgress-useEffect");
    }
  }, [disciplinaId, videoIds]);

  // Atualizar progresso em tempo real (sem salvar)
  const updateLiveProgress = useCallback(
    (videoId: string, newProgress: number) => {
      // 🔧 DEV: Log update live progress
      if (process.env.NODE_ENV !== "production") {
        console.log("[VideoProgress] updateLiveProgress called:", {
          videoId,
          newProgress,
        });
      }

      setLiveProgress((prev) => ({
        ...prev,
        [videoId]: Math.min(100, Math.max(0, newProgress)),
      }));
    },
    []
  );

  // Atualizar progresso salvo
  const updateProgress = useCallback((videoId: string, newProgress: number) => {
    const clampedProgress = Math.min(100, Math.max(0, newProgress));
    setProgress((prev) => ({
      ...prev,
      [videoId]: clampedProgress,
    }));
  }, []);

  // Salvar progresso no localStorage
  const saveProgress = useCallback(
    (videoId: string, newProgress: number) => {
      // 🔧 DEV: Log save progress
      if (process.env.NODE_ENV !== "production") {
        console.log("[VideoProgress] saveProgress called:", {
          videoId,
          newProgress,
        });
      }

      const clampedProgress = Math.min(100, Math.max(0, newProgress));
      const key = `videoProgress:${disciplinaId}:${videoId}`;
      localStorage.setItem(key, clampedProgress.toString());
      updateProgress(videoId, clampedProgress);
    },
    [disciplinaId, updateProgress]
  );

  return {
    progress,
    liveProgress,
    updateProgress,
    updateLiveProgress,
    saveProgress,
  };
};
