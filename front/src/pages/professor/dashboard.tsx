import { useEffect, useState } from "react";
import { DashboardProfessor } from "@/components/professor/DashboardProfessor";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { api } from "@/lib/api";

type ActivityCard = {
  discipline: string;
  codigo: string;
  total: number;
  pending: number;
  corrected: number;
};

type TurmaResumo = { turma: string; media: number | null; participacao: number };
type RankingAluno = { nome: string; saldo: number };
type AtividadeRecente = { tipo: "entrega" | "correcao"; mensagem: string; data: string };

export default function TeacherDashboardPage() {
  const [nome, setNome] = useState("");
  const [activities, setActivities] = useState<ActivityCard[]>([]);
  const [turmas, setTurmas] = useState<TurmaResumo[]>([]);
  const [ranking, setRanking] = useState<RankingAluno[]>([]);
  const [atividadesRecentes, setAtividadesRecentes] = useState<AtividadeRecente[]>([]);

  useEffect(() => {
    async function carregar() {
      try {
        const [me, dashboard] = await Promise.all([
          api.get("/auth/me"),
          api.get("/professor/dashboard"),
        ]);

        setNome(me?.nome ?? "");
        setActivities(dashboard.disciplinas ?? []);
        setTurmas(dashboard.turmas ?? []);
        setRanking(dashboard.ranking ?? []);
        setAtividadesRecentes(dashboard.atividadesRecentes ?? []);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      }
    }

    carregar();
  }, []);

  return (
    <ProfessorLayout>
      <DashboardProfessor
        teacherName={nome}
        activities={activities}
        turmas={turmas}
        ranking={ranking}
        atividadesRecentes={atividadesRecentes}
      />
    </ProfessorLayout>
  );
}
