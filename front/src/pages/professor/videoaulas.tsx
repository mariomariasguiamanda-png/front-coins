import { useEffect, useState } from "react";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { VideoaulasProfessor } from "@/components/professor/VideoaulasProfessor";
import { api } from "@/lib/api";

type StudentView = {
  id: number;
  name: string;
  watchedAt: string | null;
  completed: boolean;
  progress: number;
  timeWatchedSegundos: number;
};

type VideoLesson = {
  id: string;
  title: string;
  description: string;
  youtubeUrl?: string;
  discipline: string;
  id_disciplina: string;
  createdAt: string;
  views: number;
  durationSegundos: number;
  coins: number;
  studentsWatched: StudentView[];
};

type DisciplinaOption = { id: string; nome: string };

export default function VideoaulasPage() {
  const [lessons, setLessons] = useState<VideoLesson[]>([]);
  const [disciplinas, setDisciplinas] = useState<DisciplinaOption[]>([]);

  const carregarVideoaulas = async () => {
    try {
      const data = await api.get("/professor/videoaulas");
      setLessons(
        (data ?? []).map((v: any) => ({
          id: String(v.id_videoaula),
          title: v.titulo,
          description: v.descricao ?? "",
          youtubeUrl: v.url_video ?? undefined,
          discipline: v.disciplinas?.nome ?? "",
          id_disciplina: String(v.id_disciplina),
          createdAt: v.data_criacao,
          views: v.views,
          durationSegundos: v.duracao_segundos ?? 0,
          coins: v.recompensa_moedas ?? 0,
          studentsWatched: v.studentsWatched ?? [],
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar videoaulas:", err);
    }
  };

  useEffect(() => {
    carregarVideoaulas();
    async function carregarDisciplinas() {
      try {
        const data = await api.get("/professor/disciplinas");
        setDisciplinas((data ?? []).map((d: any) => ({ id: String(d.id_disciplina), nome: d.nome })));
      } catch (err) {
        console.error("Erro ao carregar disciplinas:", err);
      }
    }
    carregarDisciplinas();
  }, []);

  const handleCreateLesson = async (dados: {
    titulo: string;
    descricao: string;
    id_disciplina: string;
    url_video?: string;
    duracao_segundos?: number;
    recompensa_moedas?: number;
  }) => {
    await api.post("/professor/videoaulas", dados);
    await carregarVideoaulas();
  };

  const handleEditLesson = async (
    id: string,
    dados: {
      titulo: string;
      descricao: string;
      url_video?: string;
      duracao_segundos?: number;
      recompensa_moedas?: number;
    }
  ) => {
    await api.patch(`/professor/videoaulas/${id}`, dados);
    await carregarVideoaulas();
  };

  const handleDeleteLesson = async (id: string) => {
    await api.delete(`/professor/videoaulas/${id}`);
    await carregarVideoaulas();
  };

  return (
    <ProfessorLayout>
      <VideoaulasProfessor
        lessons={lessons}
        disciplinas={disciplinas}
        onCreateLesson={handleCreateLesson}
        onEditLesson={handleEditLesson}
        onDeleteLesson={handleDeleteLesson}
      />
    </ProfessorLayout>
  );
}
