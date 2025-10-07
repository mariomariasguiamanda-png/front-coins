import { CalendarDays } from "lucide-react";
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

// Mapeamento de cores por disciplina
const coresDisciplinas = {
  Matemática: "blue",
  História: "amber",
  Biologia: "emerald",
  Física: "purple",
  Geografia: "teal",
  Artes: "pink",
  Português: "orange",
} as const;

export default function Atividades() {
  // Dados mockados das atividades
  const atividades: Atividade[] = [
    {
      id: "1",
      disciplina: "Matemática",
      titulo: "Revisão - Funções",
      prazo: "2025-10-01",
      moedas: 10,
      status: "pendente",
    },
    {
      id: "2",
      disciplina: "História",
      titulo: "Revolução Industrial",
      prazo: "2025-10-05",
      moedas: 15,
      status: "enviado",
    },
    {
      id: "3",
      disciplina: "Biologia",
      titulo: "Sistema Circulatório",
      prazo: "2025-10-08",
      moedas: 12,
      status: "corrigida",
    },
  ];

  // Função para obter a cor da disciplina (assumindo primeira disciplina para o tema geral)
  const disciplinaPrincipal = atividades[0]?.disciplina || "Matemática";
  const corPrincipal =
    coresDisciplinas[disciplinaPrincipal as keyof typeof coresDisciplinas] ||
    "blue";

  const getStatusConfig = (status: string, disciplina: string) => {
    const cor =
      coresDisciplinas[disciplina as keyof typeof coresDisciplinas] || "blue";

    switch (status) {
      case "pendente":
        return {
          class: `bg-${cor}-100 text-${cor}-700`,
          text: "Pendente",
        };
      case "enviado":
        return {
          class: "bg-violet-100 text-violet-700",
          text: "Enviado",
        };
      case "corrigida":
        return {
          class: "bg-emerald-100 text-emerald-700",
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
    <div className="space-y-6">
      {/* 1. Cabeçalho da seção */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="h-6 w-6 text-violet-700" />
          <h1 className="text-3xl font-bold text-violet-700">Atividades</h1>
        </div>
        <p className="text-gray-600">Envie revisões e colete moedas.</p>
      </div>

      {/* 2. Revisão espaçada (Ebbinghaus) */}
      <Card
        className={`bg-${corPrincipal}-50 border border-${corPrincipal}-100 rounded-xl`}
      >
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Revisão espaçada (Ebbinghaus)
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Sugestão de calendário: 1d, 3d, 7d, 15d.
          </p>

          {/* Checkboxes horizontais */}
          <div className="flex flex-wrap gap-4 mb-6">
            {[
              { label: "Dia 1", checked: true },
              { label: "Dia 3", checked: false },
              { label: "Dia 7", checked: false },
              { label: "Dia 15", checked: false },
            ].map((item) => (
              <label
                key={item.label}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  className={`accent-${corPrincipal}-600 w-4 h-4`}
                  readOnly
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>

          {/* Botão gerar revisão */}
          <button
            className={`bg-gradient-to-r from-${corPrincipal}-500 to-${corPrincipal}-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:from-${corPrincipal}-600 hover:to-${corPrincipal}-700`}
          >
            Gerar revisão de hoje
          </button>
        </CardContent>
      </Card>

      {/* 3. Lista de atividades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {atividades.map((atividade) => {
          const cor =
            coresDisciplinas[
              atividade.disciplina as keyof typeof coresDisciplinas
            ] || "blue";
          const statusConfig = getStatusConfig(
            atividade.status,
            atividade.disciplina
          );

          return (
            <Card
              key={atividade.id}
              className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-4 space-y-3">
                {/* Nome da disciplina */}
                <p className={`text-${cor}-700 text-sm font-medium`}>
                  {atividade.disciplina}
                </p>

                {/* Título da atividade */}
                <h3 className="font-semibold text-gray-900">
                  {atividade.titulo}
                </h3>

                {/* Prazo e moedas */}
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Prazo: {atividade.prazo}</p>
                  <p>Moedas: {atividade.moedas}</p>
                </div>

                {/* Tag de status */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}
                  >
                    {statusConfig.text}
                  </span>
                </div>

                {/* Botão Abrir */}
                <button
                  className={`w-full bg-gradient-to-r from-${cor}-500 to-${cor}-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-md transition-all duration-200 hover:from-${cor}-600 hover:to-${cor}-700`}
                >
                  Abrir
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
