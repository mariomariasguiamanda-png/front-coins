import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, History, Download } from "lucide-react";

interface Grade {
  id: string;
  studentName: string;
  studentId: string;
  activity: string;
  grade: number;
  maxGrade: number;
  date: string;
  discipline: string;
  class: string;
}

interface NotasProfessorProps {
  grades: Grade[];
  onAddGrade: (grade: Omit<Grade, "id">) => void;
  onEditGrade: (id: string, grade: Partial<Grade>) => void;
  onDeleteGrade: (id: string) => void;
  onExportGrades: () => void;
}

export function NotasProfessor({
  grades = [],
  onAddGrade,
  onEditGrade,
  onDeleteGrade,
  onExportGrades,
}: NotasProfessorProps) {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Notas</h1>
          <p className="text-muted-foreground">
            Gerencie as notas dos alunos por disciplina
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={onExportGrades}
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </header>

      {/* Adicionar nota */}
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <Star className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold">Adicionar Nota</h2>
          </div>

          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Disciplina</Label>
                <Select>
                  <SelectTrigger className="rounded-xl bg-white">
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                    <SelectItem value="quimica">Química</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Turma</Label>
                <Select>
                  <SelectTrigger className="rounded-xl bg-white">
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1a">1º A</SelectItem>
                    <SelectItem value="2b">2º B</SelectItem>
                    <SelectItem value="3c">3º C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Atividade</Label>
                <Select>
                  <SelectTrigger className="rounded-xl bg-white">
                    <SelectValue placeholder="Selecione a atividade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prova1">Prova 1</SelectItem>
                    <SelectItem value="trabalho">Trabalho em Grupo</SelectItem>
                    <SelectItem value="lista">Lista de Exercícios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Aluno</Label>
                <Select>
                  <SelectTrigger className="rounded-xl bg-white">
                    <SelectValue placeholder="Selecione o aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joao">João Silva</SelectItem>
                    <SelectItem value="maria">Maria Santos</SelectItem>
                    <SelectItem value="pedro">Pedro Oliveira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nota</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label>Data</Label>
                <Input type="date" className="rounded-xl" />
              </div>
            </div>

            <Button className="rounded-xl">Salvar Nota</Button>
          </form>
        </CardContent>
      </Card>

      {/* Histórico de notas */}
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <History className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold">Histórico de Notas</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left">
                <tr>
                  <th className="pb-4 font-medium">Aluno</th>
                  <th className="pb-4 font-medium">Disciplina</th>
                  <th className="pb-4 font-medium">Turma</th>
                  <th className="pb-4 font-medium">Atividade</th>
                  <th className="pb-4 font-medium">Nota</th>
                  <th className="pb-4 font-medium">Data</th>
                  <th className="pb-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {grades.map((grade) => (
                  <tr key={grade.id}>
                    <td className="py-4">{grade.studentName}</td>
                    <td className="py-4">{grade.discipline}</td>
                    <td className="py-4">{grade.class}</td>
                    <td className="py-4">{grade.activity}</td>
                    <td className="py-4">
                      {grade.grade}/{grade.maxGrade}
                    </td>
                    <td className="py-4">
                      {new Date(grade.date).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => onEditGrade(grade.id, grade)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-red-600 hover:bg-red-50"
                          onClick={() => onDeleteGrade(grade.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
