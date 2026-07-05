import { getProfessorLayout } from "@/components/professor/ProfessorLayout";
import type { NextPageWithLayout } from "@/pages/_app";
import { DesempenhoProfessor } from "@/components/professor/DesempenhoProfessor";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";

type PerformanceRow = {
  studentId: string;
  studentName: string;
  grades: { activity: string; grade: number; maxGrade: number; date: string }[];
  averageGrade: number;
  totalCoins: number;
  ranking: number;
  discipline: string;
  class: string;
};

function DesempenhoPage() {
  const router = useRouter();
  const [performanceData, setPerformanceData] = useState<PerformanceRow[]>([]);

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

  useEffect(() => {
    async function carregar() {
      try {
        const data = await api.get("/professor/desempenho");
        setPerformanceData(data ?? []);
      } catch (err) {
        console.error("Erro ao carregar desempenho:", err);
      }
    }

    carregar();
  }, []);


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
    <>
      <DesempenhoProfessor
        performanceData={performanceData}
        onExportReport={handleExportReport}
        onFilterChange={handleFilterChange}
      />
    </>
  );
}

(DesempenhoPage as NextPageWithLayout).getLayout = getProfessorLayout;

export default DesempenhoPage;
