import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { ResumosProfessor } from "@/components/professor/ResumosProfessor";
import { useState } from "react";

export default function ResumosPage() {
  // Mock data - replace with API calls later
  const [summaries, setSummaries] = useState([
    {
      id: "1",
      title: "Revisão - Funções do 2º Grau",
      content: "Este resumo cobre os principais conceitos de funções quadráticas, incluindo vértice, raízes, discriminante e gráficos. Inclui exemplos práticos e exercícios resolvidos passo a passo, além de aplicações em situações do cotidiano como cálculo de trajetórias.\n\nTópicos abordados:\n• Forma geral: f(x) = ax² + bx + c\n• Vértice da parábola: xv = -b/2a\n• Discriminante (Δ = b² - 4ac)\n• Concavidade e pontos de mínimo/máximo\n• Aplicações práticas em física e engenharia",
      discipline: "Matemática",
      createdAt: "2024-02-10",
      status: "approved" as const,
      attachments: ["funcoes-quadraticas.pdf", "exercicios-resolvidos.pdf"],
      views: 124,
      author: "Prof. Carlos Silva",
      date: "10/02/2024",
    },
    {
      id: "2",
      title: "Leis de Newton - Resumo Completo",
      content: "Resumo detalhado das três Leis de Newton com exemplos do cotidiano, diagramas de força e aplicações práticas. Aborda conceitos de inércia, força, ação e reação com ilustrações e experimentos demonstrativos.\n\n1ª Lei (Inércia): Um corpo permanece em repouso ou em movimento retilíneo uniforme a menos que uma força resultante atue sobre ele.\n\n2ª Lei (F = m.a): A força resultante sobre um corpo é igual ao produto de sua massa pela aceleração adquirida.\n\n3ª Lei (Ação e Reação): Para toda ação existe uma reação de mesma intensidade, mesma direção e sentido oposto.",
      discipline: "Física",
      createdAt: "2024-02-08",
      status: "pending" as const,
      attachments: ["newton-leis.pdf"],
      links: ["https://www.youtube.com/exemplo", "https://pt.khanacademy.org/newton"],
      views: 87,
      author: "Prof. Ana Costa",
      date: "08/02/2024",
    },
    {
      id: "3",
      title: "Verbos Irregulares em Inglês",
      content: "Lista completa dos 100 verbos irregulares mais utilizados no inglês, com conjugações no passado simples e particípio, exemplos de uso em frases contextualizadas e dicas de memorização através de grupos semânticos.\n\nExemplos principais:\n• be - was/were - been (ser/estar)\n• go - went - gone (ir)\n• have - had - had (ter)\n• do - did - done (fazer)\n• make - made - made (fazer/criar)\n\nDicas de estudo:\n1. Agrupe verbos com padrões similares\n2. Crie frases com contexto\n3. Pratique diariamente com exercícios\n4. Use flashcards para memorização",
      discipline: "Inglês",
      createdAt: "2024-02-05",
      status: "approved" as const,
      attachments: ["verbos-irregulares-lista.pdf", "audio-pronuncias.zip"],
      links: ["https://www.englishpage.com/irregularverbs"],
      views: 156,
      author: "Prof. Maria Santos",
      date: "05/02/2024",
    },
    {
      id: "4",
      title: "Ciclo do Carbono e Efeito Estufa",
      content: "Resumo sobre o ciclo do carbono na natureza, processos de fotossíntese e respiração celular, impactos do efeito estufa nas mudanças climáticas e soluções sustentáveis para redução de emissões.\n\nProcessos do Ciclo:\n• Fotossíntese: CO2 + H2O → C6H12O6 + O2\n• Respiração: C6H12O6 + O2 → CO2 + H2O + energia\n• Decomposição de matéria orgânica\n• Combustão de combustíveis fósseis\n\nImpactos ambientais:\n- Aquecimento global\n- Derretimento de geleiras\n- Eventos climáticos extremos\n- Acidificação dos oceanos",
      discipline: "Biologia",
      createdAt: "2024-02-12",
      status: "rejected" as const,
      views: 43,
      author: "Prof. João Oliveira",
      date: "12/02/2024",
    },
    {
      id: "5",
      title: "Revolução Francesa - Contexto Histórico",
      content: "Análise completa da Revolução Francesa de 1789, causas sociais e econômicas, principais fases (Estados Gerais, Assembleia Nacional, Terror, Diretório), personagens históricos como Robespierre e Napoleão, e consequências para a Europa moderna.\n\nCausas:\n• Crise econômica e financeira\n• Desigualdade social (3 estados)\n• Influência do Iluminismo\n• Má administração de Luís XVI\n\nFases principais:\n1. Estados Gerais (1789)\n2. Assembleia Nacional Constituinte\n3. Convenção Nacional\n4. Período do Terror\n5. Diretório\n6. Consulado e Império Napoleônico\n\nConsequências:\n- Fim do absolutismo na França\n- Declaração dos Direitos do Homem\n- Ascensão da burguesia\n- Influência em movimentos libertários",
      discipline: "História",
      createdAt: "2024-02-14",
      status: "pending" as const,
      attachments: ["rev-francesa-linha-tempo.pdf"],
      views: 91,
      author: "Prof. Fernanda Lima",
      date: "14/02/2024",
    },
    {
      id: "6",
      title: "Equações Químicas e Balanceamento",
      content: "Guia prático sobre equações químicas, técnicas de balanceamento por tentativa e método redox, cálculos estequiométricos, leis de Lavoisier e Proust com exemplos de reações do cotidiano.\n\nPrincípios fundamentais:\n• Lei de Lavoisier: conservação da massa\n• Lei de Proust: proporções definidas\n\nTécnicas de balanceamento:\n1. Método das tentativas\n2. Método redox (oxidorredução)\n3. Método algébrico\n\nExemplos práticos:\nH2 + O2 → H2O (não balanceada)\n2H2 + O2 → 2H2O (balanceada)\n\nCálculos estequiométricos:\n- Relação massa-massa\n- Relação massa-volume\n- Reagente limitante e em excesso",
      discipline: "Química",
      createdAt: "2024-02-11",
      status: "approved" as const,
      attachments: ["equacoes-quimicas.pdf", "tabela-periodica.pdf"],
      links: ["https://www.tabelaperiodica.org"],
      views: 102,
      author: "Prof. Roberto Alves",
      date: "11/02/2024",
    },
  ]);

  const handleCreateSummary = (summary: any) => {
    const newSummary = {
      ...summary,
      id: String(summaries.length + 1),
      createdAt: new Date().toISOString().split('T')[0],
      status: "pending" as const,
      views: 0,
    };
    setSummaries([...summaries, newSummary]);
  };

  const handleEditSummary = (id: string, updatedSummary: any) => {
    setSummaries(summaries.map(summary => 
      summary.id === id ? { ...summary, ...updatedSummary } : summary
    ));
  };

  const handleDeleteSummary = (id: string) => {
    setSummaries(summaries.filter(summary => summary.id !== id));
  };

  const handleApproveSummary = (id: string) => {
    setSummaries(summaries.map((summary: any) => 
      summary.id === id ? { ...summary, status: "approved" } : summary
    ));
  };

  const handleRejectSummary = (id: string) => {
    setSummaries(summaries.map((summary: any) => 
      summary.id === id ? { ...summary, status: "rejected" } : summary
    ));
  };

  return (
    <ProfessorLayout>
      <ResumosProfessor
        summaries={summaries}
        onCreateSummary={handleCreateSummary}
        onEditSummary={handleEditSummary}
        onDeleteSummary={handleDeleteSummary}
        onApproveSummary={handleApproveSummary}
        onRejectSummary={handleRejectSummary}
      />
    </ProfessorLayout>
  );
}