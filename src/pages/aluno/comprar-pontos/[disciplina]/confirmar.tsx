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
  ShoppingCart,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Dados das disciplinas (mesmo dos arquivos anteriores) + idDisciplina do banco
const disciplinasData = {
  mat: {
    idDisciplina: 1, // id_disciplina = 1 (Matemática) -> ajusta se estiver diferente
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
    idDisciplina: null, // ainda sem disciplina criada no banco
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
    idDisciplina: 2, // História
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
    idDisciplina: 3, // Biologia
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
    idDisciplina: 6, // Artes (pelo print da tabela)
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
    idDisciplina: 4, // Física
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

export default function ConfirmarCompra() {
  const router = useRouter();
  const { disciplina, pontos, total } = router.query;
  const [confirmando, setConfirmando] = useState(false);
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof disciplina !== "string") {
    return null;
  }

  const disciplinaData =
    disciplinasData[disciplina as keyof typeof disciplinasData];
  const pontosNum = Number(pontos);
  const totalNum = Number(total);

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
  const saldoAposMock = disciplinaData.saldoAtual - totalNum;

  const handleConfirmar = async () => {
    setErroApi(null);

    // Se ainda não mapeamos essa disciplina pro banco, bloqueia a compra
    if (!disciplinaData.idDisciplina) {
      setErroApi(
        "Esta disciplina ainda não está configurada para compras no sistema. Fale com o administrador."
      );
      return;
    }

    try {
      setConfirmando(true);

      // Chama a função RPC comprar_pontos no Supabase
      const { data, error } = await supabase.rpc("comprar_pontos", {
        p_id_disciplina: disciplinaData.idDisciplina,
        p_pontos: pontosNum,
      });

      if (error) {
        console.error("Erro ao comprar pontos:", error);
        setErroApi(error.message || "Erro ao processar a compra.");
        setConfirmando(false);
        return;
      }

      // A função pode retornar um array com 1 linha ou um único objeto, depende de como você definiu
      const result = Array.isArray(data) ? data[0] : data;

      if (!result) {
        setErroApi("Não foi possível obter o resultado da compra.");
        setConfirmando(false);
        return;
      }

      const {
        pontos_comprados,
        moedas_gastas,
        saldo_antes,
        saldo_depois,
      } = result as {
        pontos_comprados: number;
        moedas_gastas: number;
        saldo_antes: number;
        saldo_depois: number;
      };

      // Redireciona para a tela de sucesso com os dados REAIS do banco
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

            {/* Card da disciplina (pré-visualização com dados mock) */}
            <div
              className={`bg-gradient-to-r ${disciplinaData.gradient} text-white rounded-2xl p-6 flex justify-between items-center shadow-lg`}
            >
              <div>
                <h3 className="text-xl font-bold mb-3">
                  {disciplinaData.nome}
                </h3>
                <div className="space-y-1 text-sm opacity-90">
                  <p>Saldo antes (mock): {disciplinaData.saldoAtual} moedas</p>
                  <p>Saldo após (estimado): {saldoAposMock} moedas</p>
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
                  <span className="font-semibold">
                    {disciplinaData.precoMoedas} moedas
                  </span>
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

            {/* Erro da API, se der ruim na função comprar_pontos */}
            {erroApi && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700 text-sm whitespace-pre-line">
                  {erroApi}
                </span>
              </div>
            )}

            {/* Botões de ação */}
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
                disabled={confirmando}
                className={`flex-1 h-12 text-lg font-semibold rounded-xl smooth-transition bg-gradient-to-r ${disciplinaData.gradient} hover:opacity-90 text-white flex items-center justify-center gap-2`}
              >
                {confirmando ? (
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

        {/* Aviso importante */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <span className="text-amber-600 text-lg">⚠️</span>
            </div>
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Importante:</p>
              <p>
                A cobrança real é feita pelo sistema usando seus dados no
                Supabase. Os valores exibidos aqui são uma prévia. Depois de
                confirmar, as moedas serão debitadas de acordo com as regras da
                disciplina e os pontos serão adicionados à sua nota.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AlunoLayout>
  );
}
