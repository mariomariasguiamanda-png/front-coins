import { useState, useEffect } from "react";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { TurmasProfessor, Class } from "@/components/professor/TurmasProfessor";
import { supabase } from "@/lib/supabaseClient";

// Nova interface simplificada para refletir tabela turmas atual
interface TurmaUI {
  id: string;
  name: string;
  shift: string; // morning, afternoon, night, etc.
}

interface AlunoTurmaRow {
  id_aluno: number;
  nome: string;
  email: string | null;
  id_turma: number | null;
  status?: string | null;
}

interface NotaFinalRow {
  id_aluno: number;
  nota_final: number | null;
}

interface MoedasAlunoRow {
  id_aluno: number;
  moedas_conquistadas: number | null;
}

// Mapeia linha do banco para TurmaUI mínima
function mapTurmaRowToUI(row: any): TurmaUI {
  return {
    id: String(row.id_turma),
    name: row.nome,
    shift: row.turno ?? "",
  };
}

// Converte TurmaUI mínima para Class base (expectativa do componente TurmasProfessor)
function convertTurmaToClassBase(t: TurmaUI): Class {
  return {
    id: t.id,
    name: t.name,
    shift: (t.shift || "morning") as Class["shift"],
    totalStudents: 0,
    activeStudents: 0,
    disciplines: [],
    averageGrade: 0,
  };
}

export default function TurmasPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // CARREGAR TURMAS DO SUPABASE
  // ==========================
  useEffect(() => {
    async function carregarTurmas() {
      setLoading(true);

      const [
        { data: turmasData, error: turmasError },
        { data: alunosData, error: alunosError },
        { data: notasData, error: notasError },
        { data: moedasData, error: moedasError },
      ] = await Promise.all([
        supabase.from("turmas").select("*"),
        supabase.from("alunos").select("id_aluno, nome, email, id_turma, status"),
        supabase.from("notas_finais").select("id_aluno, nota_final"),
        supabase.from("vw_disciplinas_moedas_aluno").select("id_aluno, moedas_conquistadas"),
      ]);

      if (turmasError || alunosError || notasError || moedasError) {
        console.error("Erro ao carregar dados de turmas:", {
          turmasError,
          alunosError,
          notasError,
          moedasError,
        });
        setLoading(false);
        return;
      }

      const turmas = (turmasData ?? []).map(mapTurmaRowToUI);
      const alunos = (alunosData ?? []) as AlunoTurmaRow[];
      const notas = (notasData ?? []) as NotaFinalRow[];
      const moedas = (moedasData ?? []) as MoedasAlunoRow[];

      const notasPorAluno = new Map<number, number[]>();
      notas.forEach((n) => {
        if (n.nota_final === null || n.nota_final === undefined) return;
        const lista = notasPorAluno.get(n.id_aluno) ?? [];
        lista.push(Number(n.nota_final));
        notasPorAluno.set(n.id_aluno, lista);
      });

      const moedasPorAluno = new Map<number, number>();
      moedas.forEach((m) => {
        const atual = moedasPorAluno.get(m.id_aluno) ?? 0;
        moedasPorAluno.set(m.id_aluno, atual + Number(m.moedas_conquistadas ?? 0));
      });

      const classesComAlunos: Class[] = turmas.map((turma) => {
        const alunosTurma = alunos.filter((a) => String(a.id_turma ?? "") === turma.id);

        const students = alunosTurma.map((a) => {
          const notasAluno = notasPorAluno.get(a.id_aluno) ?? [];
          const avg =
            notasAluno.length > 0
              ? notasAluno.reduce((acc, item) => acc + item, 0) / notasAluno.length
              : undefined;

          return {
            id: String(a.id_aluno),
            name: a.nome,
            email: a.email ?? "Sem e-mail",
            status: a.status === "inactive" ? "inactive" : "active",
            averageGrade: avg,
            totalCoins: moedasPorAluno.get(a.id_aluno) ?? 0,
          };
        });

        const avgClass =
          students.length > 0
            ? students.reduce((acc, s) => acc + (s.averageGrade ?? 0), 0) / students.length
            : 0;

        return {
          ...convertTurmaToClassBase(turma),
          totalStudents: students.length,
          activeStudents: students.filter((s) => s.status === "active").length,
          averageGrade: avgClass,
          students,
        };
      });

      setClasses(classesComAlunos);

      setLoading(false);
    }

    carregarTurmas();
  }, []);

  // ==========================
  // CRIAR TURMA
  // ==========================
  const handleCreateClass = async (classData: any) => {
    const { data, error } = await supabase
      .from("turmas")
      .insert({
        nome: classData.name,
        turno: classData.shift,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Erro ao criar turma:", error);
      return;
    }

    if (data) {
      const novaTurma = convertTurmaToClassBase(mapTurmaRowToUI(data));
      setClasses((prev) => [...prev, novaTurma]);
      console.log("Turma criada:", data);
    }
  };

  // ==========================
  // EDITAR TURMA
  // ==========================
  const handleEditClass = async (id: string, classData: any) => {
    const { data, error } = await supabase
      .from("turmas")
      .update({
        ...(classData.name && { nome: classData.name }),
        ...(classData.shift && { turno: classData.shift }),
      })
      .eq("id_turma", id)
      .select("*")
      .single();

    if (error) {
      console.error("Erro ao editar turma:", error);
      return;
    }

    if (data) {
      setClasses((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                ...convertTurmaToClassBase(mapTurmaRowToUI(data)),
                students: t.students,
                totalStudents: t.totalStudents,
                activeStudents: t.activeStudents,
                averageGrade: t.averageGrade,
              }
            : t
        )
      );
      console.log("Turma editada:", id, data);
    }
  };

  // ==========================
  // DELETAR TURMA
  // ==========================
  const handleDeleteClass = async (id: string) => {
    const { error } = await supabase.from("turmas").delete().eq("id_turma", id);

    if (error) {
      console.error("Erro ao deletar turma:", error);
      return;
    }

    setClasses((prev) => prev.filter((t) => t.id !== id));
    console.log("Turma deletada:", id);
  };

  return (
    <ProfessorLayout>
      {/* Se quiser, dá pra mostrar um loading aqui */}
      {/* {loading ? <div>Carregando turmas...</div> : ( */}
      <TurmasProfessor
        classes={classes}
        onCreateClass={handleCreateClass}
        onEditClass={handleEditClass}
        onDeleteClass={handleDeleteClass}
      />
      {/* )} */}
    </ProfessorLayout>
  );
}
