"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Calculator,
  BookOpen,
  Clock,
  Atom,
  Palette,
  Zap,
  CheckCircle,
  Home,
  Repeat,
} from "lucide-react";

// Dados das disciplinas (mesmo dos arquivos anteriores)
const disciplinasData = {
  mat: {
    nome: "Matemática",
    icon: Calculator,
    gradient: "from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-500/10",
    color: "#3B82F6",
  },
  port: {
    nome: "Português",
    icon: BookOpen,
    gradient: "from-green-500 to-green-600",
    textColor: "text-green-600",
    bgColor: "bg-green-500/10",
    color: "#22C55E",
  },
  hist: {
    nome: "História",
    icon: Clock,
    gradient: "from-amber-500 to-amber-600",
    textColor: "text-amber-600",
    bgColor: "bg-amber-500/10",
    color: "#F59E0B",
  },
  bio: {
    nome: "Biologia",
    icon: Atom,
    gradient: "from-emerald-500 to-emerald-600",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    color: "#10B981",
  },
  art: {
    nome: "Artes",
    icon: Palette,
    gradient: "from-pink-500 to-pink-600",
    textColor: "text-pink-600",
    bgColor: "bg-pink-500/10",
    color: "#EC4899",
  },
  fis: {
    nome: "Física",
    icon: Zap,
    gradient: "from-violet-500 to-violet-600",
    textColor: "text-violet-600",
    bgColor: "bg-violet-500/10",
    color: "#8B5CF6",
  },
};

// Componente de moeda caindo
const FallingCoin = ({
  delay,
  duration,
}: {
  delay: number;
  duration: number;
}) => {
  const [position, setPosition] = useState({ x: 0, y: -50 });

  useEffect(() => {
    const x =
      Math.random() *
      (typeof window !== "undefined" ? window.innerWidth - 50 : 800);
    setPosition({ x, y: -50 });
  }, []);

  return (
    <div
      className="coin-falling"
      style={{
        left: `${position.x}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      🪙
    </div>
  );
};

export default function CompraSucesso() {
  const router = useRouter();
  const { disciplina, pontos, total, saldoAntes, saldoDepois } = router.query;
  const [showCoins, setShowCoins] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Iniciar animação de moedas após um pequeno delay
    const timer = setTimeout(() => {
      setShowCoins(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleNovaCompra = () => {
    router.push("/aluno/comprar-pontos");
  };

  const handleVoltar = () => {
    router.push("/aluno/inicio");
  };

  if (!mounted || typeof disciplina !== "string") {
    return null;
  }

  const disciplinaData =
    disciplinasData[disciplina as keyof typeof disciplinasData];
  const pontosNum = Number(pontos);
  const totalNum = Number(total);
  const saldoAntesNum = Number(saldoAntes);
  const saldoDepoisNum = Number(saldoDepois);

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

  return (
    <AlunoLayout>
      {/* Animação de moedas caindo */}
      {showCoins && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 15 }).map((_, i) => (
            <FallingCoin
              key={i}
              delay={Math.random() * 1.5}
              duration={2 + Math.random() * 2}
            />
          ))}
        </div>
      )}

      <div className="page-enter space-y-6 max-w-2xl mx-auto">
        {/* Header de sucesso */}
        <div className="text-center space-y-4">
          <div className="success-icon bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Compra Realizada!
            </h1>
            <p className="text-lg text-gray-600">
              Parabéns! Seus pontos foram adicionados com sucesso
            </p>
          </div>
        </div>

        {/* Card de confirmação */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Card da disciplina */}
            <div
              className={`bg-gradient-to-r ${disciplinaData.gradient} text-white rounded-2xl p-6 flex justify-between items-center shadow-lg`}
            >
              <div>
                <h3 className="text-xl font-bold mb-3">
                  {disciplinaData.nome}
                </h3>
                <div className="space-y-1 text-sm opacity-90">
                  <p>
                    ✅ {pontosNum} ponto{pontosNum > 1 ? "s" : ""} adicionado
                    {pontosNum > 1 ? "s" : ""}!
                  </p>
                  <p>Novo saldo: {saldoDepoisNum} moedas</p>
                </div>
              </div>
              <IconComponent className="h-10 w-10 opacity-80" />
            </div>

            {/* Recibo detalhado */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h4 className="font-bold text-gray-900">🧾 Recibo da Compra</h4>
                <span className="text-xs text-gray-500">
                  #{Date.now().toString().slice(-6)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Disciplina:</span>
                  <span className="font-semibold">{disciplinaData.nome}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Pontos comprados:</span>
                  <span className="font-semibold text-green-600">
                    +{pontosNum}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Moedas gastas:</span>
                  <span className="font-semibold text-red-600">
                    -{totalNum}
                  </span>
                </div>

                <div className="border-t pt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saldo anterior:</span>
                    <span className="font-semibold">
                      {saldoAntesNum} moedas
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">
                      Saldo atual:
                    </span>
                    <span className={`font-bold ${disciplinaData.textColor}`}>
                      {saldoDepoisNum} moedas
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagem motivacional */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <span className="text-yellow-600 text-lg">🎯</span>
                </div>
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Sua nota melhorou!</p>
                  <p>
                    Com {pontosNum} novo{pontosNum > 1 ? "s" : ""} ponto
                    {pontosNum > 1 ? "s" : ""} em {disciplinaData.nome}, você
                    está mais próximo do topo da classificação. Continue
                    estudando! 📚
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleNovaCompra}
                variant="outline"
                className="flex-1 h-12 text-gray-700 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Repeat className="h-4 w-4" />
                Nova Compra
              </Button>

              <Button
                onClick={handleVoltar}
                className="flex-1 h-12 text-lg font-semibold rounded-xl smooth-transition bg-gradient-to-r from-violet-500 to-violet-600 hover:opacity-90 text-white flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Início
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-xl border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                +{pontosNum}
              </div>
              <div className="text-xs text-gray-600">Pontos Ganhos</div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-violet-600 mb-1">
                {saldoDepoisNum}
              </div>
              <div className="text-xs text-gray-600">Saldo Restante</div>
            </CardContent>
          </Card>
        </div>

        {/* Footer motivacional */}
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">
            🌟 Continue comprando pontos para melhorar suas notas! 🌟
          </p>
        </div>
      </div>
    </AlunoLayout>
  );
}
