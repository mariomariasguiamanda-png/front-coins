import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { NotasProfessor } from "@/components/professor/NotasProfessor";

export default function NotasPage() {
  // Mock data - replace with API calls later
  const grades = [
    {
      id: "1",
      studentName: "João Silva",
      studentId: "2023001",
      activity: "Prova 1",
      grade: 8.5,
      maxGrade: 10,
      date: "2023-10-01",
      discipline: "Matemática",
      class: "1º A",
    },
    {
      id: "2",
      studentName: "Maria Santos",
      studentId: "2023002",
      activity: "Trabalho em Grupo",
      grade: 9.0,
      maxGrade: 10,
      date: "2023-10-02",
      discipline: "Física",
      class: "2º B",
    },
    {
      id: "3",
      studentName: "Pedro Oliveira",
      studentId: "2023003",
      activity: "Lista de Exercícios",
      grade: 7.5,
      maxGrade: 10,
      date: "2023-10-03",
      discipline: "Química",
      class: "3º C",
    },
  ];

  const handleExportGrades = () => {
    // Implement CSV export functionality
    console.log("Exporting grades...");
  };

  return (
    <ProfessorLayout>
      <NotasProfessor
        grades={grades}
        onAddGrade={() => {}}
        onEditGrade={() => {}}
        onDeleteGrade={() => {}}
        onExportGrades={handleExportGrades}
      />
    </ProfessorLayout>
  );
}