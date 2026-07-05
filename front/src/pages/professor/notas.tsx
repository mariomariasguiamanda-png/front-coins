import { useEffect, useState } from "react";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { NotasProfessor } from "@/components/professor/NotasProfessor";
import { api } from "@/lib/api";

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

        const [discData, turmaData] = await Promise.all([
          api.get("/disciplinas"),
          api.get("/turmas"),
        ]);

        const ordenarPorNome = <T extends { nome: string }>(rows: T[]) =>
          [...rows].sort((a, b) => a.nome.localeCompare(b.nome));

        setDisciplinas(ordenarPorNome((discData ?? []) as DisciplinaOption[]));
        setTurmas(ordenarPorNome((turmaData ?? []) as TurmaOption[]));
      } catch (err: any) {
        console.error(err);
        setErro("Erro ao carregar disciplinas e turmas.");
      }
    };

    carregarDisciplinasETurmas();
  }, []);

  // Busca alunos + notas finais da disciplina/turma na API
  const carregarNotas = async (idDisciplina: number, idTurma: number) => {
    try {
      setLoading(true);
      setErro(null);

      const data = await api.get(
        `/professor/notas?disciplina=${idDisciplina}&turma=${idTurma}`
      );

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

  // Salvar nota editada (status final é calculado e persistido pela API)
  const handleEditGrade = async (id: string, updatedGrade: any) => {
    try {
      const atual = grades.find((g) => g.id === id);
      if (!atual) return;

      const notaRaw =
        updatedGrade.grade !== undefined ? updatedGrade.grade : atual.grade;

      const nota = Number(String(notaRaw).replace(",", "."));

      await api.put("/professor/notas", {
        id_aluno: String(atual._idAluno),
        id_disciplina: String(atual._idDisciplina),
        nota_final: nota,
      });

      // Atualizar UI recarregando da API
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
