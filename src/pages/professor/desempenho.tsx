import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { DesempenhoProfessor } from "@/components/professor/DesempenhoProfessor";

export default function DesempenhoPage() {
  // Mock data - replace with API calls later
  const performanceData = [
    {
      studentId: "2023001",
      studentName: "João Silva",
      grades: [
        {
          activity: "Prova 1",
          grade: 8.5,
          maxGrade: 10,
          date: "2023-10-01",
        },
        {
          activity: "Trabalho",
          grade: 9.0,
          maxGrade: 10,
          date: "2023-10-02",
        },
      ],
      averageGrade: 8.75,
      totalCoins: 450,
      ranking: 1,
      discipline: "Matemática",
      class: "1º A",
    },
    {
      studentId: "2023002",
      studentName: "Maria Santos",
      grades: [
        {
          activity: "Prova 1",
          grade: 7.5,
          maxGrade: 10,
          date: "2023-10-01",
        },
        {
          activity: "Trabalho",
          grade: 8.5,
          maxGrade: 10,
          date: "2023-10-02",
        },
      ],
      averageGrade: 8.0,
      totalCoins: 380,
      ranking: 2,
      discipline: "Matemática",
      class: "1º A",
    },
    {
      studentId: "2023003",
      studentName: "Pedro Oliveira",
      grades: [
        {
          activity: "Prova 1",
          grade: 7.0,
          maxGrade: 10,
          date: "2023-10-01",
        },
        {
          activity: "Trabalho",
          grade: 8.0,
          maxGrade: 10,
          date: "2023-10-02",
        },
      ],
      averageGrade: 7.5,
      totalCoins: 320,
      ranking: 3,
      discipline: "Matemática",
      class: "1º A",
    },
  ];

  const handleExportReport = () => {
    // Implement report export functionality
    console.log("Exporting performance report...");
  };

  const handleFilterChange = (filters: any) => {
    // Implement filter functionality
    console.log("Filters changed:", filters);
  };

  return (
    <ProfessorLayout>
      <DesempenhoProfessor
        performanceData={performanceData}
        onExportReport={handleExportReport}
        onFilterChange={handleFilterChange}
      />
    </ProfessorLayout>
  );
}