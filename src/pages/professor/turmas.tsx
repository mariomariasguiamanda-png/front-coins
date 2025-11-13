import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { TurmasProfessor } from "@/components/professor/TurmasProfessor";
import { useState } from "react";

// Mock data
const mockClasses = [
  {
    id: "1",
    name: "3º Ano A",
    year: "2025",
    shift: "morning" as const,
    totalStudents: 35,
    activeStudents: 33,
    disciplines: ["Matemática", "Física", "Química", "Biologia"],
    averageGrade: 8.2,
    startDate: "2025-02-01",
    endDate: "2025-12-15",
  },
  {
    id: "2",
    name: "3º Ano B",
    year: "2025",
    shift: "afternoon" as const,
    totalStudents: 32,
    activeStudents: 30,
    disciplines: ["Matemática", "Física", "Química"],
    averageGrade: 7.8,
    startDate: "2025-02-01",
    endDate: "2025-12-15",
  },
  {
    id: "3",
    name: "2º Ano A",
    year: "2025",
    shift: "morning" as const,
    totalStudents: 38,
    activeStudents: 36,
    disciplines: ["Matemática", "História", "Geografia"],
    averageGrade: 7.5,
    startDate: "2025-02-01",
    endDate: "2025-12-15",
  },
  {
    id: "4",
    name: "1º Ano C",
    year: "2025",
    shift: "night" as const,
    totalStudents: 28,
    activeStudents: 25,
    disciplines: ["Português", "Matemática", "Inglês"],
    averageGrade: 7.2,
    startDate: "2025-02-01",
    endDate: "2025-12-15",
  },
];

export default function TurmasPage() {
  const [classes, setClasses] = useState(mockClasses);

  const handleCreateClass = (classData: any) => {
    const newClass = {
      ...classData,
      id: Date.now().toString(),
    };
    setClasses([...classes, newClass]);
    console.log("Turma criada:", newClass);
  };

  const handleEditClass = (id: string, classData: any) => {
    setClasses(classes.map(cls => 
      cls.id === id ? { ...cls, ...classData } : cls
    ));
    console.log("Turma editada:", id, classData);
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(cls => cls.id !== id));
    console.log("Turma deletada:", id);
  };

  return (
    <ProfessorLayout>
      <TurmasProfessor
        classes={classes}
        onCreateClass={handleCreateClass}
        onEditClass={handleEditClass}
        onDeleteClass={handleDeleteClass}
      />
    </ProfessorLayout>
  );
}
