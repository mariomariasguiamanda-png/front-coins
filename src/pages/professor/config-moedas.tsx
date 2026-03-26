import { ConfigMoedasProfessor } from "@/components/professor/ConfigMoedasProfessor";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { useState } from "react";

export default function ConfigMoedasPage() {
  // Mock data - replace with API calls later
  const [disciplinas, setDisciplinas] = useState([
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
  ]);

  const handleUpdateConfig = (disciplinaId: string, precoMoedas: number, pontosDisponiveis: number) => {
    setDisciplinas((prev) =>
      prev.map((disciplina) =>
        disciplina.id === disciplinaId
          ? { ...disciplina, precoMoedas, pontosDisponiveis }
          : disciplina
      )
    );
  };

  return (
    <ProfessorLayout>
      <ConfigMoedasProfessor
        disciplinas={disciplinas}
        onUpdateConfig={handleUpdateConfig}
      />
    </ProfessorLayout>
  );
}