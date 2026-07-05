import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { DisciplinasProfessor } from "@/components/professor/DisciplinasProfessor";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";

type Discipline = {
  id: string;
  name: string;
  code: string;
  description: string;
  workload: number;
  classes: string[];
  totalStudents: number;
  averageGrade: number | null;
  completionRate: number;
  status: "active" | "inactive";
};

export default function DisciplinasPage() {
  const router = useRouter();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [initialViewCode, setInitialViewCode] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady && router.query.view) {
      setInitialViewCode(router.query.view as string);
    }
  }, [router.isReady, router.query.view]);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await api.get("/professor/disciplinas");
        setDisciplines(
          (data ?? []).map((d: any) => ({
            id: String(d.id_disciplina),
            name: d.nome,
            code: d.codigo,
            description: d.descricao ?? "",
            workload: d.carga_horaria ?? 0,
            classes: d.turmas ?? [],
            totalStudents: d.total_alunos,
            averageGrade: d.media_nota !== null ? Number(d.media_nota) : null,
            completionRate: d.taxa_conclusao,
            status: d.ativo ? "active" : "inactive",
          }))
        );
      } catch (err) {
        console.error("Erro ao carregar disciplinas:", err);
      }
    }

    carregar();
  }, []);

  return (
    <ProfessorLayout>
      <DisciplinasProfessor disciplines={disciplines} initialViewCode={initialViewCode} />
    </ProfessorLayout>
  );
}
