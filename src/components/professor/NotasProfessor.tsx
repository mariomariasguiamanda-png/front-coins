import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download, Upload, Plus, Trash2 } from "lucide-react";

type GradeRow = {
  id: string;
  studentName: string;
  studentId: string;
  activity?: string;
  grade: number | null;
  maxGrade: number;
  date?: string;
  discipline: string;
  class: string;
};

interface NotasProfessorProps {
  grades: GradeRow[];
  onAddGrade: () => void; // não vamos usar de verdade no modelo 2, mas mantemos a assinatura
  onEditGrade: (id: string, updated: Partial<GradeRow>) => void | Promise<void>;
  onDeleteGrade: (id: string) => void;
  onExportGrades: () => void;
  onImportGrades: () => void;
}

export function NotasProfessor({
  grades,
  onAddGrade,
  onEditGrade,
  onDeleteGrade,
  onExportGrades,
  onImportGrades,
}: NotasProfessorProps) {
  // Para o card de "Adicionar Nota Final"
  const [selectedGradeId, setSelectedGradeId] = useState<string>("");
  const [notaInput, setNotaInput] = useState<string>("");
  const [dataInput, setDataInput] = useState<string>("");

  // Disciplina e Turma atuais (todas as linhas da tela são da mesma combinação)
  const contextoAtual = useMemo(() => {
    if (!grades.length) return { disciplina: "", turma: "" };
    return {
      disciplina: grades[0].discipline,
      turma: grades[0].class,
    };
  }, [grades]);

  // Lista de alunos da turma+disciplina atual
  const alunosOptions = useMemo(() => {
    const mapa = new Map<string, GradeRow>();
    grades.forEach((g) => {
      if (!mapa.has(g.id)) {
        mapa.set(g.id, g);
      }
    });
    return Array.from(mapa.values());
  }, [grades]);

  // Quando carregar a tela / mudar grades, define um aluno padrão no select
  useMemo(() => {
    if (alunosOptions.length && !selectedGradeId) {
      setSelectedGradeId(alunosOptions[0].id);
    }
  }, [alunosOptions, selectedGradeId]);

  const handleSalvarNotaFinal = async () => {
    if (!selectedGradeId) {
      alert("Selecione um aluno.");
      return;
    }
    if (!notaInput) {
      alert("Informe a nota.");
      return;
    }

    const notaNumber = Number(String(notaInput).replace(",", "."));
    if (isNaN(notaNumber)) {
      alert("Nota inválida. Use números, ex: 8.5");
      return;
    }

    await onEditGrade(selectedGradeId, {
      grade: notaNumber,
      date: dataInput || new Date().toISOString().split("T")[0],
    });

    setNotaInput("");
    setDataInput("");
  };

  // Tabela – o professor ainda consegue ver/ajustar diretamente, se quiser
  const handleInlineChange = async (
    gradeId: string,
    newValue: string
  ) => {
    const notaNumber = Number(String(newValue).replace(",", "."));
    if (isNaN(notaNumber)) return;
    await onEditGrade(gradeId, {
      grade: notaNumber,
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="px-6 pb-8 space-y-6">
      {/* Card: Adicionar Nota Final */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-violet-100 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Adicionar Nota Final
                  </h2>
                  <p className="text-sm text-gray-500">
                    Registre a nota final de um aluno na disciplina selecionada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Disciplina (somente leitura, vem do contexto) */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Disciplina *</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-not-allowed"
                value={contextoAtual.disciplina || "Selecione disciplina e turma acima"}
                disabled
              />
            </div>

            {/* Turma (somente leitura) */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Turma *</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-not-allowed"
                value={contextoAtual.turma || "Selecione disciplina e turma acima"}
                disabled
              />
            </div>

            {/* Aluno */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Aluno *</label>
              <select
                className="border rounded-lg px-3 py-2 text-sm"
                value={selectedGradeId}
                onChange={(e) => setSelectedGradeId(e.target.value)}
                disabled={!alunosOptions.length}
              >
                {alunosOptions.length === 0 && (
                  <option value="">Nenhum aluno encontrado</option>
                )}
                {alunosOptions.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.studentName} ({aluno.studentId})
                  </option>
                ))}
              </select>
            </div>

            {/* Nota Final */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Nota *</label>
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-sm"
                placeholder="Ex: 8.5"
                value={notaInput}
                onChange={(e) => setNotaInput(e.target.value)}
              />
            </div>

            {/* Data (opcional) */}
            <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
              <label className="text-sm text-gray-600">Data</label>
              <input
                type="date"
                className="border rounded-lg px-3 py-2 text-sm"
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNotaInput("");
                  setDataInput("");
                }}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleSalvarNotaFinal}>
                <span className="mr-1.5">Salvar Nota</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barra de ações em cima da tabela */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          Notas Finais por Aluno
        </h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onImportGrades}
          >
            <Upload className="w-4 h-4 mr-1.5" />
            Importar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportGrades}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tabela de notas finais */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Aluno
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Matrícula
              </th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">
                Nota Final
              </th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">
                Data
              </th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Nenhum aluno encontrado para a disciplina/turma selecionada.
                </td>
              </tr>
            ) : (
              grades.map((grade) => (
                <tr
                  key={grade.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">{grade.studentName}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {grade.studentId}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="text"
                      className="border rounded-lg px-2 py-1 text-sm text-center w-20"
                      value={
                        grade.grade !== null && grade.grade !== undefined
                          ? String(grade.grade).replace(".", ",")
                          : ""
                      }
                      onChange={(e) =>
                        handleInlineChange(grade.id, e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {grade.date
                      ? new Date(grade.date).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg border border-red-100 text-red-600 px-2 py-1 text-xs hover:bg-red-50"
                      onClick={() => onDeleteGrade(grade.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Limpar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
