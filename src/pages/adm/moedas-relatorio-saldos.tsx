import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentHistoryDialog } from "@/components/adm/dialogs/StudentHistoryDialog";
import { 
  ArrowLeft, 
  Search, 
  Download,
  TrendingUp,
  TrendingDown,
  Coins,
  Users,
  Calendar,
  Filter,
  FileText,
  BarChart3
} from "lucide-react";

interface StudentBalance {
  id: string;
  name: string;
  email: string;
  class: string;
  balance: number;
  totalReceived: number;
  totalSpent: number;
  lastTransaction: string;
  status: "positive" | "negative" | "zero";
}

export default function MoedasRelatorioSaldosPage() {
  const [search, setSearch] = useState("");
  const [classe, setClasse] = useState<string>("all");
  const [periodo, setPeriodo] = useState<string>("current");
  const [showGraphs, setShowGraphs] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentBalance | null>(null);

  const students: StudentBalance[] = [
    {
      id: "1",
      name: "João Silva",
      email: "joao.silva@escola.edu.br",
      class: "1º A",
      balance: 450,
      totalReceived: 850,
      totalSpent: 400,
      lastTransaction: "2024-11-01",
      status: "positive"
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria.santos@escola.edu.br",
      class: "1º B",
      balance: 220,
      totalReceived: 620,
      totalSpent: 400,
      lastTransaction: "2024-10-30",
      status: "positive"
    },
    {
      id: "3",
      name: "Pedro Oliveira",
      email: "pedro.oliveira@escola.edu.br",
      class: "2º A",
      balance: -50,
      totalReceived: 450,
      totalSpent: 500,
      lastTransaction: "2024-10-28",
      status: "negative"
    },
    {
      id: "4",
      name: "Ana Costa",
      email: "ana.costa@escola.edu.br",
      class: "2º B",
      balance: 0,
      totalReceived: 300,
      totalSpent: 300,
      lastTransaction: "2024-10-25",
      status: "zero"
    },
    {
      id: "5",
      name: "Carlos Mendes",
      email: "carlos.mendes@escola.edu.br",
      class: "3º A",
      balance: 680,
      totalReceived: 1200,
      totalSpent: 520,
      lastTransaction: "2024-11-02",
      status: "positive"
    },
  ];

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesText = !s || 
        student.name.toLowerCase().includes(s) || 
        student.email.toLowerCase().includes(s) ||
        student.class.toLowerCase().includes(s);
      const matchesClass = classe === "all" || student.class === classe;
      return matchesText && matchesClass;
    });
  }, [search, classe]);

  const stats = useMemo(() => {
    const totalBalance = filtered.reduce((sum, s) => sum + s.balance, 0);
    const totalReceived = filtered.reduce((sum, s) => sum + s.totalReceived, 0);
    const totalSpent = filtered.reduce((sum, s) => sum + s.totalSpent, 0);
    const positive = filtered.filter(s => s.balance > 0).length;
    const negative = filtered.filter(s => s.balance < 0).length;

    return {
      totalBalance,
      totalReceived,
      totalSpent,
      average: filtered.length > 0 ? Math.round(totalBalance / filtered.length) : 0,
      positive,
      negative,
      students: filtered.length
    };
  }, [filtered]);

  const handleExportar = () => {
    if (filtered.length === 0) {
      alert("Nenhum dado para exportar");
      return;
    }

    const csv = [
      "Nome,Email,Turma,Saldo Atual,Total Recebido,Total Gasto,Última Transação",
      ...filtered.map((s) => 
        `"${s.name}","${s.email}","${s.class}",${s.balance},${s.totalReceived},${s.totalSpent},"${new Date(s.lastTransaction).toLocaleDateString()}"`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-saldos-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleViewHistory = (student: StudentBalance) => {
    setSelectedStudent(student);
  };

  const handleShowGraphs = () => {
    window.location.href = "/adm/moedas-graficos";
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Dialogs */}
        <StudentHistoryDialog
          open={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          studentName={selectedStudent?.name || ""}
          studentBalance={selectedStudent?.balance || 0}
        />

        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link 
                href="/adm/moedas"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Controle de Saldos</h1>
            </div>
            <p className="text-gray-600">
              Visualize relatórios completos, histórico de movimentações e saldos por aluno
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-lg inline-flex items-center gap-2" onClick={handleExportar}>
              <Download className="h-4 w-4" /> Exportar Relatório
            </Button>
            <Button className="rounded-lg inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleShowGraphs}>
              <BarChart3 className="h-4 w-4" /> Gráficos Detalhados
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl border-0 bg-gradient-to-br from-blue-50 to-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Saldo Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalBalance.toLocaleString()} <span className="text-sm font-normal text-gray-500">moedas</span>
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0 bg-gradient-to-br from-green-50 to-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Distribuído</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalReceived.toLocaleString()} <span className="text-sm font-normal text-gray-500">moedas</span>
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0 bg-gradient-to-br from-red-50 to-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Gasto</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalSpent.toLocaleString()} <span className="text-sm font-normal text-gray-500">moedas</span>
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0 bg-gradient-to-br from-purple-50 to-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Média por Aluno</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.average} <span className="text-sm font-normal text-gray-500">moedas</span>
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-xl shadow-sm border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Saldos Positivos</p>
                  <p className="text-xl font-bold text-gray-900">{stats.positive} alunos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Saldos Negativos</p>
                  <p className="text-xl font-bold text-gray-900">{stats.negative} alunos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total de Alunos</p>
                  <p className="text-xl font-bold text-gray-900">{stats.students}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Buscar por nome, email ou turma..." 
                    className="input-field rounded-lg pl-10" 
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={classe} onValueChange={setClasse}>
                  <SelectTrigger className="rounded-lg bg-white min-w-[140px]">
                    <SelectValue placeholder="Turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as turmas</SelectItem>
                    <SelectItem value="1º A">1º A</SelectItem>
                    <SelectItem value="1º B">1º B</SelectItem>
                    <SelectItem value="2º A">2º A</SelectItem>
                    <SelectItem value="2º B">2º B</SelectItem>
                    <SelectItem value="3º A">3º A</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger className="rounded-lg bg-white min-w-[160px]">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Período Atual</SelectItem>
                    <SelectItem value="last-month">Último Mês</SelectItem>
                    <SelectItem value="last-semester">Último Semestre</SelectItem>
                    <SelectItem value="all-time">Todo Período</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Aluno
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Turma
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Saldo Atual
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Recebido
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Gasto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Última Transação
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{student.class}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${
                          student.status === "positive" 
                            ? "bg-green-100 text-green-700" 
                            : student.status === "negative"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {student.balance > 0 ? "+" : ""}{student.balance}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        +{student.totalReceived}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        -{student.totalSpent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.lastTransaction).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleViewHistory(student)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Ver Histórico
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum aluno encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
