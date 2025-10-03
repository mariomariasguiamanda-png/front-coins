import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { FaRegBell, FaRegClock } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { Calendar, Award, BookOpen } from "lucide-react";

const Notificacoes = () => {
  const notificacoes = [
    {
      id: 1,
      tipo: "atividade",
      titulo: "Nova atividade disponível",
      descricao: "Exercícios de Matemática - Álgebra Linear",
      tempo: "há 2 horas",
      lida: false,
      icon: BookOpen,
      cor: "blue",
    },
    {
      id: 2,
      tipo: "prazo",
      titulo: "Prazo se aproximando",
      descricao: "Redação de Português vence em 2 dias",
      tempo: "há 4 horas",
      lida: false,
      icon: FaRegClock,
      cor: "amber",
    },
    {
      id: 3,
      tipo: "conquista",
      titulo: "Parabéns! Nova conquista",
      descricao: "Você ganhou 50 moedas por completar 5 atividades",
      tempo: "há 1 dia",
      lida: true,
      icon: Award,
      cor: "green",
    },
    {
      id: 4,
      tipo: "lembrete",
      titulo: "Lembrete de aula",
      descricao: "Aula de Física amanhã às 14:00",
      tempo: "há 1 dia",
      lida: true,
      icon: Calendar,
      cor: "purple",
    },
    {
      id: 5,
      tipo: "atividade",
      titulo: "Atividade entregue",
      descricao: "Laboratório de Química foi entregue com sucesso",
      tempo: "há 2 dias",
      lida: true,
      icon: FaRegCheckCircle,
      cor: "green",
    },
  ];

  const getCoresDeFundo = (cor: string, lida: boolean) => {
    const opacity = lida ? "50" : "100";
    switch (cor) {
      case "blue":
        return `bg-blue-${opacity} border-blue-200`;
      case "amber":
        return `bg-amber-${opacity} border-amber-200`;
      case "green":
        return `bg-green-${opacity} border-green-200`;
      case "purple":
        return `bg-purple-${opacity} border-purple-200`;
      default:
        return `bg-gray-${opacity} border-gray-200`;
    }
  };

  const getCoresDoTexto = (cor: string) => {
    switch (cor) {
      case "blue":
        return "text-blue-600";
      case "amber":
        return "text-amber-600";
      case "green":
        return "text-green-600";
      case "purple":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaRegBell className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
        </div>
        {naoLidas > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {naoLidas} nova{naoLidas > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Resumo das notificações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Não lidas</p>
                <p className="text-2xl font-bold text-red-900">{naoLidas}</p>
              </div>
              <FaRegBell className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total hoje</p>
                <p className="text-2xl font-bold text-blue-900">
                  {notificacoes.filter((n) => n.tempo.includes("hora")).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Conquistas</p>
                <p className="text-2xl font-bold text-green-900">
                  {notificacoes.filter((n) => n.tipo === "conquista").length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de notificações */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Todas as Notificações</h3>
          <div className="space-y-3">
            {notificacoes.map((notificacao) => {
              const IconeComponente = notificacao.icon;
              return (
                <div
                  key={notificacao.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    notificacao.lida
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-blue-200 shadow-sm"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      notificacao.lida
                        ? "bg-gray-200"
                        : getCoresDeFundo(notificacao.cor, false)
                    }`}
                  >
                    <IconeComponente
                      className={`h-5 w-5 ${
                        notificacao.lida
                          ? "text-gray-500"
                          : getCoresDoTexto(notificacao.cor)
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`text-sm font-medium ${
                          notificacao.lida ? "text-gray-600" : "text-gray-900"
                        }`}
                      >
                        {notificacao.titulo}
                      </h4>
                      {!notificacao.lida && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        notificacao.lida ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {notificacao.descricao}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notificacao.tempo}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ações rápidas */}
      <div className="flex gap-4">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Marcar todas como lidas
        </button>
        <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
          Configurar notificações
        </button>
      </div>
    </div>
  );
};

export default Notificacoes;
