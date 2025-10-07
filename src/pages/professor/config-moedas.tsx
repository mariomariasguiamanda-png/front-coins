import { ConfigMoedasProfessor } from "@/components/professor/ConfigMoedasProfessor";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";

export default function ConfigMoedasPage() {
  // Mock data - replace with API calls later
  const disciplinas = [
    {
      id: "1",
      nome: "Matemática",
      precoMoedas: 5,
      pontosDisponiveis: 100,
    },
    {
      id: "2",
      nome: "Física",
      precoMoedas: 8,
      pontosDisponiveis: 150,
    },
    {
      id: "3",
      nome: "Química",
      precoMoedas: 6,
      pontosDisponiveis: 120,
    },
  ];

  return (
    <ProfessorLayout>
      <ConfigMoedasProfessor
        disciplinas={disciplinas}
        onUpdateConfig={() => {}}
      />
    </ProfessorLayout>
  );
}