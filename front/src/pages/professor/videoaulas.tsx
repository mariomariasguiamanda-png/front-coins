import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { VideoaulasProfessor } from "@/components/professor/VideoaulasProfessor";
import { useState } from "react";

export default function VideoaulasPage() {
  // Mock data - replace with API calls later
  const [lessons, setLessons] = useState([
    {
      id: "1",
      title: "Introdução à Trigonometria",
      description: "Nesta aula, vamos aprender os conceitos básicos de trigonometria, incluindo seno, cosseno e tangente no triângulo retângulo. Aprenda a resolver problemas práticos e entender aplicações no dia a dia.",
      discipline: "Matemática",
      createdAt: "2024-02-10",
      views: 324,
      likes: 45,
      duration: "18:24",
      youtubeUrl: "https://youtube.com/watch?v=abc123",
      thumbnail: "/thumbnail-trigonometria.jpg",
      status: "published" as const,
      studentsWatched: [
        {
          id: "1",
          name: "Ana Silva Santos",
          watchedAt: "2024-02-11T14:30:00",
          completed: true,
          progress: 100,
          timeWatched: "18:24"
        },
        {
          id: "2",
          name: "Carlos Eduardo Lima",
          watchedAt: "2024-02-11T15:45:00",
          completed: true,
          progress: 100,
          timeWatched: "18:24"
        },
        {
          id: "3",
          name: "Maria Fernanda Costa",
          watchedAt: "2024-02-12T10:20:00",
          completed: false,
          progress: 65,
          timeWatched: "12:00"
        },
        {
          id: "4",
          name: "João Pedro Alves",
          watchedAt: "2024-02-12T16:10:00",
          completed: true,
          progress: 100,
          timeWatched: "18:24"
        },
        {
          id: "5",
          name: "Beatriz Oliveira",
          watchedAt: "2024-02-13T09:30:00",
          completed: false,
          progress: 45,
          timeWatched: "08:15"
        },
        {
          id: "6",
          name: "Rafael Souza",
          watchedAt: "2024-02-13T14:00:00",
          completed: true,
          progress: 100,
          timeWatched: "18:24"
        },
        {
          id: "7",
          name: "Juliana Pereira",
          watchedAt: "2024-02-14T11:45:00",
          completed: false,
          progress: 80,
          timeWatched: "14:40"
        },
      ]
    },
    {
      id: "2",
      title: "Termodinâmica - Primeira Lei",
      description: "Primeira aula sobre termodinâmica, abordando os conceitos de temperatura, calor e energia térmica. Entenda a conservação de energia e suas aplicações em sistemas térmicos.",
      discipline: "Física",
      createdAt: "2024-02-08",
      views: 198,
      likes: 32,
      duration: "22:15",
      youtubeUrl: "https://youtube.com/watch?v=def456",
      thumbnail: "/thumbnail-termodinamica.jpg",
      status: "published" as const,
      studentsWatched: [
        {
          id: "1",
          name: "Pedro Henrique Rocha",
          watchedAt: "2024-02-09T13:20:00",
          completed: true,
          progress: 100,
          timeWatched: "22:15"
        },
        {
          id: "2",
          name: "Camila Rodrigues",
          watchedAt: "2024-02-09T15:00:00",
          completed: false,
          progress: 55,
          timeWatched: "12:15"
        },
        {
          id: "3",
          name: "Lucas Martins",
          watchedAt: "2024-02-10T10:30:00",
          completed: true,
          progress: 100,
          timeWatched: "22:15"
        },
        {
          id: "4",
          name: "Fernanda Almeida",
          watchedAt: "2024-02-10T14:45:00",
          completed: false,
          progress: 70,
          timeWatched: "15:30"
        },
      ]
    },
    {
      id: "3",
      title: "Balanceamento de Equações Químicas",
      description: "Aprenda a balancear equações químicas de forma simples e prática com exemplos do dia a dia. Método por tentativa e método redox explicados passo a passo.",
      discipline: "Química",
      createdAt: "2024-02-12",
      views: 156,
      likes: 28,
      duration: "15:40",
      youtubeUrl: "https://youtube.com/watch?v=ghi789",
      thumbnail: "/thumbnail-quimica.jpg",
      status: "published" as const,
      studentsWatched: [
        {
          id: "1",
          name: "Gabriel Santos",
          watchedAt: "2024-02-13T09:00:00",
          completed: true,
          progress: 100,
          timeWatched: "15:40"
        },
        {
          id: "2",
          name: "Amanda Costa",
          watchedAt: "2024-02-13T11:20:00",
          completed: true,
          progress: 100,
          timeWatched: "15:40"
        },
        {
          id: "3",
          name: "Thiago Lima",
          watchedAt: "2024-02-13T16:30:00",
          completed: false,
          progress: 40,
          timeWatched: "06:16"
        },
      ]
    },
    {
      id: "4",
      title: "Present Perfect - Estrutura e Uso",
      description: "Domine o uso do Present Perfect em inglês. Entenda quando usar, como formar frases e a diferença entre Present Perfect e Simple Past com exemplos práticos.",
      discipline: "Inglês",
      createdAt: "2024-02-14",
      views: 287,
      likes: 52,
      duration: "20:30",
      youtubeUrl: "https://youtube.com/watch?v=jkl012",
      thumbnail: "/thumbnail-ingles.jpg",
      status: "published" as const,
      studentsWatched: [
        {
          id: "1",
          name: "Isabella Ferreira",
          watchedAt: "2024-02-15T08:30:00",
          completed: true,
          progress: 100,
          timeWatched: "20:30"
        },
        {
          id: "2",
          name: "Matheus Cardoso",
          watchedAt: "2024-02-15T10:15:00",
          completed: true,
          progress: 100,
          timeWatched: "20:30"
        },
        {
          id: "3",
          name: "Laura Mendes",
          watchedAt: "2024-02-15T13:40:00",
          completed: false,
          progress: 60,
          timeWatched: "12:18"
        },
        {
          id: "4",
          name: "Daniel Barbosa",
          watchedAt: "2024-02-15T16:00:00",
          completed: true,
          progress: 100,
          timeWatched: "20:30"
        },
        {
          id: "5",
          name: "Sofia Ribeiro",
          watchedAt: "2024-02-16T09:20:00",
          completed: false,
          progress: 35,
          timeWatched: "07:10"
        },
      ]
    },
    {
      id: "5",
      title: "Revolução Industrial - Contexto Histórico",
      description: "Análise completa da Revolução Industrial iniciada na Inglaterra no século XVIII. Causas, consequências, inovações tecnológicas e impactos sociais e econômicos.",
      discipline: "História",
      createdAt: "2024-02-15",
      views: 112,
      likes: 18,
      duration: "25:12",
      youtubeUrl: "https://youtube.com/watch?v=mno345",
      status: "draft" as const,
      studentsWatched: []
    },
    {
      id: "6",
      title: "Fotossíntese e Respiração Celular",
      description: "Entenda os processos de fotossíntese nas plantas e respiração celular nos seres vivos. Ciclo do carbono, produção de energia e importância ecológica.",
      discipline: "Biologia",
      createdAt: "2024-02-11",
      views: 243,
      likes: 41,
      duration: "19:50",
      youtubeUrl: "https://youtube.com/watch?v=pqr678",
      thumbnail: "/thumbnail-biologia.jpg",
      status: "published" as const,
      studentsWatched: [
        {
          id: "1",
          name: "Ricardo Gomes",
          watchedAt: "2024-02-12T11:00:00",
          completed: true,
          progress: 100,
          timeWatched: "19:50"
        },
        {
          id: "2",
          name: "Patricia Santos",
          watchedAt: "2024-02-12T14:30:00",
          completed: true,
          progress: 100,
          timeWatched: "19:50"
        },
        {
          id: "3",
          name: "Bruno Silva",
          watchedAt: "2024-02-13T10:15:00",
          completed: false,
          progress: 75,
          timeWatched: "14:52"
        },
      ]
    },
    {
      id: "7",
      title: "Análise Sintática - Complementos Verbais",
      description: "Aprenda a identificar e classificar os complementos verbais: objeto direto, objeto indireto e predicativo. Exercícios práticos com análise de frases.",
      discipline: "Português",
      createdAt: "2024-02-09",
      views: 178,
      likes: 29,
      duration: "17:35",
      youtubeUrl: "https://youtube.com/watch?v=stu901",
      thumbnail: "/thumbnail-portugues.jpg",
      status: "published" as const,
      studentsWatched: [
        {
          id: "1",
          name: "Mariana Dias",
          watchedAt: "2024-02-10T09:30:00",
          completed: true,
          progress: 100,
          timeWatched: "17:35"
        },
        {
          id: "2",
          name: "Felipe Araújo",
          watchedAt: "2024-02-10T13:45:00",
          completed: false,
          progress: 50,
          timeWatched: "08:47"
        },
      ]
    },
    {
      id: "8",
      title: "Geometria Analítica - Distância entre Pontos",
      description: "Calcule distâncias entre pontos no plano cartesiano usando o teorema de Pitágoras. Aprenda a fórmula e resolva exercícios práticos de geometria analítica.",
      discipline: "Matemática",
      createdAt: "2024-02-13",
      views: 89,
      likes: 15,
      duration: "14:20",
      status: "scheduled" as const,
      studentsWatched: []
    },
  ]);

  const handleCreateLesson = (lesson: any) => {
    const newLesson = {
      ...lesson,
      id: String(lessons.length + 1),
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
    };
    setLessons([...lessons, newLesson]);
  };

  const handleEditLesson = (id: string, updatedLesson: any) => {
    setLessons(lessons.map((lesson: any) => 
      lesson.id === id ? { ...lesson, ...updatedLesson } : lesson
    ));
  };

  const handleDeleteLesson = (id: string) => {
    setLessons(lessons.filter((lesson: any) => lesson.id !== id));
  };

  return (
    <ProfessorLayout>
      <VideoaulasProfessor
        lessons={lessons}
        onCreateLesson={handleCreateLesson}
        onEditLesson={handleEditLesson}
        onDeleteLesson={handleDeleteLesson}
      />
    </ProfessorLayout>
  );
}