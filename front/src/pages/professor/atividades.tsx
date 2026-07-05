import { useEffect, useState } from "react";
import { AtividadesProfessor } from "@/components/professor/AtividadesProfessor";
import { getProfessorLayout } from "@/components/professor/ProfessorLayout";
import type { NextPageWithLayout } from "@/pages/_app";
import { api } from "@/lib/api";

type Activity = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  coins: number;
  status: "pendente" | "entregue" | "corrigida";
  submissions: number;
  totalStudents: number;
  discipline: string;
  id_disciplina: string;
};

type DisciplinaOption = { id: string; nome: string };

function AtividadesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [disciplinas, setDisciplinas] = useState<DisciplinaOption[]>([]);

  const carregarAtividades = async () => {
    try {
      const data = await api.get("/professor/atividades");
      setActivities(
        (data ?? []).map((a: any) => ({
          id: String(a.id_atividade),
          title: a.titulo,
          description: a.descricao ?? "",
          dueDate: a.data_vencimento ? a.data_vencimento.split("T")[0] : "",
          coins: a.recompensa_moedas ?? 0,
          status: a.status,
          submissions: a.entregues + a.corrigidas,
          totalStudents: a.total_alunos,
          discipline: a.disciplinas?.nome ?? "",
          id_disciplina: String(a.id_disciplina),
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar atividades:", err);
    }
  };

  useEffect(() => {
    carregarAtividades();
    async function carregarDisciplinas() {
      try {
        const data = await api.get("/professor/disciplinas");
        setDisciplinas((data ?? []).map((d: any) => ({ id: String(d.id_disciplina), nome: d.nome })));
      } catch (err) {
        console.error("Erro ao carregar disciplinas:", err);
      }
    }
    carregarDisciplinas();
  }, []);

  const handleCreateActivity = async (dados: {
    titulo: string;
    descricao: string;
    id_disciplina: string;
    data_vencimento: string;
    recompensa_moedas: number;
  }) => {
    const criada = await api.post("/professor/atividades", dados);
    await carregarAtividades();
    return String(criada.id_atividade);
  };

  const handleCreateQuestion = async (
    id_atividade: string,
    pergunta: {
      tipo: "descritiva" | "multipla" | "vf";
      enunciado: string;
      peso?: number;
      alternativa_a?: string;
      alternativa_b?: string;
      alternativa_c?: string;
      alternativa_d?: string;
      letra_correta?: string;
      correta?: boolean;
    }
  ) => {
    await api.post(`/professor/atividades/${id_atividade}/questoes`, pergunta);
  };

  const handleEditActivity = async (
    id: string,
    dados: { titulo: string; descricao: string; data_vencimento: string; recompensa_moedas: number }
  ) => {
    await api.patch(`/professor/atividades/${id}`, dados);
    await carregarAtividades();
  };

  const handleDeleteActivity = async (id: string) => {
    await api.delete(`/professor/atividades/${id}`);
    await carregarAtividades();
  };

  return (
    <>
      <AtividadesProfessor
        activities={activities}
        disciplinas={disciplinas}
        onCreateActivity={handleCreateActivity}
        onCreateQuestion={handleCreateQuestion}
        onEditActivity={handleEditActivity}
        onDeleteActivity={handleDeleteActivity}
      />
    </>
  );
}

(AtividadesPage as NextPageWithLayout).getLayout = getProfessorLayout;

export default AtividadesPage;
