"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Calculator, BookOpen, Clock, Atom, Palette, Zap } from "lucide-react";

// Dados das disciplinas com cores padronizadas
const disciplinasData = [
  {
    id: "mat",
    nome: "Matemática",
    icon: Calculator,
    gradient: "from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-500/10",
    pontosDisponiveis: 0.5,
    precoMoedas: 750,
    saldoAtual: 1200,
  },
  {
    id: "port",
    nome: "Português",
    icon: BookOpen,
    gradient: "from-green-500 to-green-600",
    textColor: "text-green-600",
    bgColor: "bg-green-500/10",
    pontosDisponiveis: 0.3,
    precoMoedas: 600,
    saldoAtual: 850,
  },
  {
    id: "hist",
    nome: "História",
    icon: Clock,
    gradient: "from-amber-500 to-amber-600",
    textColor: "text-amber-600",
    bgColor: "bg-amber-500/10",
    pontosDisponiveis: 0.4,
    precoMoedas: 700,
    saldoAtual: 950,
  },
  {
    id: "bio",
    nome: "Biologia",
    icon: Atom,
    gradient: "from-emerald-500 to-emerald-600",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    pontosDisponiveis: 0.6,
    precoMoedas: 800,
    saldoAtual: 1100,
  },
  {
    id: "art",
    nome: "Artes",
    icon: Palette,
    gradient: "from-pink-500 to-pink-600",
    textColor: "text-pink-600",
    bgColor: "bg-pink-500/10",
    pontosDisponiveis: 0.2,
    precoMoedas: 500,
    saldoAtual: 650,
  },
  {
    id: "fis",
    nome: "Física",
    icon: Zap,
    gradient: "from-violet-500 to-violet-600",
    textColor: "text-violet-600",
    bgColor: "bg-violet-500/10",
    pontosDisponiveis: 0.7,
    precoMoedas: 900,
    saldoAtual: 1300,
  },
];

export default function ComprarPontosPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectDisciplina = (disciplinaId: string) => {
    router.push(`/aluno/comprar-pontos/${disciplinaId}`);
  };

  if (!mounted) return null;

  return (
    <AlunoLayout>
      <div className="page-enter space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            🪙 Comprar Pontos
          </h1>
          <p className="text-gray-600">
            Escolha uma disciplina para comprar pontos e melhorar sua nota
          </p>
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 inline-block">
            <span className="text-violet-800 font-semibold">
              Saldo total: 2.450 moedas 💰
            </span>
          </div>
        </div>

        {/* Grid de disciplinas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {disciplinasData.map((disciplina, index) => {
            const IconComponent = disciplina.icon;
            return (
              <div
                key={disciplina.id}
                className={`rounded-2xl shadow-sm border border-gray-200 hover-lift smooth-transition cursor-pointer card-bounce card-bounce-delay-${
                  index + 1
                } bg-white`}
                onClick={() => handleSelectDisciplina(disciplina.id)}
              >
                <Card className="h-full border-0 shadow-none">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {disciplina.nome}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            Pontos disponíveis:{" "}
                            <span className="font-semibold">
                              {disciplina.pontosDisponiveis}
                            </span>
                          </p>
                          <p>
                            Preço:{" "}
                            <span className="font-semibold">
                              {disciplina.precoMoedas} moedas
                            </span>
                          </p>
                          <p>
                            Seu saldo:{" "}
                            <span
                              className={`font-semibold ${disciplina.textColor}`}
                            >
                              {disciplina.saldoAtual} moedas
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className={`${disciplina.bgColor} p-4 rounded-xl`}>
                        <IconComponent
                          className={`${disciplina.textColor} h-8 w-8`}
                        />
                      </div>
                    </div>

                    <div
                      className={`bg-gradient-to-r ${disciplina.gradient} text-white rounded-xl p-3 text-center`}
                    >
                      <span className="font-semibold">Comprar Pontos</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Informações adicionais */}
        <div className="bg-gray-50 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-gray-900">ℹ️ Como funciona?</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Cada ponto comprado melhora sua nota na disciplina</p>
              <p>• O preço varia conforme a dificuldade da matéria</p>
              <p>
                • Você pode comprar quantos pontos quiser (limitado ao saldo)
              </p>
            </div>
          </div>
        </div>
      </div>
    </AlunoLayout>
  );
}
