import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { DisciplinasProfessor } from "@/components/professor/DisciplinasProfessor";
import { useState } from "react";

// Mock data
const mockDisciplines = [
  {
    id: "1",
    name: "Matemática",
    code: "MAT301",
    description: "Estudo de álgebra linear, cálculo diferencial e integral",
    category: "Exatas",
    workload: 80,
    credits: 4,
    semester: "1º Semestre",
    classes: ["3º Ano A", "3º Ano B", "2º Ano A"],
    totalStudents: 105,
    averageGrade: 7.8,
    completionRate: 85,
    status: "active" as const,
  },
  {
    id: "2",
    name: "Física",
    code: "FIS201",
    description: "Mecânica clássica, termodinâmica e eletromagnetismo",
    category: "Exatas",
    workload: 60,
    credits: 3,
    semester: "1º Semestre",
    classes: ["3º Ano A", "3º Ano B"],
    totalStudents: 67,
    averageGrade: 7.5,
    completionRate: 80,
    status: "active" as const,
  },
  {
    id: "3",
    name: "Química",
    code: "QUI101",
    description: "Química orgânica e inorgânica, reações químicas",
    category: "Exatas",
    workload: 60,
    credits: 3,
    semester: "2º Semestre",
    classes: ["3º Ano A", "2º Ano A"],
    totalStudents: 73,
    averageGrade: 8.1,
    completionRate: 88,
    status: "active" as const,
  },
  {
    id: "4",
    name: "História",
    code: "HIS102",
    description: "História do Brasil e história geral",
    category: "Humanas",
    workload: 40,
    credits: 2,
    semester: "1º Semestre",
    classes: ["2º Ano A", "1º Ano C"],
    totalStudents: 66,
    averageGrade: 8.3,
    completionRate: 92,
    status: "active" as const,
  },
  {
    id: "5",
    name: "Biologia",
    code: "BIO201",
    description: "Biologia celular, genética e evolução",
    category: "Biológicas",
    workload: 60,
    credits: 3,
    semester: "2º Semestre",
    classes: ["3º Ano A"],
    totalStudents: 35,
    averageGrade: 8.5,
    completionRate: 90,
    status: "active" as const,
  },
  {
    id: "6",
    name: "Português",
    code: "POR101",
    description: "Gramática, literatura e redação",
    category: "Linguagens",
    workload: 80,
    credits: 4,
    semester: "1º Semestre",
    classes: ["1º Ano C"],
    totalStudents: 28,
    averageGrade: 7.9,
    completionRate: 86,
    status: "active" as const,
  },
  {
    id: "7",
    name: "Programação Web",
    code: "TEC301",
    description: "HTML, CSS, JavaScript e frameworks modernos",
    category: "Tecnologia",
    workload: 100,
    credits: 5,
    semester: "2º Semestre",
    classes: [],
    totalStudents: 0,
    averageGrade: 0,
    completionRate: 0,
    status: "inactive" as const,
  },
];

export default function DisciplinasPage() {
  const [disciplines, setDisciplines] = useState(mockDisciplines);

  const handleCreateDiscipline = (disciplineData: any) => {
    const newDiscipline = {
      ...disciplineData,
      id: Date.now().toString(),
    };
    setDisciplines([...disciplines, newDiscipline]);
    console.log("Disciplina criada:", newDiscipline);
  };

  const handleEditDiscipline = (id: string, disciplineData: any) => {
    setDisciplines(disciplines.map(disc => 
      disc.id === id ? { ...disc, ...disciplineData } : disc
    ));
    console.log("Disciplina editada:", id, disciplineData);
  };

  const handleDeleteDiscipline = (id: string) => {
    setDisciplines(disciplines.filter(disc => disc.id !== id));
    console.log("Disciplina deletada:", id);
  };

  return (
    <ProfessorLayout>
      <DisciplinasProfessor
        disciplines={disciplines}
        onCreateDiscipline={handleCreateDiscipline}
        onEditDiscipline={handleEditDiscipline}
        onDeleteDiscipline={handleDeleteDiscipline}
      />
    </ProfessorLayout>
  );
}
