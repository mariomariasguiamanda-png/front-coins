import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmBackButton } from "@/components/adm/AdmBackButton";
import { Card, CardContent } from "@/components/ui/Card";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Calendar,
  Users,
} from "lucide-react";
import { getTickets, Ticket } from "@/services/api/support";

const PRAZO_MS = 48 * 60 * 60 * 1000;

export default function SuporteAnalyticsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setTickets(await getTickets());
      } catch (err) {
        console.error("Erro ao carregar chamados:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const metricas = useMemo(() => {
    const agora = Date.now();
    const inicioSemana = agora - 7 * 24 * 60 * 60 * 1000;

    const total = tickets.length;
    const resolvidos = tickets.filter((t) => t.status === "resolvido");
    const abertos = tickets.filter((t) => t.status === "aberto");
    const emAndamento = tickets.filter((t) => t.status === "em_andamento");
    const estaSemana = tickets.filter((t) => new Date(t.dataAbertura).getTime() >= inicioSemana);
    const pendentesForaPrazo = tickets.filter(
      (t) => t.status !== "resolvido" && agora - new Date(t.dataAbertura).getTime() > PRAZO_MS,
    );

    // Tempo de resposta = data da resposta - abertura, só pros respondidos
    const temposMs = tickets
      .filter((t) => t.respostas.length > 0)
      .map((t) => new Date(t.respostas[0].dataHora).getTime() - new Date(t.dataAbertura).getTime())
      .filter((ms) => ms >= 0);
    const tempoMedioH =
      temposMs.length > 0 ? temposMs.reduce((s, n) => s + n, 0) / temposMs.length / 3600000 : null;

    const faixa = (min: number, max: number) =>
      temposMs.length > 0
        ? Math.round(
            (temposMs.filter((ms) => ms / 3600000 >= min && ms / 3600000 < max).length /
              temposMs.length) *
              100,
          )
        : 0;

    const porPerfil = new Map<string, number>();
    for (const t of tickets) {
      const perfil =
        t.solicitantePerfil === "aluno"
          ? "Alunos"
          : t.solicitantePerfil === "professor"
          ? "Professores"
          : "Administração";
      porPerfil.set(perfil, (porPerfil.get(perfil) ?? 0) + 1);
    }

    return {
      total,
      tempoMedioH,
      taxaResolucao: total > 0 ? Math.round((resolvidos.length / total) * 100) : 0,
      foraPrazo: pendentesForaPrazo.length,
      estaSemana: estaSemana.length,
      abertos: abertos.length,
      emAndamento: emAndamento.length,
      resolvidos: resolvidos.length,
      ate1h: faixa(0, 1),
      de1a4h: faixa(1, 4),
      mais4h: faixa(4, Infinity),
      porPerfil: Array.from(porPerfil.entries()),
    };
  }, [tickets]);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics e Métricas</h1>
                <p className="text-gray-600 mt-1">Indicadores calculados sobre os chamados reais</p>
              </div>
            </div>
            <AdmBackButton href="/adm/suporte" className="no-underline" />
          </div>

          {/* Primary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Chamados</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metricas.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tempo Médio de Resposta</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {metricas.tempoMedioH !== null ? `${metricas.tempoMedioH.toFixed(1)}h` : "—"}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa Resolução</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metricas.taxaResolucao}%</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendentes &gt; 48h</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metricas.foraPrazo}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {loading && (
          <p className="text-sm text-muted-foreground text-center py-4">Carregando métricas...</p>
        )}

        {/* Secondary Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Abertos Esta Semana</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{metricas.estaSemana}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" /> Chamados por Perfil
                </p>
                <div className="flex flex-wrap gap-2">
                  {metricas.porPerfil.length === 0 && (
                    <span className="text-sm text-muted-foreground">Nenhum chamado ainda</span>
                  )}
                  {metricas.porPerfil.map(([perfil, qtd]) => (
                    <span
                      key={perfil}
                      className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700"
                    >
                      {perfil}: {qtd}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-xl shadow-sm">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Chamados por Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                  <span className="text-sm font-medium text-gray-700">Abertos</span>
                  <span className="text-lg font-bold text-amber-600">{metricas.abertos}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                  <span className="text-sm font-medium text-gray-700">Em Andamento</span>
                  <span className="text-lg font-bold text-blue-600">{metricas.emAndamento}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                  <span className="text-sm font-medium text-gray-700">Resolvidos</span>
                  <span className="text-lg font-bold text-green-600">{metricas.resolvidos}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm">
            <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl"></div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Tempo de Resposta (chamados respondidos)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
                  <span className="text-sm font-medium text-gray-700">&lt; 1 hora</span>
                  <span className="text-lg font-bold text-green-600">{metricas.ate1h}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                  <span className="text-sm font-medium text-gray-700">1-4 horas</span>
                  <span className="text-lg font-bold text-blue-600">{metricas.de1a4h}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                  <span className="text-sm font-medium text-gray-700">&gt; 4 horas</span>
                  <span className="text-lg font-bold text-amber-600">{metricas.mais4h}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
