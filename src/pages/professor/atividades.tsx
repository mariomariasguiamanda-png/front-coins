import { AtividadesProfessor } from "@/components/professor/AtividadesProfessor";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { useState } from "react";

export default function AtividadesPage() {
  // Mock data - replace with API calls later
  const [activities, setActivities] = useState([
    {
      id: "1",
      title: "Lista de Exercícios - Funções Quadráticas",
      description: "Resolver os exercícios 1 a 15 sobre funções quadráticas. Inclui análise de gráficos e aplicações práticas.",
      dueDate: "2024-11-15",
      coins: 15,
      status: "pendente" as const,
      submissions: 12,
      totalStudents: 30,
      discipline: "Matemática"
    },
    {
      id: "2",
      title: "Trabalho em Grupo - Geometria Espacial",
      description: "Apresentação em grupo sobre poliedros regulares com modelos físicos ou digitais.",
      dueDate: "2024-11-20",
      coins: 25,
      status: "entregue" as const,
      submissions: 28,
      totalStudents: 30,
      discipline: "Matemática"
    },
    {
      id: "3",
      title: "Prova - Trigonometria",
      description: "Avaliação sobre seno, cosseno, tangente e aplicações no triângulo retângulo.",
      dueDate: "2024-11-25",
      coins: 30,
      status: "corrigida" as const,
      submissions: 30,
      totalStudents: 30,
      discipline: "Matemática"
    },
    {
      id: "4",
      title: "Exercícios - Equações do 1º Grau",
      description: "Resolução de problemas contextualizados envolvendo equações lineares.",
      dueDate: "2024-11-10",
      coins: 10,
      status: "pendente" as const,
      submissions: 8,
      totalStudents: 30,
      discipline: "Matemática"
    },
    {
      id: "5",
      title: "Projeto Final - Estatística",
      description: "Coleta e análise de dados reais com apresentação de gráficos e conclusões.",
      dueDate: "2024-12-01",
      coins: 40,
      status: "pendente" as const,
      submissions: 3,
      totalStudents: 30,
      discipline: "Matemática"
    },
  ]);

  const handleCreateActivity = (activity: any) => {
    const newActivity = {
      ...activity,
      id: String(activities.length + 1),
      status: "pendente" as const,
      submissions: 0,
      totalStudents: 30,
    };
    setActivities([...activities, newActivity]);
  };

  const handleEditActivity = (id: string, updatedActivity: any) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, ...updatedActivity } : activity
    ));
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  return (
    <ProfessorLayout>
      <AtividadesProfessor
        activities={activities}
        onCreateActivity={handleCreateActivity}
        onEditActivity={handleEditActivity}
        onDeleteActivity={handleDeleteActivity}
      />
    </ProfessorLayout>
  );
}