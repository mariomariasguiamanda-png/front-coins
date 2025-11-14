import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { NotasProfessor } from "@/components/professor/NotasProfessor";
import { useState } from "react";

export default function NotasPage() {
  // Mock data - replace with API calls later
  const [grades, setGrades] = useState([
    {
      id: "1",
      studentName: "João Silva",
      studentId: "2024001",
      activity: "Prova 1 - Funções",
      grade: 8.5,
      maxGrade: 10,
      date: "2024-02-10",
      discipline: "Matemática",
      class: "1º A",
    },
    {
      id: "2",
      studentName: "Maria Santos",
      studentId: "2024002",
      activity: "Trabalho em Grupo",
      grade: 9.5,
      maxGrade: 10,
      date: "2024-02-08",
      discipline: "Física",
      class: "2º B",
    },
    {
      id: "3",
      studentName: "Pedro Oliveira",
      studentId: "2024003",
      activity: "Lista de Exercícios",
      grade: 7.0,
      maxGrade: 10,
      date: "2024-02-12",
      discipline: "Química",
      class: "3º C",
    },
    {
      id: "4",
      studentName: "Ana Costa",
      studentId: "2024004",
      activity: "Prova 2 - Termodinâmica",
      grade: 6.5,
      maxGrade: 10,
      date: "2024-02-11",
      discipline: "Física",
      class: "2º B",
    },
    {
      id: "5",
      studentName: "Carlos Ferreira",
      studentId: "2024005",
      activity: "Seminário - Verbos Irregulares",
      grade: 8.0,
      maxGrade: 10,
      date: "2024-02-09",
      discipline: "Inglês",
      class: "1º A",
    },
    {
      id: "6",
      studentName: "Beatriz Lima",
      studentId: "2024006",
      activity: "Prova 1 - Geometria",
      grade: 9.0,
      maxGrade: 10,
      date: "2024-02-14",
      discipline: "Matemática",
      class: "1º A",
    },
    {
      id: "7",
      studentName: "Rafael Souza",
      studentId: "2024007",
      activity: "Trabalho - Revolução Francesa",
      grade: 7.5,
      maxGrade: 10,
      date: "2024-02-13",
      discipline: "História",
      class: "3º C",
    },
    {
      id: "8",
      studentName: "Juliana Alves",
      studentId: "2024008",
      activity: "Prova - Fotossíntese",
      grade: 8.8,
      maxGrade: 10,
      date: "2024-02-15",
      discipline: "Biologia",
      class: "2º B",
    },
    {
      id: "9",
      studentName: "Lucas Mendes",
      studentId: "2024009",
      activity: "Lista - Equações Químicas",
      grade: 5.5,
      maxGrade: 10,
      date: "2024-02-10",
      discipline: "Química",
      class: "3º C",
    },
    {
      id: "10",
      studentName: "Fernanda Rocha",
      studentId: "2024010",
      activity: "Prova 1 - Literatura",
      grade: 9.2,
      maxGrade: 10,
      date: "2024-02-12",
      discipline: "Português",
      class: "1º A",
    },
    {
      id: "11",
      studentName: "Gabriel Torres",
      studentId: "2024011",
      activity: "Trabalho - Cinemática",
      grade: 7.8,
      maxGrade: 10,
      date: "2024-02-11",
      discipline: "Física",
      class: "2º B",
    },
    {
      id: "12",
      studentName: "Larissa Martins",
      studentId: "2024012",
      activity: "Prova 2 - Trigonometria",
      grade: 6.0,
      maxGrade: 10,
      date: "2024-02-14",
      discipline: "Matemática",
      class: "1º A",
    },
  ]);

  const handleAddGrade = (grade: any) => {
    const newGrade = {
      ...grade,
      id: String(grades.length + 1),
    };
    setGrades([...grades, newGrade]);
  };

  const handleEditGrade = (id: string, updatedGrade: any) => {
    setGrades(grades.map((grade: any) => 
      grade.id === id ? { ...grade, ...updatedGrade } : grade
    ));
  };

  const handleDeleteGrade = (id: string) => {
    setGrades(grades.filter((grade: any) => grade.id !== id));
  };

  const handleExportGrades = () => {
    // Criar CSV
    const headers = ["Aluno", "Matrícula", "Disciplina", "Turma", "Atividade", "Nota", "Data"];
    const csvContent = [
      headers.join(","),
      ...grades.map((grade: any) => 
        [
          `"${grade.studentName}"`,
          grade.studentId,
          `"${grade.discipline}"`,
          `"${grade.class}"`,
          `"${grade.activity}"`,
          grade.grade,
          grade.date
        ].join(",")
      )
    ].join("\n");

    // Download do arquivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `historico_notas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportGrades = (importedGrades: any[]) => {
    const newGrades = importedGrades.map((grade, index) => ({
      ...grade,
      id: String(grades.length + index + 1),
    }));
    setGrades([...grades, ...newGrades]);
  };

  return (
    <ProfessorLayout>
      <NotasProfessor
        grades={grades}
        onAddGrade={handleAddGrade}
        onEditGrade={handleEditGrade}
        onDeleteGrade={handleDeleteGrade}
        onExportGrades={handleExportGrades}
        onImportGrades={handleImportGrades}
      />
    </ProfessorLayout>
  );
}