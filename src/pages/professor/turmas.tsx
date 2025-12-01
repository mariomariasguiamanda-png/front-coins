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

// Mapeia linha do banco para TurmaUI mínima
function mapTurmaRowToUI(row: any): TurmaUI {
  return {
    id: String(row.id_turma),
    name: row.nome,
    shift: row.turno ?? "",
  };
}

// Converte TurmaUI mínima para Class (expectativa do componente TurmasProfessor)
function convertTurmaToClass(t: TurmaUI): Class {
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
  const [turmas, setTurmas] = useState<TurmaUI[]>([]);
  const classes: Class[] = turmas.map(convertTurmaToClass);
  const [loading, setLoading] = useState(true);

  // ==========================
  // CARREGAR TURMAS DO SUPABASE
  // ==========================
  useEffect(() => {
    async function carregarTurmas() {
      setLoading(true);

      const { data, error } = await supabase
        .from("turmas") // nome da tabela no Supabase
        .select("*");

      if (error) {
        console.error("Erro ao buscar turmas:", error);
      } else if (data) {
        setTurmas(data.map(mapTurmaRowToUI));
      }

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
      setTurmas((prev) => [...prev, mapTurmaRowToUI(data)]);
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
      setTurmas((prev) =>
        prev.map((t) => (t.id === id ? mapTurmaRowToUI(data) : t))
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

    setTurmas((prev) => prev.filter((t) => t.id !== id));
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
