import React from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface GraficoMoedasProps {
  className?: string;
}

export default function GraficoMoedas({ className }: GraficoMoedasProps) {
  // Dados mockados para o gráfico
  const dadosGrafico = [
    { mes: "Jan", moedas: 120 },
    { mes: "Fev", moedas: 150 },
    { mes: "Mar", moedas: 180 },
    { mes: "Abr", moedas: 140 },
    { mes: "Mai", moedas: 200 },
    { mes: "Jun", moedas: 165 },
  ];

  const maxMoedas = Math.max(...dadosGrafico.map((d) => d.moedas));
  const totalAcumulado = dadosGrafico.reduce(
    (acc, curr) => acc + curr.moedas,
    0
  );

  return (
    <Card
      className={`border border-gray-200 rounded-2xl shadow-sm graph-container ${className}`}
    >
      <CardContent className="p-6">
        {/* Título com ícone */}
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Evolução de Moedas
          </h3>
        </div>

        {/* Barras do gráfico */}
        <div className="space-y-4 overflow-x-auto">
          {dadosGrafico.map((item, index) => (
            <div key={index} className="flex items-center gap-4 min-w-[280px]">
              {/* Nome do mês */}
              <div className="w-8 text-sm font-medium text-gray-700">
                {item.mes}
              </div>

              {/* Barra de progresso */}
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r from-violet-400 via-violet-500 to-violet-600 h-3 rounded-full bar-animated bar-delay-${index} shadow-inner`}
                    style={{ width: `${(item.moedas / maxMoedas) * 100}%` }}
                  />
                </div>
              </div>

              {/* Valor com ícone de moeda */}
              <div
                className={`flex items-center gap-1 text-sm font-bold text-violet-600 min-w-[60px] justify-end coins-value coins-delay-${index}`}
              >
                <span>{item.moedas}</span>
                <span>🪙</span>
              </div>
            </div>
          ))}
        </div>

        {/* Box do total acumulado */}
        <div className="mt-6 bg-violet-50 border border-violet-100 rounded-xl p-4 total-animated">
          <div className="text-center">
            <span className="font-bold text-violet-800">Total acumulado: </span>
            <span className="text-violet-800">{totalAcumulado} moedas 🏆</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
