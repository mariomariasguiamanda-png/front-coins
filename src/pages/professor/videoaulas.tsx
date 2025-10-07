import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { VideoaulasProfessor } from "@/components/professor/VideoaulasProfessor";

export default function VideoaulasPage() {
  // Mock data - replace with API calls later
  const lessons = [
    {
      id: "1",
      title: "Introdução à Trigonometria",
      description: "Nesta aula, vamos aprender os conceitos básicos de trigonometria, incluindo seno, cosseno e tangente no triângulo retângulo.",
      discipline: "Matemática",
      createdAt: "2023-10-01",
      views: 150,
      youtubeUrl: "https://youtube.com/watch?v=abc123",
      thumbnail: "/thumbnail-trigonometria.jpg",
    },
    {
      id: "2",
      title: "Termodinâmica - Parte 1",
      description: "Primeira aula sobre termodinâmica, abordando os conceitos de temperatura, calor e energia térmica.",
      discipline: "Física",
      createdAt: "2023-10-02",
      views: 98,
      youtubeUrl: "https://youtube.com/watch?v=def456",
      thumbnail: "/thumbnail-termodinamica.jpg",
    },
    {
      id: "3",
      title: "Balanceamento de Equações",
      description: "Aprenda a balancear equações químicas de forma simples e prática com exemplos do dia a dia.",
      discipline: "Química",
      createdAt: "2023-10-03",
      views: 75,
      youtubeUrl: "https://youtube.com/watch?v=ghi789",
      thumbnail: "/thumbnail-quimica.jpg",
    },
  ];

  return (
    <ProfessorLayout>
      <VideoaulasProfessor
        lessons={lessons}
        onCreateLesson={() => {}}
        onEditLesson={() => {}}
        onDeleteLesson={() => {}}
      />
    </ProfessorLayout>
  );
}