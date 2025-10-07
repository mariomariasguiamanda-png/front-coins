"use client";

import { useRouter } from "next/router";
import { CalendarDays, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
// Tipos para os dados
interface Atividade {
  id: string;
  disciplina: string;
  titulo: string;
  prazo: string;
  moedas: number;
  status: "pendente" | "enviado" | "corrigida";
}

// Mapeamento de cores e gradientes por disciplina
const coresDisciplinas = {
  mat: {
    nome: "Matemática",
    cor: "#3B82F6",
    gradiente: "from-blue-500 to-blue-600",
    bg: "bg-blue-600",
  },
  hist: {
    nome: "História",
    cor: "#F97316",
    gradiente: "from-orange-500 to-orange-600",
    bg: "bg-orange-500",
  },
  bio: {
    nome: "Biologia",
    cor: "#10B981",
    gradiente: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-600",
  },
  fis: {
    nome: "Física",
    cor: "#8B5CF6",
    gradiente: "from-violet-500 to-violet-600",
    bg: "bg-violet-600",
  },
  geo: {
    nome: "Geografia",
    cor: "#14B8A6",
    gradiente: "from-teal-500 to-teal-600",
    bg: "bg-teal-600",
  },
  art: {
    nome: "Artes",
    cor: "#EC4899",
    gradiente: "from-pink-500 to-pink-600",
    bg: "bg-pink-600",
  },
  port: {
    nome: "Português",
    cor: "#22C55E",
    gradiente: "from-green-500 to-green-600",
    bg: "bg-green-600",
  },
} as const;

export default function AtividadesPage() {
  const router = useRouter();
  const { query } = router;
  const id = String(query.id || "");

  // Obter informações da disciplina
  const disciplinaInfo = coresDisciplinas[
    id as keyof typeof coresDisciplinas
  ] || {
    nome: "Disciplina",
    cor: "#3B82F6",
    gradiente: "from-blue-500 to-blue-600",
    bg: "bg-blue-600",
  };

  // Dados mockados das atividades
  const atividades: Atividade[] = [
    {
      id: "1",
      disciplina: disciplinaInfo.nome,
      titulo: "Revisão - Funções",
      prazo: "2025-10-01",
      moedas: 10,
      status: "pendente",
    },
    {
      id: "2",
      disciplina: disciplinaInfo.nome,
      titulo: "Exercícios - Equações",
      prazo: "2025-10-05",
      moedas: 15,
      status: "enviado",
    },
    {
      id: "3",
      disciplina: disciplinaInfo.nome,
      titulo: "Prova - Geometria",
      prazo: "2025-10-08",
      moedas: 25,
      status: "corrigida",
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pendente":
        return {
          class: "bg-purple-100 text-purple-700",
          text: "Pendente",
        };
      case "enviado":
        return {
          class: "bg-blue-100 text-blue-700",
          text: "Enviado",
        };
      case "corrigida":
        return {
          class: "bg-green-100 text-green-700",
          text: "Corrigida",
        };
      default:
        return {
          class: "bg-gray-100 text-gray-700",
          text: status,
        };
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Botão de voltar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push(`/homepage-aluno/disciplinas/${id}`)}
            className="flex items-center justify-center p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke={disciplinaInfo.cor}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* 1️⃣ Cabeçalho da página */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div
              className="p-3 rounded-2xl text-white shadow-lg"
              style={{ backgroundColor: disciplinaInfo.cor }}
            >
              <ClipboardList className="h-8 w-8" />
            </div>
            <div className="text-left">
              <h1
                className="text-3xl font-bold"
                style={{ color: disciplinaInfo.cor }}
              >
                Atividades
              </h1>
              <p className="text-gray-600">Envie revisões e colete moedas.</p>
            </div>
          </div>
        </div>

        {/* 2️⃣ Seção de Revisão Espaçada (Ebbinghaus) */}
        <Card className="bg-violet-50 border border-violet-100 rounded-2xl shadow-violet-100 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Revisão espaçada (Ebbinghaus)
            </h3>
            <p className="text-gray-600 mb-6">
              Sugestão de calendário: 1d, 3d, 7d, 15d.
            </p>

            {/* Checkboxes horizontais */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { label: "Dia 1", value: "1d", checked: true },
                { label: "Dia 3", value: "3d", checked: false },
                { label: "Dia 7", value: "7d", checked: false },
                { label: "Dia 15", value: "15d", checked: false },
              ].map((item) => (
                <label
                  key={item.value}
                  className="flex items-center gap-3 cursor-pointer text-sm font-medium"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    className="accent-violet-600 w-4 h-4 rounded"
                    readOnly
                  />
                  <span className="text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>

            {/* Botão gerar revisão */}
            <button className="bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:opacity-90 hover:scale-[1.03] active:scale-[0.97] transition-transform duration-200">
              Gerar revisão de hoje
            </button>
          </CardContent>
        </Card>

        {/* 3️⃣ Cards de Atividades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {atividades.map((atividade, index) => {
            const statusConfig = getStatusConfig(atividade.status);

            return (
              <Card
                key={atividade.id}
                className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Nome da disciplina */}
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                    {atividade.disciplina}
                  </p>

                  {/* Título da atividade */}
                  <h3 className="text-lg font-bold text-gray-900">
                    {atividade.titulo}
                  </h3>

                  {/* Prazo e moedas */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Prazo:</span>{" "}
                      {atividade.prazo}
                    </p>
                    <p>
                      <span className="font-medium">Moedas:</span>{" "}
                      {atividade.moedas}
                    </p>
                  </div>

                  {/* Tag de status */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${statusConfig.class}`}
                    >
                      {statusConfig.text}
                    </span>
                  </div>

                  {/* Botão Abrir */}
                  <button
                    className={`w-full text-white rounded-full px-5 py-3 font-semibold shadow hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${disciplinaInfo.bg}`}
                  >
                    Abrir
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
