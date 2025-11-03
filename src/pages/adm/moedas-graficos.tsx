import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

interface ClassBalance {
  class: string;
  totalBalance: number;
  students: number;
  average: number;
}

interface TopStudent {
  name: string;
  class: string;
  balance: number;
}

interface MonthlyData {
  month: string;
  received: number;
  spent: number;
  balance: number;
}

export default function MoedasGraficosPage() {
  const [periodo, setPeriodo] = useState<string>("current");

  // Mock data - substituir por dados reais da API
  const classesSaldo: ClassBalance[] = [
    { class: "1º A", totalBalance: 12500, students: 25, average: 500 },
    { class: "1º B", totalBalance: 11200, students: 24, average: 467 },
    { class: "2º A", totalBalance: 15800, students: 26, average: 608 },
    { class: "2º B", totalBalance: 13400, students: 25, average: 536 },
    { class: "3º A", totalBalance: 18900, students: 28, average: 675 },
  ];

  const topPositivos: TopStudent[] = [
    { name: "Carlos Mendes", class: "3º A", balance: 680 },
    { name: "João Silva", class: "1º A", balance: 450 },
    { name: "Ana Costa", class: "2º B", balance: 420 },
    { name: "Pedro Santos", class: "2º A", balance: 380 },
    { name: "Maria Oliveira", class: "1º B", balance: 350 },
    { name: "Lucas Ferreira", class: "3º A", balance: 320 },
    { name: "Julia Lima", class: "2º A", balance: 310 },
    { name: "Rafael Costa", class: "1º A", balance: 290 },
    { name: "Beatriz Alves", class: "2º B", balance: 280 },
    { name: "Gabriel Silva", class: "3º A", balance: 270 },
  ];

  const topNegativos: TopStudent[] = [
    { name: "Pedro Oliveira", class: "2º A", balance: -50 },
    { name: "Marcos Santos", class: "1º B", balance: -30 },
    { name: "Laura Costa", class: "3º A", balance: -20 },
    { name: "Felipe Souza", class: "2º B", balance: -15 },
    { name: "Camila Lima", class: "1º A", balance: -10 },
  ];

  const evolucaoMensal: MonthlyData[] = [
    { month: "Jun", received: 25000, spent: 18000, balance: 7000 },
    { month: "Jul", received: 28000, spent: 21000, balance: 14000 },
    { month: "Ago", received: 32000, spent: 24000, balance: 22000 },
    { month: "Set", received: 30000, spent: 26000, balance: 26000 },
    { month: "Out", received: 35000, spent: 28000, balance: 33000 },
    { month: "Nov", received: 38000, spent: 30000, balance: 41000 },
  ];

  const maxBalance = Math.max(...classesSaldo.map(c => c.totalBalance));
  const maxTopBalance = Math.max(...topPositivos.map(s => s.balance));
  const maxNegBalance = Math.abs(Math.min(...topNegativos.map(s => s.balance)));
  const maxEvolution = Math.max(...evolucaoMensal.map(m => Math.max(m.received, m.spent)));

  const totais = useMemo(() => {
    const totalReceived = evolucaoMensal.reduce((sum, m) => sum + m.received, 0);
    const totalSpent = evolucaoMensal.reduce((sum, m) => sum + m.spent, 0);
    const currentBalance = evolucaoMensal[evolucaoMensal.length - 1]?.balance || 0;
    
    return { totalReceived, totalSpent, currentBalance };
  }, []);

  const handleExportar = async () => {
    try {
      // Simples geração de relatório em formato de impressão
      // Para produção, considere usar bibliotecas como jsPDF ou pdfmake
      
      const data = `
RELATÓRIO DE GRÁFICOS DETALHADOS
Data: ${new Date().toLocaleDateString('pt-BR')}
Período: ${periodo === 'current' ? 'Período Atual' : periodo === 'last-month' ? 'Último Mês' : periodo === 'last-semester' ? 'Último Semestre' : 'Todo Período'}

===========================================
RESUMO GERAL
===========================================
Total Recebido: ${totais.totalReceived.toLocaleString()}
Total Gasto: ${totais.totalSpent.toLocaleString()}
Saldo Atual: ${totais.currentBalance.toLocaleString()}
Taxa de Utilização: ${((totais.totalSpent / totais.totalReceived) * 100).toFixed(1)}%

===========================================
DISTRIBUIÇÃO POR TURMA
===========================================
${classesSaldo.map(c => `${c.class}: ${c.totalBalance.toLocaleString()} (${c.students} alunos, média: ${c.average})`).join('\n')}

===========================================
TOP 10 MAIORES SALDOS
===========================================
${topPositivos.map((s, i) => `${i + 1}º - ${s.name} (${s.class}): +${s.balance}`).join('\n')}

===========================================
TOP 5 MENORES SALDOS
===========================================
${topNegativos.map((s, i) => `${i + 1}º - ${s.name} (${s.class}): ${s.balance}`).join('\n')}

===========================================
EVOLUÇÃO MENSAL
===========================================
${evolucaoMensal.map(m => `${m.month}: Recebido ${m.received.toLocaleString()}, Gasto ${m.spent.toLocaleString()}, Saldo ${m.balance.toLocaleString()}`).join('\n')}
      `.trim();

      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `graficos-detalhados-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      
      // Abrir diálogo de impressão para PDF
      setTimeout(() => {
        window.print();
      }, 500);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    }
  };

  return (
    <AdminLayout>
      <style jsx>{`
        @media print {
          header button,
          header select,
          nav,
          aside {
            display: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link 
                href="/adm/moedas-relatorio-saldos"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Gráficos Detalhados</h1>
            </div>
            <p className="text-gray-600">
              Análise visual completa de saldos, distribuição e evolução temporal
            </p>
          </div>
          <div className="flex gap-2 no-print">
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
            <Button variant="outline" className="rounded-lg flex flex-row items-center gap-2 whitespace-nowrap" onClick={handleExportar}>
              <Download className="h-4 w-4" />
              <span>Exportar PDF</span>
            </Button>
          </div>
        </header>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-xl border-0 bg-gradient-to-br from-green-50 to-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Recebido</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {totais.totalReceived.toLocaleString()}
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
                    {totais.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0 bg-gradient-to-br from-blue-50 to-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Saldo Atual</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {totais.currentBalance.toLocaleString()}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 1. Distribuição por Turma */}
          <Card className="rounded-xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <PieChart className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Distribuição de Saldos por Turma</h3>
              </div>
              <div className="space-y-3">
                {classesSaldo.map((item) => (
                  <div key={item.class} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{item.class}</span>
                        <span className="text-xs text-gray-500">({item.students} alunos)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          Média: {item.average}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {item.totalBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${(item.totalBalance / maxBalance) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 2. Evolução Temporal */}
          <Card className="rounded-xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Evolução Temporal dos Saldos</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600">Recebido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-gray-600">Gasto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-gray-600">Saldo</span>
                  </div>
                </div>
                <div className="relative h-64 flex items-end justify-between gap-2">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="border-t border-gray-100" />
                    ))}
                  </div>
                  
                  {/* Bars */}
                  {evolucaoMensal.map((month, idx) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-1 relative">
                      <div className="w-full flex gap-0.5 items-end h-52">
                        <div 
                          className="flex-1 bg-green-400 rounded-t transition-all duration-500 hover:bg-green-500 group relative"
                          style={{ height: `${(month.received / maxEvolution) * 100}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {month.received.toLocaleString()}
                          </div>
                        </div>
                        <div 
                          className="flex-1 bg-red-400 rounded-t transition-all duration-500 hover:bg-red-500 group relative"
                          style={{ height: `${(month.spent / maxEvolution) * 100}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {month.spent.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600 mt-1">{month.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Top 10 Maiores Saldos */}
          <Card className="rounded-xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Top 10 Maiores Saldos</h3>
              </div>
              <div className="space-y-2">
                {topPositivos.map((student, idx) => (
                  <div key={student.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? "bg-yellow-100 text-yellow-700" :
                      idx === 1 ? "bg-gray-100 text-gray-700" :
                      idx === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-gray-50 text-gray-600"
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.class}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                          style={{ width: `${(student.balance / maxTopBalance) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-green-600 min-w-[60px] text-right">
                        +{student.balance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 4. Top 5 Menores Saldos */}
          <Card className="rounded-xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Top 5 Menores Saldos</h3>
              </div>
              <div className="space-y-2">
                {topNegativos.map((student, idx) => (
                  <div key={student.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center font-bold text-sm text-red-600">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.class}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                          style={{ width: `${(Math.abs(student.balance) / maxNegBalance) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-red-600 min-w-[60px] text-right">
                        {student.balance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Alert */}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  <strong>Atenção:</strong> {topNegativos.length} aluno(s) com saldo negativo. 
                  Considere realizar ajustes ou verificar situações individuais.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparativo Receitas vs Gastos */}
        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Comparativo de Receitas vs Gastos</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Recebido</span>
                  <span className="text-2xl font-bold text-green-600">
                    {totais.totalReceived.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Gasto</span>
                  <span className="text-2xl font-bold text-red-600">
                    {totais.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full" 
                    style={{ width: `${(totais.totalSpent / totais.totalReceived) * 100}%` }} 
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Utilização</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Percentual de moedas gastas em relação ao total distribuído
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-600">
                    {((totais.totalSpent / totais.totalReceived) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {totais.currentBalance.toLocaleString()} em circulação
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
