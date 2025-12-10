"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import {
  Calculator,
  BookOpen,
  ScrollText,
  Atom,
  Palette,
  Zap,
  ShoppingCart,
  ArrowRight,
  AlertCircle,
  Globe2,
  Flame,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Dados das disciplinas (visual + idDisciplina para a RPC comprar_pontos)
const disciplinasData = {
  mat: {
    idDisciplina: 1,
    nome: "Matemática",
    icon: Calculator,
    gradient: "from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-500/10",
    color: "#3B82F6",
  },
  port: {
    idDisciplina: null,
    nome: "Português",
    icon: BookOpen,
    gradient: "from-green-500 to-green-600",
    textColor: "text-green-600",
    bgColor: "bg-green-500/10",
    color: "#22C55E",
  },
  hist: {
    idDisciplina: 2,
    nome: "História",
    icon: ScrollText,
    gradient: "from-amber-500 to-amber-600",
    textColor: "text-amber-600",
    bgColor: "bg-amber-500/10",
    color: "#F59E0B",
  },
  bio: {
    idDisciplina: 3,
    nome: "Biologia",
    icon: Atom,
    gradient: "from-emerald-500 to-emerald-600",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    color: "#10B981",
  },
  art: {
    idDisciplina: 6,
    nome: "Artes",
    icon: Palette,
    gradient: "from-pink-500 to-pink-600",
    textColor: "text-pink-600",
    bgColor: "bg-pink-500/10",
    color: "#EC4899",
  },
  fis: {
    idDisciplina: 4,
    nome: "Física",
    icon: Zap,
    gradient: "from-violet-500 to-violet-600",
    textColor: "text-violet-600",
    bgColor: "bg-violet-500/10",
    color: "#8B5CF6",
  },
  geo: {
    idDisciplina: null,
    nome: "Geografia",
    icon: Globe2,
    gradient: "from-teal-500 to-teal-600",
    textColor: "text-teal-600",
    bgColor: "bg-teal-500/10",
    color: "#14B8A6",
  },
  qui: {
    idDisciplina: null,
    nome: "Química",
    icon: Flame,
    gradient: "from-orange-500 to-red-500",
    textColor: "text-orange-600",
    bgColor: "bg-orange-500/10",
    color: "#F97316",
  },
};

type ConfigDisciplina = {
  id_disciplina: number;
  codigo_disciplina: string;
};

export default function ConfirmarCompra() {
  const router = useRouter();
  const { disciplina, pontos, total } = router.query;

  const [mounted, setMounted] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [erroApi, setErroApi] = useState<string | null>(null);

  // 🔹 saldo total do aluno (mesma fonte do card da listagem)
  const [saldoAtual, setSaldoAtual] = useState<number>(0);
  const [carregandoSaldo, setCarregandoSaldo] = useState(true);

  // 🔹 id real da disciplina vindo da config (evita hardcode)
  const [idDisciplinaConfig, setIdDisciplinaConfig] = useState<number | null>(
    null
  );
  const [carregandoIdDisciplina, setCarregandoIdDisciplina] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Carrega saldo total via get_total_moedas_aluno (mesma função do código que você mandou)
  useEffect(() => {
    if (!mounted) return;

    const carregarSaldoTotal = async () => {
      const { data, error } = await supabase.rpc("get_total_moedas_aluno");

      if (error) {
        console.error("Erro ao buscar saldo total (confirmar):", error);
        setSaldoAtual(0);
        setCarregandoSaldo(false);
        return;
      }

      let valor = 0;
      if (typeof data === "number") {
        valor = data;
      } else if (Array.isArray(data)) {
        valor = data.reduce(
          (acc, item) => acc + (typeof item === "number" ? item : 0),
          0
        );
      } else if (data && typeof data === "object") {
        const maybeTotal = (data as any).total;
        if (typeof maybeTotal === "number") {
          valor = maybeTotal;
        }
      }

      setSaldoAtual(valor);
      setCarregandoSaldo(false);
    };

    carregarSaldoTotal();
  }, [mounted]);

  // Busca o id da disciplina via RPC para não depender do mapa local
  useEffect(() => {
    if (!mounted || typeof disciplina !== "string") return;

    const carregarIdDisciplina = async () => {
      const { data, error } = await supabase.rpc(
        "get_config_compra_pontos_por_aluno"
      );

      if (error) {
        console.error("Erro ao buscar id da disciplina (confirmar):", error);
        setCarregandoIdDisciplina(false);
        return;
      }

      const listaCfg = (data ?? []) as ConfigDisciplina[];
      const itemCfg = listaCfg.find(
        (cfg) =>
          cfg.codigo_disciplina.toLowerCase() === disciplina.toLowerCase()
      );

      setIdDisciplinaConfig(itemCfg?.id_disciplina ?? null);
      setCarregandoIdDisciplina(false);
    };

    carregarIdDisciplina();
  }, [mounted, disciplina]);

  if (!mounted || typeof disciplina !== "string") {
    return null;
  }

  const disciplinaData =
    disciplinasData[disciplina as keyof typeof disciplinasData];

  const pontosNum = Number(pontos);
  const totalNum = Number(total);
  const precoUnitario = pontosNum > 0 ? totalNum / pontosNum : 0;

  if (!disciplinaData || !pontos || !total) {
    return (
      <AlunoLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900">Dados inválidos</h1>
        </div>
      </AlunoLayout>
    );
  }

  const IconComponent = disciplinaData.icon;

  // 🔹 agora o saldo vem da mesma função da listagem
  const saldoAntes = saldoAtual;
  const saldoDepoisEstimado = Math.max(saldoAntes - totalNum, 0);

  const handleConfirmar = async () => {
    setErroApi(null);

    const idParaCompra = idDisciplinaConfig ?? disciplinaData.idDisciplina;

    if (!idParaCompra) {
      setErroApi(
        "Esta disciplina ainda não está configurada para compras no sistema. Fale com o administrador."
      );
      return;
    }

    try {
      setConfirmando(true);

      const { data, error } = await supabase.rpc("comprar_pontos", {
        p_id_disciplina: idParaCompra,
        p_pontos: pontosNum,
      });

      if (error) {
        console.error("Erro ao comprar pontos:", error);
        setErroApi(error.message || "Erro ao processar a compra.");
        setConfirmando(false);
        return;
      }

      const result = Array.isArray(data) ? data[0] : data;

      if (!result) {
        setErroApi("Não foi possível obter o resultado da compra.");
        setConfirmando(false);
        return;
      }

      const { pontos_comprados, moedas_gastas, saldo_antes, saldo_depois } =
        result as {
          pontos_comprados: number;
          moedas_gastas: number;
          saldo_antes: number;
          saldo_depois: number;
        };

      router.push(
        `/aluno/comprar-pontos/${disciplina}/sucesso?pontos=${pontos_comprados}&total=${moedas_gastas}&saldoAntes=${saldo_antes}&saldoDepois=${saldo_depois}`
      );
    } catch (err: any) {
      console.error(err);
      setErroApi("Erro inesperado ao processar a compra.");
      setConfirmando(false);
    }
  };

  return (
    <AlunoLayout>
      <div className="page-enter space-y-6 max-w-2xl mx-auto">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4 mb-6">
          <BackButton color={disciplinaData.color} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Confirmar Compra
            </h1>
            <p className="text-gray-600">
              Revise os detalhes antes de prosseguir
            </p>
          </div>
        </div>

        {/* Card de confirmação */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Cabeçalho da confirmação */}
            <div className="text-center space-y-2">
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="h-8 w-8 text-violet-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Confirme sua compra
              </h2>
            </div>

            {/* Card da disciplina com SALDO REAL (mesma fonte da listagem) */}
            <div
              className={`bg-gradient-to-r ${disciplinaData.gradient} text-white rounded-2xl p-6 flex justify-between items-center shadow-lg`}
            >
              <div>
                <h3 className="text-xl font-bold mb-3">
                  {disciplinaData.nome}
                </h3>
                <div className="space-y-1 text-sm opacity-90">
                  <p>
                    Saldo antes:{" "}
                    {carregandoSaldo
                      ? "Carregando..."
                      : `${saldoAntes.toLocaleString("pt-BR")} moedas`}
                  </p>
                  <p>
                    Saldo após (estimado):{" "}
                    {carregandoSaldo
                      ? "Carregando..."
                      : `${saldoDepoisEstimado.toLocaleString("pt-BR")} moedas`}
                  </p>
                </div>
              </div>
              <IconComponent className="h-10 w-10 opacity-80" />
            </div>

            {/* Detalhes da compra */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">
                📋 Resumo da Compra
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Disciplina:</span>
                  <span className="font-semibold">{disciplinaData.nome}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pontos a comprar:</span>
                  <span className="font-semibold">{pontosNum} pontos</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Preço unitário:</span>
                  <span className="font-semibold">{precoUnitario} moedas</span>
                </div>

                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-900">
                    Total estimado:
                  </span>
                  <span
                    className={`font-bold text-lg ${disciplinaData.textColor}`}
                  >
                    {totalNum} moedas
                  </span>
                </div>
              </div>
            </div>

            {/* Erro da API */}
            {erroApi && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700 text-sm whitespace-pre-line">
                  {erroApi}
                </span>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex-1 h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                disabled={confirmando}
              >
                Voltar
              </Button>

              <Button
                onClick={handleConfirmar}
                disabled={confirmando || carregandoIdDisciplina}
                className={`flex-1 h-12 text-lg font-semibold rounded-xl smooth-transition bg-gradient-to-r ${disciplinaData.gradient} hover:opacity-90 text-white flex items-center justify-center gap-2`}
              >
                {carregandoIdDisciplina ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Carregando...
                  </>
                ) : confirmando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Confirmar Compra
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AlunoLayout>
  );
}
