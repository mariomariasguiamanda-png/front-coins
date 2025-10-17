"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  CheckCircle,
  XCircle,
  Award,
  Target,
  TrendingUp,
  Coins,
} from "lucide-react";

interface ResultCardProps {
  show: boolean;
  onClose: () => void;
  acertos: number;
  totalQuestoes: number;
  nota: number;
  moedas?: number;
  tipo?: "quiz" | "atividade";
  disciplina?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  show,
  onClose,
  acertos,
  totalQuestoes,
  nota,
  moedas = 0,
  tipo = "quiz",
  disciplina = "",
}) => {
  const [showCoinsAnimation, setShowCoinsAnimation] = useState(false);
  const [animatedCoins, setAnimatedCoins] = useState<
    Array<{ id: number; delay: number; left: string }>
  >([]);

  // Inicia animação das moedas após 2 segundos
  useEffect(() => {
    if (show && moedas > 0) {
      const startTimer = setTimeout(() => {
        setShowCoinsAnimation(true);
      }, 2000);

      // Para de criar novas moedas após 5 segundos (3 segundos após começar)
      const stopTimer = setTimeout(() => {
        setShowCoinsAnimation(false);
      }, 5000);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(stopTimer);
      };
    }
  }, [show, moedas]);

  // Cria moedas continuamente enquanto a animação estiver ativa
  useEffect(() => {
    if (!showCoinsAnimation) return;

    const interval = setInterval(() => {
      // Adiciona uma nova moeda a cada 200-800ms
      const newCoin = {
        id: Date.now() + Math.random(),
        delay: 0, // Sem delay pois já está sendo criada
        left: `${10 + Math.random() * 80}%`,
      };

      setAnimatedCoins((prev) => [...prev, newCoin]);

      // Remove moedas antigas que já terminaram a animação (após 3 segundos)
      setTimeout(() => {
        setAnimatedCoins((prev) =>
          prev.filter((coin) => coin.id !== newCoin.id)
        );
      }, 3000);
    }, 200 + Math.random() * 600); // Intervalo aleatório entre 200-800ms

    return () => clearInterval(interval);
  }, [showCoinsAnimation]);

  if (!show) return null;

  const percentual = Math.round((acertos / totalQuestoes) * 100);
  const erros = totalQuestoes - acertos;

  const getPerformanceData = () => {
    if (percentual >= 90) {
      return {
        gradientFrom: "from-emerald-500",
        gradientTo: "to-emerald-600",
        textColor: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        progressBg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
        hoverFrom: "hover:from-emerald-600",
        hoverTo: "hover:to-emerald-700",
        icon: Award,
        message: "Excelente!",
        description: "Você dominou este conteúdo!",
      };
    } else if (percentual >= 70) {
      return {
        gradientFrom: "from-blue-500",
        gradientTo: "to-blue-600",
        textColor: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        progressBg: "bg-gradient-to-r from-blue-500 to-blue-600",
        hoverFrom: "hover:from-blue-600",
        hoverTo: "hover:to-blue-700",
        icon: TrendingUp,
        message: "Muito Bem!",
        description: "Bom desempenho, continue assim!",
      };
    } else if (percentual >= 50) {
      return {
        gradientFrom: "from-yellow-500",
        gradientTo: "to-yellow-600",
        textColor: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        progressBg: "bg-gradient-to-r from-yellow-500 to-yellow-600",
        hoverFrom: "hover:from-yellow-600",
        hoverTo: "hover:to-yellow-700",
        icon: Target,
        message: "Pode Melhorar",
        description: "Continue estudando para aprimorar!",
      };
    } else {
      return {
        gradientFrom: "from-red-500",
        gradientTo: "to-red-600",
        textColor: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        progressBg: "bg-gradient-to-r from-red-500 to-red-600",
        hoverFrom: "hover:from-red-600",
        hoverTo: "hover:to-red-700",
        icon: XCircle,
        message: "Precisa Estudar Mais",
        description: "Revise o conteúdo e tente novamente!",
      };
    }
  };

  const performance = getPerformanceData();
  const IconComponent = performance.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-bounce-in">
        {/* Header com gradiente */}
        <div
          className={`bg-gradient-to-r ${performance.gradientFrom} ${performance.gradientTo} p-6 text-white text-center`}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-4">
              <IconComponent className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{performance.message}</h2>
          <p className="text-white/90">{performance.description}</p>
          {disciplina && (
            <p className="text-sm text-white/80 mt-1">{disciplina}</p>
          )}
        </div>

        <CardContent className="p-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${performance.textColor} mb-1`}
              >
                {acertos}/{totalQuestoes}
              </div>
              <div className="text-sm text-gray-600">Questões Certas</div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${performance.textColor} mb-1`}
              >
                {percentual}%
              </div>
              <div className="text-sm text-gray-600">Aproveitamento</div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso</span>
              <span>
                {acertos} de {totalQuestoes}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${performance.progressBg} h-3 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${percentual}%` }}
              />
            </div>
          </div>

          {/* Detalhes */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Acertos</span>
              </div>
              <span className="text-green-800 font-bold">{acertos}</span>
            </div>

            {erros > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">Erros</span>
                </div>
                <span className="text-red-800 font-bold">{erros}</span>
              </div>
            )}

            {moedas > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">
                    Moedas Ganhas
                  </span>
                </div>
                <span className="text-yellow-800 font-bold">+{moedas}</span>
              </div>
            )}

            {nota > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Nota</span>
                </div>
                <span className="text-blue-800 font-bold">
                  {nota.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Botão de fechar */}
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 bg-gradient-to-r ${performance.gradientFrom} ${performance.gradientTo} ${performance.hoverFrom} ${performance.hoverTo} text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105`}
          >
            Continuar
          </button>
        </CardContent>
      </Card>

      {/* Animação de Moedas Caindo */}
      {animatedCoins.map((coin) => (
        <div
          key={coin.id}
          className="absolute animate-coin-fall pointer-events-none z-10"
          style={{
            left: coin.left,
            top: "20%",
            animationDuration: "3000ms",
          }}
        >
          <Coins className="h-8 w-8 text-yellow-500 drop-shadow-lg animate-spin" />
        </div>
      ))}
    </div>
  );
};

export default ResultCard;
