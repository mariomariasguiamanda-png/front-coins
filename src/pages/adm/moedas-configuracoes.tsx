import { useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { 
  Settings, 
  Save, 
  Info, 
  ChevronLeft, 
  Award,
  BookOpen,
  ListChecks,
  TrendingUp,
  Clock,
  Shield,
  AlertCircle
} from "lucide-react";
import { createLog } from "@/services/api/logs";

interface RegrasDistribuicao {
  atividadeEntregue: number;
  atividadeNotaMaxima: number;
  resumoPostado: number;
  quizConcluido: number;
  limiteAluno: number;
  periodoDias: number;
}

const mockRegras: RegrasDistribuicao = {
  atividadeEntregue: 10,
  atividadeNotaMaxima: 20,
  resumoPostado: 15,
  quizConcluido: 25,
  limiteAluno: 500,
  periodoDias: 180,
};

export default function MoedasConfiguracoesPage() {
  const [regras, setRegras] = useState<RegrasDistribuicao>(mockRegras);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    createLog({
      usuarioNome: "Administrador (sessão)",
      usuarioPerfil: "Administrador",
      acao: `Atualizou regras de distribuição: ${JSON.stringify(regras)}`,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const totalPorPeriodo = regras.atividadeEntregue + regras.atividadeNotaMaxima + regras.resumoPostado + regras.quizConcluido;

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Regras e Limites</h1>
                <p className="text-gray-600 mt-1">
                  Configure as regras de distribuição automática de moedas
                </p>
              </div>
            </div>
            <a href="/adm/moedas" className="no-underline">
              <Button variant="outline" className="rounded-lg inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Voltar ao hub
              </Button>
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Limite por Aluno</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{regras.limiteAluno}</p>
                    <p className="text-xs text-gray-500 mt-1">moedas/período</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duração do Período</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{regras.periodoDias}</p>
                    <p className="text-xs text-gray-500 mt-1">dias</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total por Ação</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalPorPeriodo}</p>
                    <p className="text-xs text-gray-500 mt-1">moedas possíveis</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Regras Ativas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
                    <p className="text-xs text-gray-500 mt-1">tipos de ação</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <ListChecks className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Alert Card */}
        <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Informações Importantes</h4>
                <p className="text-sm text-gray-600">
                  Essas regras afetam todos os alunos e turmas do sistema. As mudanças entram em vigor
                  imediatamente após salvar. O limite por aluno é resetado a cada novo período.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Configuration Card */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl"></div>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Regras de Distribuição Automática</h2>
              <p className="text-sm text-gray-600">
                Defina quantas moedas serão atribuídas automaticamente para cada tipo de ação realizada pelos alunos.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Atividade Entregue */}
              <Card className="rounded-lg border-2 border-gray-200 hover:border-green-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <ListChecks className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="atividadeEntregue" className="text-base font-semibold text-gray-900">
                        Atividade Entregue
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">Quando o aluno entrega uma atividade no prazo</p>
                    </div>
                  </div>
                  <Input
                    id="atividadeEntregue"
                    type="number"
                    value={regras.atividadeEntregue}
                    onChange={(e) => setRegras((r) => ({ ...r, atividadeEntregue: Number(e.target.value) }))}
                    className="text-lg font-bold text-center"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">moedas por entrega</p>
                </CardContent>
              </Card>

              {/* Atividade com Nota Máxima */}
              <Card className="rounded-lg border-2 border-gray-200 hover:border-amber-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="atividadeNotaMaxima" className="text-base font-semibold text-gray-900">
                        Nota Máxima
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">Quando o aluno atinge nota máxima na atividade</p>
                    </div>
                  </div>
                  <Input
                    id="atividadeNotaMaxima"
                    type="number"
                    value={regras.atividadeNotaMaxima}
                    onChange={(e) => setRegras((r) => ({ ...r, atividadeNotaMaxima: Number(e.target.value) }))}
                    className="text-lg font-bold text-center"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">moedas por nota máxima</p>
                </CardContent>
              </Card>

              {/* Resumo Postado */}
              <Card className="rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="resumoPostado" className="text-base font-semibold text-gray-900">
                        Resumo Postado
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">Quando o aluno posta um resumo de aula</p>
                    </div>
                  </div>
                  <Input
                    id="resumoPostado"
                    type="number"
                    value={regras.resumoPostado}
                    onChange={(e) => setRegras((r) => ({ ...r, resumoPostado: Number(e.target.value) }))}
                    className="text-lg font-bold text-center"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">moedas por resumo</p>
                </CardContent>
              </Card>

              {/* Quiz Concluído */}
              <Card className="rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="quizConcluido" className="text-base font-semibold text-gray-900">
                        Quiz Concluído
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">Quando o aluno completa um quiz</p>
                    </div>
                  </div>
                  <Input
                    id="quizConcluido"
                    type="number"
                    value={regras.quizConcluido}
                    onChange={(e) => setRegras((r) => ({ ...r, quizConcluido: Number(e.target.value) }))}
                    className="text-lg font-bold text-center"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">moedas por quiz</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Limites Card */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Limites e Períodos</h2>
              <p className="text-sm text-gray-600">
                Configure os limites máximos e a duração dos períodos de acúmulo de moedas.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="limiteAluno" className="text-base font-semibold text-gray-900">
                        Limite por Aluno
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">Máximo de moedas que um aluno pode ganhar por período</p>
                    </div>
                  </div>
                  <Input
                    id="limiteAluno"
                    type="number"
                    value={regras.limiteAluno}
                    onChange={(e) => setRegras((r) => ({ ...r, limiteAluno: Number(e.target.value) }))}
                    className="text-lg font-bold text-center"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">moedas por período</p>
                </CardContent>
              </Card>

              <Card className="rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="periodoDias" className="text-base font-semibold text-gray-900">
                        Duração do Período
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">Quantos dias dura cada período de acúmulo</p>
                    </div>
                  </div>
                  <Input
                    id="periodoDias"
                    type="number"
                    value={regras.periodoDias}
                    onChange={(e) => setRegras((r) => ({ ...r, periodoDias: Number(e.target.value) }))}
                    className="text-lg font-bold text-center"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">dias</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4" />
            As alterações entram em vigor imediatamente após salvar
          </div>
          <Button
            className="rounded-lg inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            {saved ? "Salvo com sucesso!" : "Salvar Configurações"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
