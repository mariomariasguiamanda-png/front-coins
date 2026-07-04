import { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmBackButton } from "@/components/adm/AdmBackButton";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import {
  Settings,
  DollarSign,
  Shield,
  AlertCircle,
  Save,
  RotateCcw,
  Coins,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function ComprasConfiguracoesPage() {
  const { show } = useToast();
  const [limitePontosPorCompra, setLimitePontosPorCompra] = useState<number>(5);
  const [taxaConversao, setTaxaConversao] = useState<number>(10);
  const [permiteCancelamentoSemJustificativa, setPermiteCancelamentoSemJustificativa] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simular save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    show({ variant: "success", title: "Configurações salvas com sucesso!" });
  };

  const handleReset = () => {
    setLimitePontosPorCompra(5);
    setTaxaConversao(10);
    setPermiteCancelamentoSemJustificativa(false);
    show({ variant: "success", title: "Configurações redefinidas para os valores padrão" });
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
                <p className="text-gray-600 mt-1">Regras, limites e políticas de troca</p>
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
                  As alterações nas configurações afetarão todas as novas transações. Transações já realizadas não serão modificadas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limites e Conversão */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl"></div>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Limites e Conversão</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Limite de pontos por compra
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={limitePontosPorCompra}
                  onChange={(e) => setLimitePontosPorCompra(Math.max(1, Number(e.target.value)))}
                  className="rounded-lg"
                />
                <p className="text-xs text-gray-500">
                  Máximo de pontos que podem ser comprados em uma única transação
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">Taxa de conversão (<Coins className="h-4 w-4" />/ponto)</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={taxaConversao}
                  onChange={(e) => setTaxaConversao(Math.max(1, Number(e.target.value)))}
                  className="rounded-lg"
                />
                <p className="text-xs text-gray-500">
                  Quantas moedas são necessárias para comprar 1 ponto
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Políticas de Cancelamento */}
        <Card className="rounded-xl shadow-sm">
          <div className="h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-t-xl"></div>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Políticas de Cancelamento</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700 cursor-pointer">
                    Permitir cancelamento sem justificativa
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Se desativado, será obrigatório fornecer uma justificativa ao cancelar
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={permiteCancelamentoSemJustificativa}
                    onChange={(e) => setPermiteCancelamentoSemJustificativa(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            className="rounded-lg inline-flex items-center gap-2"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            Redefinir
          </Button>
          <Button
            className="rounded-lg inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            onClick={handleSave}
            disabled={saving}
            isLoading={saving}
          >
            <Save className="h-4 w-4" />
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
