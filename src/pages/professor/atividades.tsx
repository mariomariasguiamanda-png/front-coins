import { AtividadesProfessor } from "@/components/professor/AtividadesProfessor";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";

export default function AtividadesPage() {
  // Mock data - replace with API calls later
  const activities = [
    {
      id: "1",
      title: "Lista de Exercícios - Funções",
      description: "Resolver os exercícios 1 a 10 do capítulo 3",
      dueDate: "2023-10-15",
      coins: 10,
      status: "pendente" as const,
    },
    {
      id: "2",
      title: "Trabalho em Grupo - Geometria",
      description: "Apresentação sobre polígonos regulares",
      dueDate: "2023-10-20",
      coins: 15,
      status: "entregue" as const,
    },
  ];

  return (
    <ProfessorLayout>
      <AtividadesProfessor
        activities={activities}
        onCreateActivity={() => {}}
        onEditActivity={() => {}}
        onDeleteActivity={() => {}}
      />
    </ProfessorLayout>
  );
}