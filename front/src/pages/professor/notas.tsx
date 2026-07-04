import { useEffect, useState } from "react";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { NotasProfessor } from "@/components/professor/NotasProfessor";
import { supabase } from "@/lib/supabaseClient";

// Tipos básicos
type DisciplinaOption = {
  id_disciplina: number;
  nome: string;
};

type TurmaOption = {
  id_turma: number;
  nome: string;
};

type NotaProfessorRow = {
  id_turma: number;
  nome_turma: string;
  id_disciplina: number;
  nome_disciplina: string;
  id_aluno: number;
  matricula: string;
  nome_aluno: string;
  nota_final: number | null;
  status_final: string | null;
  atualizado_em: string | null;
};

export default function NotasPage() {
  const [disciplinas, setDisciplinas] = useState<DisciplinaOption[]>([]);
  const [turmas, setTurmas] = useState<TurmaOption[]>([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);

  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Carrega disciplinas e turmas
  useEffect(() => {
    const carregarDisciplinasETurmas = async () => {
      try {
        setErro(null);

        const [
          { data: discData, error: discError },
          { data: turmaData, error: turmaError }
        ] = await Promise.all([
          supabase.from("disciplinas").select("id_disciplina, nome").order("nome"),
          supabase.from("turmas").select("id_turma, nome").order("nome"),
        ]);

        if (discError) throw discError;
        if (turmaError) throw turmaError;

        setDisciplinas((discData ?? []) as DisciplinaOption[]);
        setTurmas((turmaData ?? []) as TurmaOption[]);
      } catch (err: any) {
        console.error(err);
        setErro("Erro ao carregar disciplinas e turmas.");
      }
    };

    carregarDisciplinasETurmas();
  }, []);

  // Busca alunos + notas finais da view
  const carregarNotas = async (idDisciplina: number, idTurma: number) => {
    try {
      setLoading(true);
      setErro(null);

      const { data, error } = await supabase
        .from("vw_lancamento_notas_professor")
        .select(`
          id_turma,
          nome_turma,
          id_disciplina,
          nome_disciplina,
          id_aluno,
          matricula,
          nome_aluno,
          nota_final,
          status_final,
          atualizado_em
        `)
        .eq("id_disciplina", idDisciplina)
        .eq("id_turma", idTurma);

      if (error) throw error;

      const rows = (data ?? []) as NotaProfessorRow[];

      const mapped = rows.map((row) => ({
        id: `${row.id_aluno}-${row.id_disciplina}`,
        studentName: row.nome_aluno,
        studentId: row.matricula,
        activity: "Nota Final",
        grade: row.nota_final,
        maxGrade: 10,
        date: row.atualizado_em
          ? new Date(row.atualizado_em).toISOString().split("T")[0]
          : "",
        discipline: row.nome_disciplina,
        class: row.nome_turma,

        // dados internos para salvar no banco
        _idAluno: row.id_aluno,
        _idDisciplina: row.id_disciplina,
      }));

      setGrades(mapped);
    } catch (err: any) {
      console.error(err);
      setErro("Erro ao carregar notas.");
    } finally {
      setLoading(false);
    }
  };

  // Recarrega quando selecionar Disciplina + Turma
  useEffect(() => {
    if (disciplinaSelecionada && turmaSelecionada) {
      carregarNotas(disciplinaSelecionada, turmaSelecionada);
    } else {
      setGrades([]);
    }
  }, [disciplinaSelecionada, turmaSelecionada]);

  // Regra do status final
  const getStatusFromNota = (nota: number | null): string | null => {
    if (nota === null || isNaN(nota)) return null;
    if (nota >= 6) return "aprovado";
    if (nota >= 4) return "recuperacao";
    return "reprovado";
  };

  // Salvar nota editada
  const handleEditGrade = async (id: string, updatedGrade: any) => {
    try {
      const atual = grades.find((g) => g.id === id);
      if (!atual) return;

      const notaRaw =
        updatedGrade.grade !== undefined ? updatedGrade.grade : atual.grade;

      const nota = Number(String(notaRaw).replace(",", "."));
      const status_final = getStatusFromNota(nota);

      const payload = {
        id_aluno: atual._idAluno,
        id_disciplina: atual._idDisciplina,
        nota_final: nota,
        status_final,
      };

      const { error } = await supabase
        .from("notas_finais")
        .upsert(payload, { onConflict: "id_aluno,id_disciplina" });

      if (error) throw error;

      // Atualizar UI recarregando da view
      if (disciplinaSelecionada && turmaSelecionada) {
        await carregarNotas(disciplinaSelecionada, turmaSelecionada);
      }
    } catch (err: any) {
      console.error(err);
      alert("Erro ao salvar nota final.");
    }
  };

  // Ações extras (não usadas agora)
  const handleAddGrade = () =>
    alert("Para adicionar aluno, use a tela de matrícula.");

  const handleDeleteGrade = () =>
    alert("Remover nota final será implementado depois.");

  const handleExportGrades = () => {
    const headers = [
      "Aluno",
      "Matrícula",
      "Disciplina",
      "Turma",
      "Nota Final",
      "Data",
    ];

    const csvContent = [
      headers.join(","),
      ...grades.map((g: any) =>
        [
          `"${g.studentName}"`,
          g.studentId,
          `"${g.discipline}"`,
          `"${g.class}"`,
          g.grade ?? "",
          g.date ?? "",
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notas_finais.csv";
    link.click();
  };

  const handleImportGrades = () =>
    alert("Importação de CSV será implementada futuramente.");

  return (
    <ProfessorLayout>
      {/* Filtros */}
      <div className="px-6 pt-6 pb-4 flex flex-wrap gap-6">
        <div>
          <label className="text-sm text-gray-600">Disciplina</label>
          <select
            className="border rounded px-3 py-2 block min-w-[220px]"
            value={disciplinaSelecionada ?? ""}
            onChange={(e) =>
              setDisciplinaSelecionada(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Selecione...</option>
            {disciplinas.map((d) => (
              <option key={d.id_disciplina} value={d.id_disciplina}>
                {d.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Turma</label>
          <select
            className="border rounded px-3 py-2 block min-w-[180px]"
            value={turmaSelecionada ?? ""}
            onChange={(e) =>
              setTurmaSelecionada(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Selecione...</option>
            {turmas.map((t) => (
              <option key={t.id_turma} value={t.id_turma}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        {loading && <span className="text-gray-500">Carregando...</span>}
        {erro && <span className="text-red-600">{erro}</span>}
      </div>

      {/* Tabela */}
      <NotasProfessor
        grades={grades}
        onAddGrade={handleAddGrade}
        onEditGrade={handleEditGrade}
        onDeleteGrade={handleDeleteGrade}
        onExportGrades={handleExportGrades}
        onImportGrades={handleImportGrades}
      />
    </ProfessorLayout>
  );
}
