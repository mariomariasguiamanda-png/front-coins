import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { ResumosProfessor } from "@/components/professor/ResumosProfessor";

export default function ResumosPage() {
  // Mock data - replace with API calls later
  const summaries = [
    {
      id: "1",
      title: "Funções do 2º Grau - Conceitos Fundamentais",
      content: "Uma função do segundo grau, também chamada de função quadrática, é uma função polinomial de grau 2 que pode ser escrita na forma f(x) = ax² + bx + c, onde a, b e c são números reais e a ≠ 0...",
      discipline: "Matemática",
      createdAt: "2023-10-01",
      status: "approved" as const,
      attachments: ["resumo-funcoes.pdf", "exercicios.docx"],
    },
    {
      id: "2",
      title: "Leis de Newton - Resumo Completo",
      content: "As três leis de Newton são princípios fundamentais da física clássica que descrevem a relação entre as forças que atuam sobre um corpo e o movimento deste corpo...",
      discipline: "Física",
      createdAt: "2023-10-02",
      status: "pending" as const,
      attachments: ["leis-newton.pdf"],
      links: ["https://www.youtube.com/watch?v=abc123"],
    },
  ];

  return (
    <ProfessorLayout>
      <ResumosProfessor
        summaries={summaries}
        onCreateSummary={() => {}}
        onEditSummary={() => {}}
        onDeleteSummary={() => {}}
        onApproveSummary={() => {}}
        onRejectSummary={() => {}}
      />
    </ProfessorLayout>
  );
}