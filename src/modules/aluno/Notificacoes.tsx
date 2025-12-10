import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { FaRegBell, FaRegClock } from "react-icons/fa6";
import { Calendar, Award, BookOpen } from "lucide-react";
import { useAlunoNotificacoes } from "@/hooks/useAlunoNotificacoes";

const mapTipoParaIconeECor = (tipo: string | null) => {
  switch (tipo) {
    case "atividade":
      return { icon: BookOpen, cor: "blue" };
    case "prazo":
      return { icon: FaRegClock, cor: "amber" };
    case "conquista":
      return { icon: Award, cor: "green" };
    case "lembrete":
      return { icon: Calendar, cor: "purple" };
    default:
      return { icon: FaRegBell, cor: "gray" };
  }
};

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

const Notificacoes = () => {
  const {
    notificacoes,
    naoLidas,
    loading,
    erro,
    marcarComoLida,
    marcarTodasComoLidas,
  } = useAlunoNotificacoes();

  const totalHoje = notificacoes.filter((n) =>
    n.tempo.toLowerCase().includes("hora")
  ).length;
  const totalConquistas = notificacoes.filter(
    (n) => n.tipo === "conquista"
  ).length;

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

      {erro && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {erro}
        </p>
      )}

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
                <p className="text-2xl font-bold text-blue-900">{totalHoje}</p>
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
                  {totalConquistas}
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

          {loading ? (
            <p className="text-sm text-gray-500">Carregando...</p>
          ) : notificacoes.length === 0 ? (
            <p className="text-sm text-gray-500">
              Você não possui notificações no momento.
            </p>
          ) : (
            <div className="space-y-3">
              {notificacoes.map((notificacao) => {
                const { icon: IconeComponente, cor } = mapTipoParaIconeECor(
                  notificacao.tipo
                );
                return (
                  <div
                    key={notificacao.id_notificacao}
                    className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition ${
                      notificacao.lida
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-200 shadow-sm hover:shadow-md"
                    }`}
                    onClick={() =>
                      !notificacao.lida &&
                      marcarComoLida(notificacao.id_notificacao)
                    }
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        notificacao.lida
                          ? "bg-gray-200"
                          : getCoresDeFundo(cor, false)
                      }`}
                    >
                      <IconeComponente
                        className={`h-5 w-5 ${
                          notificacao.lida
                            ? "text-gray-500"
                            : getCoresDoTexto(cor)
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
                          {notificacao.titulo || "Notificação"}
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
                        {notificacao.mensagem}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notificacao.tempo}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações rápidas */}
      <div className="flex gap-4">
        <button
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          onClick={marcarTodasComoLidas}
          disabled={loading || naoLidas === 0}
        >
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
