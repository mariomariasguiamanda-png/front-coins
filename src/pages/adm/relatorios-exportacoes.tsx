import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Download,
  LineChart as LineChartIcon,
  ChevronLeft,
  FileText,
  Users,
  BookOpen,
  CheckCircle,
  Calendar,
  Database,
} from "lucide-react";

// Mock minimal
const alunos = [
  { nome: "João Silva", matricula: "2023001", turma: "3º A", saldo: 450 },
  { nome: "Maria Fernandes", matricula: "2023002", turma: "3º A", saldo: 510 },
  { nome: "Pedro Santos", matricula: "2023003", turma: "3º B", saldo: 380 },
];

const turmas = [
  {
    turma: "3º A",
    disciplina: "Matemática",
    professor: "Prof. Carlos",
    mediaMoedas: 120,
    mediaNotas: 7.8,
    totalAlunos: 30,
  },
  {
    turma: "3º B",
    disciplina: "Português",
    professor: "Profa. Ana",
    mediaMoedas: 110,
    mediaNotas: 8.2,
    totalAlunos: 28,
  },
];

export default function RelatoriosExportacoesPage() {
  const [kind, setKind] = useState<"alunos" | "turmas" | "disciplinas">("alunos");
  const [exported, setExported] = useState(false);

  function exportCsv(filename: string, header: string[], rows: (string | number)[][]) {
    const csv = [
      header.join(","),
      ...rows.map((r) => r.map((v) => JSON.stringify(v ?? "")).join(",")),
    ].join("\n");
    if (typeof window !== "undefined") {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
    return csv;
  }

  function handleExport() {
    if (kind === "alunos") {
      const header = ["nome", "matricula", "turma", "saldo"];
      const rows = alunos.map((a) => [a.nome, a.matricula, a.turma, a.saldo]);
      exportCsv(`relatorio-alunos-${new Date().toISOString().slice(0, 10)}.csv`, header, rows);
    } else if (kind === "turmas") {
      const header = ["turma", "disciplina", "professor", "mediaMoedas", "mediaNotas", "totalAlunos"];
      const rows = turmas.map((t) => [
        t.turma,
        t.disciplina,
        t.professor,
        t.mediaMoedas,
        t.mediaNotas,
        t.totalAlunos,
      ]);
      exportCsv(`relatorio-turmas-${new Date().toISOString().slice(0, 10)}.csv`, header, rows);
    } else {
      const map = new Map<
        string,
        { disciplina: string; medias: number[]; notas: number[]; total: number }
      >();
      turmas.forEach((t) => {
        const cur = map.get(t.disciplina) ?? {
          disciplina: t.disciplina,
          medias: [],
          notas: [],
          total: 0,
        };
        cur.medias.push(t.mediaMoedas);
        cur.notas.push(t.mediaNotas);
        cur.total += t.totalAlunos;
        map.set(t.disciplina, cur);
      });
      const header = ["disciplina", "mediaMoedas", "mediaNotas", "totalAlunos"];
      const rows = Array.from(map.values()).map((d) => [
        d.disciplina,
        (d.medias.reduce((a, b) => a + b, 0) / d.medias.length).toFixed(2),
        (d.notas.reduce((a, b) => a + b, 0) / d.notas.length).toFixed(2),
        d.total,
      ]);
      exportCsv(`relatorio-disciplinas-${new Date().toISOString().slice(0, 10)}.csv`, header, rows);
    }
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  const stats = {
    alunos: alunos.length,
    turmas: turmas.length,
    disciplinas: new Set(turmas.map((t) => t.disciplina)).size,
    exportacoesHoje: 12,
  };

  const campos = {
    alunos: [
      { label: "Nome completo", desc: "Nome do aluno" },
      { label: "Matrícula", desc: "Código de matrícula único" },
      { label: "Turma", desc: "Turma atual do aluno" },
      { label: "Saldo", desc: "Saldo atual de moedas" },
    ],
    turmas: [
      { label: "Turma", desc: "Nome da turma" },
      { label: "Disciplina", desc: "Disciplina principal" },
      { label: "Professor", desc: "Professor responsável" },
      { label: "Média de Moedas", desc: "Média de moedas por aluno" },
      { label: "Média de Notas", desc: "Média geral de notas" },
      { label: "Total de Alunos", desc: "Quantidade de alunos" },
    ],
    disciplinas: [
      { label: "Disciplina", desc: "Nome da disciplina" },
      { label: "Média de Moedas", desc: "Média geral de moedas" },
      { label: "Média de Notas", desc: "Média geral de notas" },
      { label: "Total de Alunos", desc: "Total de alunos matriculados" },
    ],
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Exportações em CSV</h1>
                <p className="text-gray-600 mt-1">
                  Exporte dados de alunos, turmas ou disciplinas
                </p>
              </div>
            </div>
            <Link href="/adm/relatorios-hub" className="no-underline">
              <Button variant="outline" className="rounded-lg inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar ao hub
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Alunos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.alunos}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Turmas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.turmas}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Disciplinas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.disciplinas}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Database className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Exportações Hoje</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.exportacoesHoje}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Export Control */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl"></div>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Selecione o Tipo de Exportação</h2>
              <p className="text-sm text-gray-600">
                Escolha o tipo de dados que deseja exportar em formato CSV
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div onClick={() => setKind("alunos")} className="cursor-pointer">
                <Card
                  className={`rounded-lg border-2 transition-all hover:shadow-md ${
                    kind === "alunos"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Alunos</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {stats.alunos} registros
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div onClick={() => setKind("turmas")} className="cursor-pointer">
                <Card
                  className={`rounded-lg border-2 transition-all hover:shadow-md ${
                    kind === "turmas"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Turmas</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {stats.turmas} registros
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>

              <div onClick={() => setKind("disciplinas")} className="cursor-pointer">
                <Card
                  className={`rounded-lg border-2 transition-all hover:shadow-md ${
                    kind === "disciplinas"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-amber-300"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Database className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Disciplinas</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {stats.disciplinas} registros
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Button
                className="rounded-lg inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                {exported ? "Exportado com sucesso!" : "Exportar CSV"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Campos Incluídos */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Campos Incluídos na Exportação</h3>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {campos[kind].map((campo, idx) => (
                <Card key={idx} className="rounded-lg border border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{campo.label}</p>
                        <p className="text-xs text-gray-600 mt-1">{campo.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Sobre o arquivo CSV</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• O arquivo será baixado automaticamente no formato CSV</li>
                  <li>• Compatível com Excel, Google Sheets e outros editores</li>
                  <li>• Codificação UTF-8 para caracteres especiais</li>
                  <li>• Nome do arquivo inclui data de exportação</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
