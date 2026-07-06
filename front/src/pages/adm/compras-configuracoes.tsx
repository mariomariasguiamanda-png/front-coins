import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmBackButton } from "@/components/adm/AdmBackButton";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Settings, DollarSign, AlertCircle, Save, Users, Coins } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";

type ConfigDisciplina = {
  id_disciplina: number;
  nome: string;
  pontos_por_compra_max: number;
  preco_moedas_por_ponto: number;
  total_alunos: number;
  moedas_circulacao: number;
};

export default function ComprasConfiguracoesPage() {
  const { show } = useToast();
  const [configs, setConfigs] = useState<ConfigDisciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvandoId, setSalvandoId] = useState<number | null>(null);

  const carregar = async () => {
    try {
      const data = await api.get("/admin/moedas/config-precos");
      setConfigs(data ?? []);
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const atualizarLocal = (id: number, campo: "pontos_por_compra_max" | "preco_moedas_por_ponto", valor: number) => {
    setConfigs((prev) =>
      prev.map((c) => (c.id_disciplina === id ? { ...c, [campo]: Math.max(1, valor) } : c)),
    );
  };

  const salvar = async (config: ConfigDisciplina) => {
    try {
      setSalvandoId(config.id_disciplina);
      await api.put("/admin/moedas/config-preco", {
        id_disciplina: String(config.id_disciplina),
        pontos_por_compra_max: config.pontos_por_compra_max,
        preco_moedas_por_ponto: config.preco_moedas_por_ponto,
      });
      show({ variant: "success", title: `Configuração de ${config.nome} salva!` });
    } catch (err: any) {
      console.error(err);
      show({ variant: "error", title: err?.message ?? "Erro ao salvar" });
    } finally {
      setSalvandoId(null);
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Configurações de Compras</h1>
                <p className="text-gray-600 mt-1">
                  Preço e limite da compra de pontos, por disciplina
                </p>
              </div>
            </div>
            <AdmBackButton href="/adm/compras" className="no-underline" />
          </div>
        </header>

        {/* Alert Info */}
        <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Importante</h4>
                <p className="text-sm text-gray-600">
                  Essas são as mesmas configurações que os professores veem em "Configurar Pontos".
                  As alterações valem para novas compras; transações já realizadas não mudam.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configs por disciplina */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl"></div>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Limites e Conversão por Disciplina</h3>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground py-6 text-center">Carregando...</p>
            ) : configs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Nenhuma disciplina ativa encontrada.
              </p>
            ) : (
              <div className="grid gap-4">
                {configs.map((c) => (
                  <Card key={c.id_disciplina} className="rounded-lg border-2 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-[200px]">
                          <p className="font-semibold text-gray-900">{c.nome}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3 w-3" /> {c.total_alunos} alunos
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Coins className="h-3 w-3" /> {c.moedas_circulacao} moedas em circulação
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-end gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">
                              Máx. pontos por compra
                            </label>
                            <Input
                              type="number"
                              min={1}
                              value={c.pontos_por_compra_max}
                              onChange={(e) =>
                                atualizarLocal(c.id_disciplina, "pontos_por_compra_max", Number(e.target.value))
                              }
                              className="rounded-lg w-32 text-center font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">
                              Moedas por ponto
                            </label>
                            <Input
                              type="number"
                              min={1}
                              value={c.preco_moedas_por_ponto}
                              onChange={(e) =>
                                atualizarLocal(c.id_disciplina, "preco_moedas_por_ponto", Number(e.target.value))
                              }
                              className="rounded-lg w-32 text-center font-semibold"
                            />
                          </div>
                          <Button
                            className="rounded-lg inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                            onClick={() => salvar(c)}
                            disabled={salvandoId === c.id_disciplina}
                          >
                            <Save className="h-4 w-4" />
                            {salvandoId === c.id_disciplina ? "Salvando..." : "Salvar"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
