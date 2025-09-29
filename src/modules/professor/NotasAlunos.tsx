import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
} from "lucide-react";

interface AlunoNota {
  id: number;
  nome: string;
  matricula: string;
  disciplina: string;
  atividade: string;
  nota: number;
  status: "aprovado" | "reprovado" | "pendente";
  dataEntrega: string;
  precisaRevisao?: boolean;
}

const mockNotas: AlunoNota[] = [
  {
    id: 1,
    nome: "Ana Silva",
    matricula: "2024001",
    disciplina: "Matemática",
    atividade: "Prova P1 - Funções",
    nota: 8.5,
    status: "aprovado",
    dataEntrega: "2024-09-20",
    precisaRevisao: false,
  },
  {
    id: 2,
    nome: "João Santos",
    matricula: "2024002",
    disciplina: "Matemática",
    atividade: "Prova P1 - Funções",
    nota: 5.0,
    status: "reprovado",
    dataEntrega: "2024-09-20",
    precisaRevisao: true,
  },
  {
    id: 3,
    nome: "Maria Oliveira",
    matricula: "2024003",
    disciplina: "História",
    atividade: "Trabalho - Revolução Industrial",
    nota: 0,
    status: "pendente",
    dataEntrega: "2024-09-25",
    precisaRevisao: false,
  },
  {
    id: 4,
    nome: "Pedro Costa",
    matricula: "2024004",
    disciplina: "Física",
    atividade: "Lista - Leis de Newton",
    nota: 9.2,
    status: "aprovado",
    dataEntrega: "2024-09-22",
    precisaRevisao: false,
  },
];

export default function NotasAlunos() {
  const [notas] = useState<AlunoNota[]>(mockNotas);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprovado":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "reprovado":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pendente":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      aprovado: "bg-green-100 text-green-800 border-green-200",
      reprovado: "bg-red-100 text-red-800 border-red-200",
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return variants[status as keyof typeof variants] || variants.pendente;
  };

  const getNotaColor = (nota: number) => {
    if (nota >= 7) return "text-green-400";
    if (nota >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  const notasFiltradas =
    filtroStatus === "todos"
      ? notas
      : notas.filter((nota) => nota.status === filtroStatus);

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            🧮 Notas dos Alunos
          </h2>
          <p className="text-white/80">
            Gerencie notas, marque revisões necessárias e acompanhe o desempenho
            da turma.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <FileText className="h-4 w-4 mr-2" />
            Relatório PDF
          </Button>
        </div>
      </div>

      {/* Filtros e busca */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
              <Input
                placeholder="Buscar por aluno, matrícula ou disciplina..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div className="flex gap-2">
              {["todos", "aprovado", "reprovado", "pendente"].map((status) => (
                <Button
                  key={status}
                  variant={filtroStatus === status ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus(status)}
                  className={
                    filtroStatus === status
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de notas */}
      <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white font-semibold">
                    Aluno
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Disciplina
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Atividade
                  </th>
                  <th className="text-center p-4 text-white font-semibold">
                    Nota
                  </th>
                  <th className="text-center p-4 text-white font-semibold">
                    Status
                  </th>
                  <th className="text-center p-4 text-white font-semibold">
                    Data
                  </th>
                  <th className="text-center p-4 text-white font-semibold">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {notasFiltradas.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-white">
                          {item.nome}
                        </div>
                        <div className="text-sm text-white/60">
                          {item.matricula}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white/80">{item.disciplina}</td>
                    <td className="p-4 text-white/80">{item.atividade}</td>
                    <td className="p-4 text-center">
                      {item.status === "pendente" ? (
                        <span className="text-white/60">-</span>
                      ) : (
                        <span
                          className={`font-bold ${getNotaColor(item.nota)}`}
                        >
                          {item.nota.toFixed(1)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge
                          className={`text-xs ${getStatusBadge(item.status)}`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4 text-center text-white/70 text-sm">
                      {new Date(item.dataEntrega).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent border-white/20 text-white/80 hover:bg-white/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {item.precisaRevisao && (
                          <Button
                            size="sm"
                            className="bg-orange-500/20 text-orange-300 border-orange-300/30 hover:bg-orange-500/30"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas da turma */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">75%</div>
            <div className="text-sm text-white/70">Taxa de aprovação</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">7.2</div>
            <div className="text-sm text-white/70">Média da turma</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">2</div>
            <div className="text-sm text-white/70">Precisam revisão</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">1</div>
            <div className="text-sm text-white/70">Pendentes</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
