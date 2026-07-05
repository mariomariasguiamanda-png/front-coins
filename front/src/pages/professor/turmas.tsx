import { useState, useEffect } from "react";
import { getProfessorLayout } from "@/components/professor/ProfessorLayout";
import type { NextPageWithLayout } from "@/pages/_app";
import { TurmasProfessor, Class } from "@/components/professor/TurmasProfessor";
import { api } from "@/lib/api";

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

function TurmasPage() {
  const [turmas, setTurmas] = useState<TurmaUI[]>([]);
  const classes: Class[] = turmas.map(convertTurmaToClass);
  const [loading, setLoading] = useState(true);

  // ==========================
  // CARREGAR TURMAS DA API
  // ==========================
  useEffect(() => {
    async function carregarTurmas() {
      setLoading(true);

      try {
        const data = await api.get("/turmas");
        setTurmas((data ?? []).map(mapTurmaRowToUI));
      } catch (err) {
        console.error("Erro ao buscar turmas:", err);
      }

      setLoading(false);
    }

    carregarTurmas();
  }, []);

  // ==========================
  // CRIAR TURMA
  // ==========================
  const handleCreateClass = async (classData: any) => {
    try {
      const data = await api.post("/turmas", {
        nome: classData.name,
        turno: classData.shift,
      });

      setTurmas((prev) => [...prev, mapTurmaRowToUI(data)]);
    } catch (err) {
      console.error("Erro ao criar turma:", err);
    }
  };

  // ==========================
  // EDITAR TURMA
  // ==========================
  const handleEditClass = async (id: string, classData: any) => {
    try {
      const data = await api.patch(`/turmas/${id}`, {
        ...(classData.name && { nome: classData.name }),
        ...(classData.shift && { turno: classData.shift }),
      });

      setTurmas((prev) =>
        prev.map((t) => (t.id === id ? mapTurmaRowToUI(data) : t))
      );
    } catch (err) {
      console.error("Erro ao editar turma:", err);
    }
  };

  // ==========================
  // DELETAR TURMA (soft delete - a turma sai da lista, mas os dados ficam
  // preservados na API, evitando quebrar matrículas de alunos já vinculados)
  // ==========================
  const handleDeleteClass = async (id: string) => {
    try {
      await api.delete(`/turmas/${id}`);
      setTurmas((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Erro ao deletar turma:", err);
    }
  };

  return (
    <>
      {/* Se quiser, dá pra mostrar um loading aqui */}
      {/* {loading ? <div>Carregando turmas...</div> : ( */}
      <TurmasProfessor
        classes={classes}
        onCreateClass={handleCreateClass}
        onEditClass={handleEditClass}
        onDeleteClass={handleDeleteClass}
      />
      {/* )} */}
    </>
  );
}

(TurmasPage as NextPageWithLayout).getLayout = getProfessorLayout;

export default TurmasPage;
