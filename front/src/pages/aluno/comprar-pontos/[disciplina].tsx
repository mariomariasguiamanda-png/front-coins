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
  AlertCircle,
  Globe2,
  Flame,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Dados visuais das disciplinas (cores/ícone) + fallback de preço/saldo
const disciplinasData = {
  mat: {
    nome: "Matemática",
    icon: Calculator,
    gradient: "from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-500/10",
    color: "#3B82F6",
    precoMoedas: 750, // Fallback (não será mais o valor principal)
    saldoAtual: 1200,
  },
  port: {
    nome: "Português",
    icon: BookOpen,
    gradient: "from-green-500 to-green-600",
    textColor: "text-green-600",
    bgColor: "bg-green-500/10",
    color: "#22C55E",
    precoMoedas: 600,
    saldoAtual: 850,
  },
  hist: {
    nome: "História",
    icon: ScrollText,
    gradient: "from-amber-500 to-amber-600",
    textColor: "text-amber-600",
    bgColor: "bg-amber-500/10",
    color: "#F59E0B",
    precoMoedas: 700,
    saldoAtual: 950,
  },
  bio: {
    nome: "Biologia",
    icon: Atom,
    gradient: "from-emerald-500 to-emerald-600",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    color: "#10B981",
    precoMoedas: 800,
    saldoAtual: 1100,
  },
  art: {
    nome: "Artes",
    icon: Palette,
    gradient: "from-pink-500 to-pink-600",
    textColor: "text-pink-600",
    bgColor: "bg-pink-500/10",
    color: "#EC4899",
    precoMoedas: 500,
    saldoAtual: 650,
  },
  fis: {
    nome: "Física",
    icon: Zap,
    gradient: "from-violet-500 to-violet-600",
    textColor: "text-violet-600",
    bgColor: "bg-violet-500/10",
    color: "#8B5CF6",
    precoMoedas: 900,
    saldoAtual: 1300,
  },
  geo: {
    nome: "Geografia",
    icon: Globe2,
    gradient: "from-teal-500 to-teal-600",
    textColor: "text-teal-600",
    bgColor: "bg-teal-500/10",
    color: "#14B8A6",
    precoMoedas: 700,
    saldoAtual: 800,
  },
  qui: {
    nome: "Química",
    icon: Flame,
    gradient: "from-orange-500 to-red-500",
    textColor: "text-orange-600",
    bgColor: "bg-orange-500/10",
    color: "#F97316",
    precoMoedas: 750,
    saldoAtual: 900,
  },
};

type ConfigDisciplina = {
  id_disciplina: number;
  codigo_disciplina: string;
  nome_disciplina: string;
  pontos: number;
  preco_moedas: number;
};

export default function ComprarPontosDisciplina() {
  const router = useRouter();
  const { disciplina } = router.query;

  const [pontos, setPontos] = useState(1);
  const [erro, setErro] = useState("");
  const [mounted, setMounted] = useState(false);

  const [saldoAtual, setSaldoAtual] = useState<number | null>(null);
  const [carregandoSaldo, setCarregandoSaldo] = useState(true);

  const [precoPorPonto, setPrecoPorPonto] = useState<number | null>(null);
  const [carregandoPreco, setCarregandoPreco] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Carregar saldo por disciplina + preço real da tabela config_compra_pontos
  useEffect(() => {
    if (!mounted || typeof disciplina !== "string") return;

    const codigo = disciplina.toLowerCase();
    const metaDisciplina =
      disciplinasData[disciplina as keyof typeof disciplinasData];

    const carregarDados = async () => {
      // 1) Saldo por disciplina (view/mecanismo que você já tem)
      const { data: saldoData, error: saldoError } = await supabase.rpc(
        "get_moedas_por_disciplina_compra"
      );

      if (saldoError) {
        console.error("Erro ao buscar saldo:", saldoError);
        setSaldoAtual(metaDisciplina?.saldoAtual ?? 0);
      } else {
        const listaSaldo = (saldoData ?? []) as {
          codigo_disciplina: string;
          moedas_disponiveis: number;
        }[];

        const itemSaldo = listaSaldo.find(
          (d) => d.codigo_disciplina.toLowerCase() === codigo
        );
        setSaldoAtual(itemSaldo?.moedas_disponiveis ?? 0);
      }
      setCarregandoSaldo(false);

      // 2) Preço por ponto vindo da config_compra_pontos
      const { data: cfgData, error: cfgError } = await supabase.rpc(
        "get_config_compra_pontos_por_aluno"
      );

      if (cfgError) {
        console.error("Erro ao buscar config de compra:", cfgError);
        setPrecoPorPonto(metaDisciplina?.precoMoedas ?? 0);
        setCarregandoPreco(false);
        return;
      }

      const listaCfg = (cfgData ?? []) as ConfigDisciplina[];

      const itemCfg = listaCfg.find(
        (c) => c.codigo_disciplina.toLowerCase() === codigo
      );

      setPrecoPorPonto(
        itemCfg?.preco_moedas ?? metaDisciplina?.precoMoedas ?? 0
      );
      setCarregandoPreco(false);
    };

    carregarDados();
  }, [mounted, disciplina]);

  if (!mounted || typeof disciplina !== "string") {
    return null;
  }

  const disciplinaData =
    disciplinasData[disciplina as keyof typeof disciplinasData];

  if (!disciplinaData) {
    return (
      <AlunoLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900">
            Disciplina não encontrada
          </h1>
        </div>
      </AlunoLayout>
    );
  }

  const IconComponent = disciplinaData.icon;

  // Usa o preço real se já carregou, senão fallback do mock
  const precoUnitario = precoPorPonto ?? disciplinaData.precoMoedas;
  const total = pontos * precoUnitario;

  const saldoUsado = saldoAtual ?? disciplinaData.saldoAtual;
  const saldoInsuficiente = total > saldoUsado;

  const handleComprar = () => {
    if (saldoInsuficiente) {
      setErro("Saldo insuficiente para esta compra!");
      return;
    }

    if (pontos <= 0) {
      setErro("Quantidade deve ser maior que zero!");
      return;
    }

    setErro("");
    router.push(
      `/aluno/comprar-pontos/${disciplina}/confirmar?pontos=${pontos}&total=${total}`
    );
  };

  return (
    <AlunoLayout>
      <div className="page-enter space-y-6 max-w-2xl mx-auto">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4">
          <BackButton color={disciplinaData.color} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comprar Pontos</h1>
            <p className="text-gray-600">{disciplinaData.nome}</p>
          </div>
        </div>

        {/* Card da disciplina */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div
              className={`bg-gradient-to-r ${disciplinaData.gradient} text-white rounded-2xl p-6 flex justify-between items-center shadow-lg mb-6`}
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {disciplinaData.nome}
                </h2>
                <div className="space-y-1 text-sm opacity-90">
                  <p>
                    Preço por ponto:{" "}
                    {carregandoPreco
                      ? "carregando..."
                      : `${precoUnitario} moedas`}
                  </p>
                  <p>
                    Seu saldo atual:{" "}
                    {carregandoSaldo ? "carregando..." : `${saldoUsado} moedas`}
                  </p>
                </div>
              </div>
              <IconComponent className="h-12 w-12 opacity-80" />
            </div>

            {/* Formulário de compra */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quantos pontos você deseja comprar?
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPontos(Math.max(1, pontos - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center font-bold smooth-transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={pontos}
                    onChange={(e) => {
                      const value = Math.max(
                        1,
                        Math.min(10, Number(e.target.value))
                      );
                      setPontos(value);
                      setErro("");
                    }}
                    className="w-20 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setPontos(Math.min(10, pontos + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center font-bold smooth-transition"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Máximo: 10 pontos por compra
                </p>
              </div>

              {/* Resumo do valor */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pontos:</span>
                  <span className="font-semibold">{pontos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Preço unitário:</span>
                  <span className="font-semibold">
                    {carregandoPreco
                      ? "carregando..."
                      : `${precoUnitario} moedas`}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span
                    className={`font-bold text-lg ${
                      saldoInsuficiente
                        ? "text-red-600"
                        : disciplinaData.textColor
                    }`}
                  >
                    {total} moedas
                  </span>
                </div>
              </div>

              {/* Erro */}
              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 text-sm">{erro}</span>
                </div>
              )}

              {/* Botão de compra */}
              <Button
                onClick={handleComprar}
                disabled={saldoInsuficiente || carregandoPreco}
                className={`w-full h-12 text-lg font-semibold rounded-xl smooth-transition ${
                  saldoInsuficiente || carregandoPreco
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : `bg-gradient-to-r ${disciplinaData.gradient} hover:opacity-90 text-white`
                }`}
              >
                {saldoInsuficiente
                  ? "Saldo Insuficiente"
                  : carregandoPreco
                    ? "Carregando preço..."
                    : "Realizar Compra"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AlunoLayout>
  );
}
