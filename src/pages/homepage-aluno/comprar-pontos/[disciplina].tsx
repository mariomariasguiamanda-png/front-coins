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
  Clock,
  Atom,
  Palette,
  Zap,
  AlertCircle,
} from "lucide-react";

// Dados das disciplinas (mesmo do arquivo anterior)
const disciplinasData = {
  mat: {
    nome: "Matemática",
    icon: Calculator,
    gradient: "from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-500/10",
    color: "#3B82F6",
    precoMoedas: 750,
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
    icon: Clock,
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
};

export default function ComprarPontosDisciplina() {
  const router = useRouter();
  const { disciplina } = router.query;
  const [pontos, setPontos] = useState(1);
  const [erro, setErro] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  const total = pontos * disciplinaData.precoMoedas;
  const saldoInsuficiente = total > disciplinaData.saldoAtual;

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
      `/homepage-aluno/comprar-pontos/${disciplina}/confirmar?pontos=${pontos}&total=${total}`
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
                  <p>Preço por ponto: {disciplinaData.precoMoedas} moedas</p>
                  <p>Seu saldo atual: {disciplinaData.saldoAtual} moedas</p>
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
                    className="w-20 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                    {disciplinaData.precoMoedas} moedas
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
                disabled={saldoInsuficiente}
                className={`w-full h-12 text-lg font-semibold rounded-xl smooth-transition ${
                  saldoInsuficiente
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : `bg-gradient-to-r ${disciplinaData.gradient} hover:opacity-90 text-white`
                }`}
              >
                {saldoInsuficiente ? "Saldo Insuficiente" : "Realizar Compra"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dica */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-lg">💡</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Dica importante:</p>
              <p>
                Os pontos comprados serão adicionados diretamente à sua nota na
                disciplina. Quanto mais pontos, melhor sua classificação!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AlunoLayout>
  );
}
