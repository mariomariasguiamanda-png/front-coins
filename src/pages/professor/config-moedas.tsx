import { ConfigMoedasProfessor } from "@/components/professor/ConfigMoedasProfessor";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";

export default function ConfigMoedasPage() {
  // Mock data - replace with API calls later
  const disciplinas = [
    {
      id: "1",
      nome: "Matemática",
      precoMoedas: 5,
      pontosDisponiveis: 150,
      cor: "azul",
      totalAlunos: 32,
      moedasCirculacao: 1240,
    },
    {
      id: "2",
      nome: "Física",
      precoMoedas: 8,
      pontosDisponiveis: 180,
      cor: "verde",
      totalAlunos: 28,
      moedasCirculacao: 980,
    },
    {
      id: "3",
      nome: "Química",
      precoMoedas: 6,
      pontosDisponiveis: 120,
      cor: "roxo",
      totalAlunos: 30,
      moedasCirculacao: 1150,
    },
    {
      id: "4",
      nome: "Biologia",
      precoMoedas: 7,
      pontosDisponiveis: 140,
      cor: "verde",
      totalAlunos: 29,
      moedasCirculacao: 1020,
    },
    {
      id: "5",
      nome: "História",
      precoMoedas: 5,
      pontosDisponiveis: 130,
      cor: "laranja",
      totalAlunos: 31,
      moedasCirculacao: 890,
    },
    {
      id: "6",
      nome: "Geografia",
      precoMoedas: 6,
      pontosDisponiveis: 110,
      cor: "amarelo",
      totalAlunos: 27,
      moedasCirculacao: 760,
    },
  ];

  const historico = [
    {
      id: "1",
      disciplina: "Matemática",
      alteracao: "Preço alterado de 4 para 5 moedas | Pontos de 120 para 150",
      usuario: "Prof. João Silva",
      data: "2024-02-15T14:30:00",
    },
    {
      id: "2",
      disciplina: "Física",
      alteracao: "Preço alterado de 6 para 8 moedas | Pontos de 150 para 180",
      usuario: "Prof. Maria Santos",
      data: "2024-02-14T10:15:00",
    },
    {
      id: "3",
      disciplina: "Química",
      alteracao: "Pontos alterados de 100 para 120",
      usuario: "Prof. Pedro Oliveira",
      data: "2024-02-12T16:45:00",
    },
    {
      id: "4",
      disciplina: "Biologia",
      alteracao: "Preço alterado de 5 para 7 moedas",
      usuario: "Profa. Ana Costa",
      data: "2024-02-10T09:20:00",
    },
    {
      id: "5",
      disciplina: "História",
      alteracao: "Pontos alterados de 110 para 130",
      usuario: "Prof. Carlos Ferreira",
      data: "2024-02-08T13:00:00",
    },
  ];

  return (
    <ProfessorLayout>
      <ConfigMoedasProfessor
        disciplinas={disciplinas}
        onUpdateConfig={() => {}}
        historico={historico}
      />
    </ProfessorLayout>
  );
}