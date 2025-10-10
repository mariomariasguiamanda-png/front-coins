"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import AlunoLayout from "@/components/layout/AlunoLayout";
import { Card, CardContent } from "@/components/ui/Card";
import NotificationCard from "@/components/ui/NotificationCard";
import {
  disciplinas as mockDisciplinas,
  atividades as mockAtividades,
} from "@/lib/mock/aluno";
import {
  CalendarDays,
  ClipboardList,
  ArrowLeft,
  Info,
  X,
  Repeat,
  Target,
} from "lucide-react";
import {
  FaCalculator,
  FaFlask,
  FaGlobeAmericas,
  FaBook,
  FaAtom,
  FaPalette,
} from "react-icons/fa";
import { resolverTema } from "@/modules/aluno/tema";

type IconComponent = (props: { className?: string }) => JSX.Element;

const iconByDisciplina: Record<string, IconComponent> = {
  mat: (p) => <FaCalculator {...p} />,
  port: (p) => <FaBook {...p} />,
  hist: (p) => <FaBook {...p} />,
  geo: (p) => <FaGlobeAmericas {...p} />,
  bio: (p) => <FaFlask {...p} />,
  fis: (p) => <FaAtom {...p} />,
  art: (p) => <FaPalette {...p} />,
};

function nomePorSlug(id: string) {
  const mapa: Record<string, string> = {
    mat: "Matemática",
    port: "Português",
    hist: "História",
    geo: "Geografia",
    bio: "Biologia",
    fis: "Física",
    art: "Artes",
  };
  return mapa[id] || id;
}

function badgeColor(status: string) {
  switch (status) {
    case "pendente":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "enviado":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "corrigido":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function AtividadesPage() {
  const { query, push } = useRouter();
  const id = String(query.id || "");
  const disc = mockDisciplinas.find((d) => d.id === id);
  const atividadesBase = useMemo(
    () => mockAtividades.filter((a) => a.disciplinaId === id),
    [id]
  );

  // Revisão espaçada (Ebbinghaus)
  const [diasRevisao, setDiasRevisao] = useState<number[]>([1, 3, 7, 15]);

  const toggleDiaRevisao = (dia: number) => {
    setDiasRevisao((prev) =>
      prev.includes(dia)
        ? prev.filter((d) => d !== dia)
        : [...prev, dia].sort((a, b) => a - b)
    );
  };

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const gerarRevisaoHoje = () => {
    if (diasRevisao.length === 0) {
      setNotificationMessage("Selecione pelo menos um intervalo de revisão!");
      setShowNotification(true);
      return;
    }
    setNotificationMessage(
      `Revisão programada para os dias: ${diasRevisao.join(
        ", "
      )}. Bons estudos!`
    );
    setShowNotification(true);
  };

  const atividades = atividadesBase;

  const tituloDisciplina = disc?.nome || nomePorSlug(id);
  const cor = disc?.cor || "#6B7280";
  const tema = resolverTema({ id, nome: disc?.nome, queryTema: query.tema });
  const IconComponent = iconByDisciplina[id] || FaBook;

  return (
    <AlunoLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => push(`/aluno/disciplinas/${id}`)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: cor }}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: cor }}>
                Atividades
              </h1>
              <p className="text-sm text-gray-600">
                Envie revisões e colete moedas.
              </p>
              {disc && (
                <p className="text-xs text-gray-600 mt-1">
                  {tituloDisciplina} · Moedas: {disc.moedas} · Progresso:{" "}
                  {disc.progresso}%
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Revisão Espaçada (Ebbinghaus) */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
                <Repeat className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Revisão Espaçada (Ebbinghaus)
                </h3>
                <p className="text-sm text-gray-600">
                  Selecione os intervalos para maximizar sua retenção
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[1, 3, 7, 15].map((dia) => (
                <label
                  key={dia}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-white cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={diasRevisao.includes(dia)}
                    onChange={() => toggleDiaRevisao(dia)}
                    className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {dia} dia{dia > 1 ? "s" : ""}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={gerarRevisaoHoje}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <Target className="h-5 w-5" />
              Gerar revisão de hoje
            </button>
          </CardContent>
        </Card>

        {/* Lista de atividades */}
        <div className="space-y-4">
          {atividades.map((atividade) => (
            <Card
              key={atividade.id}
              className="rounded-2xl bg-white border border-gray-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${tema.grad} flex-shrink-0`}
                    >
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {atividade.titulo}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${badgeColor(
                            atividade.status
                          )}`}
                        >
                          {atividade.status === "pendente" && "Pendente"}
                          {atividade.status === "enviado" && "Enviado"}
                          {atividade.status === "corrigido" && "Corrigido"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          Prazo:{" "}
                          {new Date(atividade.prazo).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                        <span>Moedas: {atividade.moedas}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      push(
                        `/aluno/disciplinas/${id}/atividades/${atividade.id}`
                      )
                    }
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    {atividade.status === "pendente"
                      ? "Fazer Atividade"
                      : "Ver Detalhes"}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {atividades.length === 0 && (
          <Card className="rounded-2xl bg-white border border-gray-200">
            <CardContent className="p-8 text-center">
              <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma atividade disponível
              </h3>
              <p className="text-gray-600">
                Novas atividades aparecerão aqui quando disponibilizadas pelo
                professor.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Componente de Notificação */}
      <NotificationCard
        show={showNotification}
        onClose={() => setShowNotification(false)}
        message={notificationMessage}
        type={notificationMessage.includes("Selecione") ? "warning" : "success"}
      />
    </AlunoLayout>
  );
}
