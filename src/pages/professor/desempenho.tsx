import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { DesempenhoProfessor } from "@/components/professor/DesempenhoProfessor";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DesempenhoPage() {
  const router = useRouter();

  useEffect(() => {
    // Aguardar o router estar pronto
    if (!router.isReady) return;
    
    // Verificar se há hash na URL
    const hash = window.location.hash.replace('#', '');
    console.log('Hash detectado:', hash);
    
    if (hash) {
      // Aguardar a renderização completa
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(hash);
        console.log('Elemento encontrado:', element);
        
        if (element) {
          // Scrollar diretamente para o elemento
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
          
          // Ajustar posição após o scroll
          setTimeout(() => {
            window.scrollBy({ top: -80, behavior: 'smooth' });
          }, 100);
        } else {
          console.error('Elemento não encontrado com ID:', hash);
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [router.isReady, router.asPath]);

  // Mock data - replace with API calls later
  const performanceData = [
    {
      studentId: "2024001",
      studentName: "João Silva",
      grades: [
        { activity: "Prova 1", grade: 9.5, maxGrade: 10, date: "2024-02-10" },
        { activity: "Trabalho", grade: 9.0, maxGrade: 10, date: "2024-02-08" },
        { activity: "Lista", grade: 8.5, maxGrade: 10, date: "2024-02-05" },
      ],
      averageGrade: 9.0,
      totalCoins: 520,
      ranking: 1,
      discipline: "Matemática",
      class: "1º A",
      trend: "up" as const,
      attendance: 98,
    },
    {
      studentId: "2024002",
      studentName: "Maria Santos",
      grades: [
        { activity: "Prova 1", grade: 8.5, maxGrade: 10, date: "2024-02-10" },
        { activity: "Trabalho", grade: 9.0, maxGrade: 10, date: "2024-02-08" },
      ],
      averageGrade: 8.75,
      totalCoins: 485,
      ranking: 2,
      discipline: "Matemática",
      class: "1º A",
      trend: "up" as const,
      attendance: 95,
    },
    {
      studentId: "2024003",
      studentName: "Pedro Oliveira",
      grades: [
        { activity: "Prova 1", grade: 8.0, maxGrade: 10, date: "2024-02-10" },
        { activity: "Trabalho", grade: 8.5, maxGrade: 10, date: "2024-02-08" },
      ],
      averageGrade: 8.25,
      totalCoins: 420,
      ranking: 3,
      discipline: "Matemática",
      class: "1º A",
      trend: "stable" as const,
      attendance: 92,
    },
    {
      studentId: "2024004",
      studentName: "Ana Costa",
      grades: [
        { activity: "Prova 1", grade: 7.5, maxGrade: 10, date: "2024-02-11" },
        { activity: "Trabalho", grade: 8.0, maxGrade: 10, date: "2024-02-09" },
      ],
      averageGrade: 7.75,
      totalCoins: 380,
      ranking: 4,
      discipline: "Física",
      class: "2º B",
      trend: "up" as const,
      attendance: 90,
    },
    {
      studentId: "2024005",
      studentName: "Carlos Ferreira",
      grades: [
        { activity: "Prova 1", grade: 7.0, maxGrade: 10, date: "2024-02-12" },
        { activity: "Lista", grade: 7.5, maxGrade: 10, date: "2024-02-10" },
      ],
      averageGrade: 7.25,
      totalCoins: 345,
      ranking: 5,
      discipline: "Química",
      class: "3º C",
      trend: "stable" as const,
      attendance: 88,
    },
    {
      studentId: "2024006",
      studentName: "Beatriz Lima",
      grades: [
        { activity: "Prova 1", grade: 9.5, maxGrade: 10, date: "2024-02-14" },
        { activity: "Seminário", grade: 9.0, maxGrade: 10, date: "2024-02-12" },
      ],
      averageGrade: 9.25,
      totalCoins: 500,
      ranking: 6,
      discipline: "Biologia",
      class: "2º B",
      trend: "up" as const,
      attendance: 97,
    },
    {
      studentId: "2024007",
      studentName: "Rafael Souza",
      grades: [
        { activity: "Prova 1", grade: 6.5, maxGrade: 10, date: "2024-02-13" },
        { activity: "Trabalho", grade: 7.0, maxGrade: 10, date: "2024-02-11" },
      ],
      averageGrade: 6.75,
      totalCoins: 310,
      ranking: 7,
      discipline: "História",
      class: "3º C",
      trend: "down" as const,
      attendance: 85,
    },
    {
      studentId: "2024008",
      studentName: "Juliana Alves",
      grades: [
        { activity: "Prova 1", grade: 8.5, maxGrade: 10, date: "2024-02-15" },
        { activity: "Lista", grade: 8.0, maxGrade: 10, date: "2024-02-13" },
      ],
      averageGrade: 8.25,
      totalCoins: 410,
      ranking: 8,
      discipline: "Matemática",
      class: "1º A",
      trend: "stable" as const,
      attendance: 93,
    },
    {
      studentId: "2024009",
      studentName: "Lucas Mendes",
      grades: [
        { activity: "Prova 1", grade: 5.5, maxGrade: 10, date: "2024-02-10" },
        { activity: "Lista", grade: 6.0, maxGrade: 10, date: "2024-02-08" },
      ],
      averageGrade: 5.75,
      totalCoins: 260,
      ranking: 9,
      discipline: "Química",
      class: "3º C",
      trend: "down" as const,
      attendance: 80,
    },
    {
      studentId: "2024010",
      studentName: "Fernanda Rocha",
      grades: [
        { activity: "Prova 1", grade: 9.0, maxGrade: 10, date: "2024-02-12" },
        { activity: "Seminário", grade: 9.5, maxGrade: 10, date: "2024-02-10" },
      ],
      averageGrade: 9.25,
      totalCoins: 510,
      ranking: 10,
      discipline: "Português",
      class: "1º A",
      trend: "up" as const,
      attendance: 96,
    },
    {
      studentId: "2024011",
      studentName: "Gabriel Torres",
      grades: [
        { activity: "Prova 1", grade: 7.8, maxGrade: 10, date: "2024-02-11" },
        { activity: "Trabalho", grade: 8.2, maxGrade: 10, date: "2024-02-09" },
      ],
      averageGrade: 8.0,
      totalCoins: 390,
      ranking: 11,
      discipline: "Física",
      class: "2º B",
      trend: "up" as const,
      attendance: 91,
    },
    {
      studentId: "2024012",
      studentName: "Larissa Martins",
      grades: [
        { activity: "Prova 1", grade: 4.5, maxGrade: 10, date: "2024-02-14" },
        { activity: "Lista", grade: 5.0, maxGrade: 10, date: "2024-02-12" },
      ],
      averageGrade: 4.75,
      totalCoins: 220,
      ranking: 12,
      discipline: "Matemática",
      class: "1º A",
      trend: "down" as const,
      attendance: 78,
    },
  ];

  const handleExportReport = () => {
    // Criar CSV com relatório completo
    const headers = [
      "Matrícula",
      "Aluno",
      "Disciplina",
      "Turma",
      "Média Geral",
      "Moedas",
      "Ranking",
      "Tendência",
      "Frequência (%)",
      "Total de Atividades"
    ];
    
    const csvContent = [
      headers.join(","),
      ...performanceData.map(student => 
        [
          student.studentId,
          `"${student.studentName}"`,
          `"${student.discipline}"`,
          `"${student.class}"`,
          student.averageGrade.toFixed(2),
          student.totalCoins,
          student.ranking,
          student.trend === "up" ? "Crescente" : student.trend === "down" ? "Decrescente" : "Estável",
          student.attendance,
          student.grades.length
        ].join(",")
      )
    ].join("\n");

    // Download do arquivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_desempenho_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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