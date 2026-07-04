"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getAlunoFromSession } from "@/lib/getAlunoFromSession";

// ==================== TIPOS E INTERFACES ====================

type RevisionEvent = {
  id: string;
  title: string;
  date: string;
  subject?: string;
  type: "revision" | "study" | "exam";
  completed: boolean;
  linkType?: "atividade" | "resumo";
  disciplinaId?: string;
  itemId?: string;
};

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  events: RevisionEvent[];
};

// ==================== DADOS INICIAIS ====================
// Inicia sem mocks; carregará do Supabase ou localStorage (fallback)

// ==================== STATUS DE EVENTOS ====================
function getStatusColor(event: RevisionEvent) {
  const today = new Date().toISOString().split("T")[0];
  if (event.completed) return "completed"; // verde
  if (event.date < today) return "overdue"; // vermelho
  return "pending"; // amarelo
}

function getDayStatusClass(eventsOfDay: RevisionEvent[]) {
  if (eventsOfDay.length === 0) return "";
  const today = new Date().toISOString().split("T")[0];
  const hasOverdue = eventsOfDay.some((e) => !e.completed && e.date < today);
  const allCompleted = eventsOfDay.every((e) => e.completed);
  if (hasOverdue) return "bg-red-100 border-red-400";
  if (allCompleted) return "bg-green-100 border-green-400";
  return "bg-yellow-100 border-yellow-400";
}

function StatusLegend() {
  return (
    <div className="mt-4 mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-md bg-green-100 border border-green-400" />
        <span>Concluído</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-md bg-yellow-100 border border-yellow-400" />
        <span>Pendente</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-md bg-red-100 border border-red-400" />
        <span>Atrasado</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-md bg-purple-100 border border-purple-400" />
        <span>Dia Atual</span>
      </div>
    </div>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================

export default function Frequencia() {
  // ==================== HOOKS ====================
  const router = useRouter();

  // ==================== ESTADOS ====================
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<RevisionEvent[]>([]);
  const [showNotification, setShowNotification] = useState(true);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<RevisionEvent[]>(
    []
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<RevisionEvent>>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    subject: "",
    type: "revision",
    completed: false,
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [datePickerCursor, setDatePickerCursor] = useState<Date>(new Date());

  // ==================== EFFECTS ====================
  useEffect(() => {
    setMounted(true);

    const fetchAll = async () => {
      // 1) Tenta obter id do aluno da sessão
      let idAluno: number | null = null;
      try {
        const aluno = await getAlunoFromSession();
        idAluno = (aluno?.idAluno ?? null) as number | null;
      } catch {}

      // 2) Se tiver idAluno, busca direto na tabela agenda_estudos
      if (idAluno != null) {
        const { data, error } = await supabase
          .from("agenda_estudos")
          .select("*")
          .eq("id_aluno", idAluno)
          .order("data_estudo", { ascending: true });

        if (!error && data && Array.isArray(data)) {
          const mapped: RevisionEvent[] = data.map((row: any) => ({
            id: String(row.id_evento),
            title: row.titulo || "Estudo",
            date: row.data_estudo, // formato "YYYY-MM-DD"
            subject: row.assunto || "",
            type: (row.tipo as RevisionEvent["type"]) || "study",
            completed: !!row.concluido,
            linkType: row.link_type as RevisionEvent["linkType"] | undefined,
            disciplinaId: row.disciplina_id || undefined,
            itemId: row.item_id || undefined,
          }));
          setEvents(mapped);
          return;
        } else if (error) {
          console.error("Erro ao buscar agenda_estudos:", error);
        }
      }

      // 3) Se não achar aluno ou der erro, tenta carregar do localStorage (mock/offline)
      try {
        const saved = localStorage.getItem("agendaEventos");
        if (saved) {
          const parsed: RevisionEvent[] = JSON.parse(saved);
          setEvents(parsed);
        }
      } catch {}
    };

    fetchAll();
  }, []);

  useEffect(() => {
    // Persistência sempre que eventos mudarem
    try {
      localStorage.setItem("agendaEventos", JSON.stringify(events));
    } catch {}

    // Notificação para hoje se houver eventos não concluídos
    const today = new Date().toISOString().split("T")[0];
    const todayEvents = events.filter(
      (event) => event.date === today && !event.completed
    );
    setShowNotification(todayEvents.length > 0);
  }, [events]);

  if (!mounted) return null;

  // ==================== FUNÇÕES AUXILIARES ====================
  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: false,
        hasEvents: false,
        events: [],
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dateStr = dayDate.toISOString().split("T")[0];
      const dayEvents = events.filter((event) => event.date === dateStr);
      const isToday = dateStr === new Date().toISOString().split("T")[0];

      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday,
        hasEvents: dayEvents.length > 0,
        events: dayEvents,
      });
    }

    // Completar com dias do próximo mês se necessário
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let day = 1; days.length < totalCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false,
        hasEvents: false,
        events: [],
      });
    }

    return days;
  };

  const getEventTypeColor = (type: RevisionEvent["type"]) => {
    switch (type) {
      case "revision":
        return "bg-yellow-400 text-yellow-900";
      case "study":
        return "bg-blue-400 text-blue-900";
      case "exam":
        return "bg-red-400 text-red-900";
      default:
        return "bg-gray-400 text-gray-900";
    }
  };

  const getEventTypeIcon = (type: RevisionEvent["type"]) => {
    switch (type) {
      case "revision":
        return <Clock className="h-3 w-3" />;
      case "study":
        return <BookOpen className="h-3 w-3" />;
      case "exam":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <BookOpen className="h-3 w-3" />;
    }
  };

  // ==================== DATE PICKER HELPERS ====================
  const daysForPicker = (cursor: Date) => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startWeekday = first.getDay();
    const grid: { d: Date; inMonth: boolean }[] = [];
    for (let i = startWeekday - 1; i >= 0; i--) {
      grid.push({ d: new Date(year, month, -i), inMonth: false });
    }
    for (let day = 1; day <= last.getDate(); day++) {
      grid.push({ d: new Date(year, month, day), inMonth: true });
    }
    const total = Math.ceil(grid.length / 7) * 7;
    for (let day = 1; grid.length < total; day++) {
      grid.push({ d: new Date(year, month + 1, day), inMonth: false });
    }
    return grid;
  };

  const selectDateFromPicker = (d: Date) => {
    const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      .toISOString()
      .split("T")[0];
    setNewEvent((prev) => ({ ...prev, date: iso }));
    setDatePickerOpen(false);
  };

  const formatDateBR = (iso?: string) => {
    if (!iso) return "Selecione uma data";
    const [y, m, d] = iso.split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  };

  // ==================== HANDLERS ====================
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.hasEvents) {
      setSelectedDate(day.date);
      setSelectedDayEvents(day.events);
      setShowDayModal(true);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleCloseDayModal = () => {
    setShowDayModal(false);
    setSelectedDate(null);
    setSelectedDayEvents([]);
  };

  const handleCompleteEvent = (eventId: string) => {
    // Atualiza estado local
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, completed: true } : ev))
    );

    // Reflete no Supabase
    (async () => {
      try {
        const { error } = await supabase
          .from("agenda_estudos")
          .update({ concluido: true })
          .eq("id_evento", Number(eventId));
        if (error) console.error("Erro ao marcar conclusão:", error);
      } catch (e) {
        console.error("Falha ao atualizar conclusão no Supabase:", e);
      }
    })();
  };

  const handleNavigateToItem = (event: RevisionEvent) => {
    if (event.linkType && event.disciplinaId && event.itemId) {
      if (event.linkType === "atividade") {
        router.push(
          `/aluno/disciplinas/${event.disciplinaId}/atividades/${event.itemId}`
        );
      } else if (event.linkType === "resumo") {
        router.push(`/aluno/disciplinas/${event.disciplinaId}/resumos`);
      }
      setShowDayModal(false);
    }
  };

  const handleCreateEvent = async () => {
    // Validação mínima
    if (!newEvent.title || !newEvent.date || !newEvent.type) return;

    // 1) Obter aluno da sessão
    const aluno = await getAlunoFromSession();
    const idAluno = aluno?.idAluno ?? null;

    if (idAluno == null) {
      console.error("Aluno não encontrado na sessão.");
      return;
    }

    // 2) Inserir primeiro no Supabase e obter o ID real
    const { data, error } = await supabase
      .from("agenda_estudos")
      .insert({
        id_aluno: idAluno,
        data_estudo: newEvent.date!,
        titulo: newEvent.title!,
        assunto: newEvent.subject || null,
        tipo: newEvent.type as "revision" | "study" | "exam",
        link_type: newEvent.linkType ?? null,
        disciplina_id: newEvent.disciplinaId ?? null,
        item_id: newEvent.itemId ?? null,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Erro ao salvar evento no Supabase:", error);
      return;
    }

    // 3) Construir o objeto usando o id_evento do banco
    const created: RevisionEvent = {
      id: String(data.id_evento),
      title: data.titulo,
      date: data.data_estudo,
      subject: data.assunto || "",
      type: data.tipo as RevisionEvent["type"],
      completed: !!data.concluido,
      linkType: data.link_type as RevisionEvent["linkType"] | undefined,
      disciplinaId: data.disciplina_id || undefined,
      itemId: data.item_id || undefined,
    };

    // 4) Atualizar o estado com o ID correto
    setEvents((prev) => [...prev, created]);

    // 5) Fechar modal e limpar campos
    setShowCreateModal(false);
    setNewEvent({
      title: "",
      date: new Date().toISOString().split("T")[0],
      subject: "",
      type: "revision",
      completed: false,
    });
  };

  // ==================== RENDER ====================
  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="page-enter space-y-6">
      {/* ==================== CONTEÚDO PRINCIPAL (DESABILITA QUANDO MODAL ABERTO) ==================== */}
      <div
        className={`
          ${showCreateModal || showDayModal ? "pointer-events-none aria-hidden" : "pointer-events-auto"}
        `}
      >
        {/* ==================== HEADER ==================== */}
        <header className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Calendário de Revisão
            </h1>
          </div>
          <div className="ml-auto">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-violet-500 hover:bg-violet-600 text-white shadow-md hover:shadow-lg smooth-transition flex items-center gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Novo Evento
            </Button>
          </div>
        </header>

        {/* ==================== NOTIFICAÇÃO ==================== */}
        {showNotification && (
          <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl p-4 flex items-center justify-between card-bounce shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Dia de revisão!</p>
                <p className="text-sm opacity-90">
                  Não se esqueça de revisar o conteúdo para melhorar seu
                  desempenho!
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseNotification}
              className="p-1 hover:bg-white/20 rounded-full smooth-transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ==================== CALENDÁRIO ==================== */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg card-bounce card-bounce-delay-1">
          <CardContent className="p-6">
            {/* Controles do Calendário */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg smooth-transition"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>

              <h2 className="text-xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg smooth-transition"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Legenda de status */}
            <StatusLegend />

            {/* Headers dos Dias da Semana */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map((dayName) => (
                <div
                  key={dayName}
                  className="text-center text-sm font-semibold text-gray-600 py-2"
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Grid do Calendário */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const dateStr = day.date.toISOString().split("T")[0];
                const eventsOfDay = events.filter((ev) => ev.date === dateStr);
                const dayStatusClass = getDayStatusClass(eventsOfDay);
                const baseMonthClass = day.isCurrentMonth
                  ? ""
                  : "bg-gray-25 border-gray-100 text-gray-400";
                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`
                      relative h-16 p-2 rounded-lg cursor-pointer smooth-transition
                      ${baseMonthClass}
                      ${dayStatusClass}
                      ${day.isToday ? "bg-violet-100 border border-violet-300 font-bold" : ""}
                      ${eventsOfDay.length === 0 && !day.isToday ? "border border-gray-200" : ""}
                    `}
                  >
                    <div
                      className={`text-sm ${
                        day.isToday ? "text-violet-700" : "text-gray-700"
                      }`}
                    >
                      {day.date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* ==================== MODAL DE ATIVIDADES DO DIA ==================== */}
      {showDayModal && selectedDate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-90 p-4"
          onClick={handleCloseDayModal}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full card-bounce"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="bg-[#4B2992] p-6 text-white border-b border-[#3a206b]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Atividades do Dia</h3>
                  <p className="text-sm opacity-90">
                    {selectedDate.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
                <button
                  onClick={handleCloseDayModal}
                  className="p-2 hover:bg-white/20 rounded-full smooth-transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {selectedDayEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`p-5 rounded-xl border-2 smooth-transition hover:shadow-md ${
                      event.type === "revision"
                        ? "bg-yellow-50 border-yellow-200 hover:border-yellow-300"
                        : event.type === "study"
                          ? "bg-blue-50 border-blue-200 hover:border-blue-300"
                          : "bg-red-50 border-red-200 hover:border-red-300"
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <div
                        className={`p-3 rounded-xl ${getEventTypeColor(event.type)}`}
                      >
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-lg">
                            {event.title}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              event.type === "revision"
                                ? "bg-yellow-200 text-yellow-800"
                                : event.type === "study"
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-red-200 text-red-800"
                            }`}
                          >
                            {event.type === "revision"
                              ? "Revisão"
                              : event.type === "study"
                                ? "Estudo"
                                : "Prova"}
                          </span>
                        </div>
                        <p className="text-violet-600 font-semibold mb-2">
                          📚 {event.subject}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {event.type === "revision"
                            ? "Faça uma revisão dos conceitos principais para fixar o aprendizado."
                            : event.type === "study"
                              ? "Estude o conteúdo com atenção e faça exercícios."
                              : "Prepare-se bem para a avaliação."}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      {event.linkType && event.disciplinaId && event.itemId && (
                        <Button
                          onClick={() => handleNavigateToItem(event)}
                          className="bg-violet-500 hover:bg-violet-600 text-white shadow-md hover:shadow-lg smooth-transition flex items-center gap-2"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {event.linkType === "atividade"
                            ? "Ir para Atividade"
                            : "Ir para Resumo"}
                        </Button>
                      )}

                      <Button
                        onClick={() => handleCompleteEvent(event.id)}
                        className={`${
                          event.completed
                            ? "bg-green-500 hover:bg-green-600"
                            : event.type === "revision"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : event.type === "study"
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-red-500 hover:bg-red-600"
                        } text-white shadow-md hover:shadow-lg smooth-transition`}
                        size="sm"
                      >
                        {event.completed ? "✓ Concluído" : "Marcar como Feito"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL CRIAR EVENTO ==================== */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-90 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-visible -translate-y-6 md:-translate-y-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#4B2992] p-6 text-white border-b border-[#3a206b] flex items-center justify-between">
              <h3 className="text-xl font-bold">Novo Evento</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-white/20 rounded-full smooth-transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Título
                </label>
                <input
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  value={newEvent.title as string}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Ex.: Revisão de Frações"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-sm font-semibold text-gray-700">
                    Data
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setDatePickerOpen((o) => !o);
                      const parts = (newEvent.date as string).split("-");
                      if (parts.length === 3) {
                        const d = new Date(
                          Number(parts[0]),
                          Number(parts[1]) - 1,
                          Number(parts[2])
                        );
                        if (!isNaN(d.getTime())) setDatePickerCursor(d);
                      }
                    }}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-left hover:bg-gray-50 smooth-transition"
                  >
                    {formatDateBR(newEvent.date as string)}
                  </button>

                  {datePickerOpen && (
                    <div className="absolute z-[1100] mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-64">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() =>
                            setDatePickerCursor(
                              new Date(
                                datePickerCursor.getFullYear(),
                                datePickerCursor.getMonth() - 1,
                                1
                              )
                            )
                          }
                        >
                          <ChevronLeft className="h-4 w-4 text-gray-600" />
                        </button>
                        <div className="text-sm font-semibold text-gray-700">
                          {
                            [
                              "Jan",
                              "Fev",
                              "Mar",
                              "Abr",
                              "Mai",
                              "Jun",
                              "Jul",
                              "Ago",
                              "Set",
                              "Out",
                              "Nov",
                              "Dez",
                            ][datePickerCursor.getMonth()]
                          }{" "}
                          {datePickerCursor.getFullYear()}
                        </div>
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() =>
                            setDatePickerCursor(
                              new Date(
                                datePickerCursor.getFullYear(),
                                datePickerCursor.getMonth() + 1,
                                1
                              )
                            )
                          }
                        >
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
                        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                          (l) => (
                            <div key={l} className="py-1">
                              {l}
                            </div>
                          )
                        )}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {daysForPicker(datePickerCursor).map(
                          ({ d, inMonth }, idx) => {
                            const iso = new Date(
                              Date.UTC(
                                d.getFullYear(),
                                d.getMonth(),
                                d.getDate()
                              )
                            )
                              .toISOString()
                              .split("T")[0];
                            const isSelected =
                              (newEvent.date as string) === iso;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => selectDateFromPicker(d)}
                                className={`py-2 text-sm rounded-lg smooth-transition ${
                                  inMonth ? "text-gray-800" : "text-gray-400"
                                } ${
                                  isSelected
                                    ? "bg-violet-100 border border-violet-300"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                {d.getDate()}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Disciplina
                  </label>
                  <input
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                    value={newEvent.subject as string}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Ex.: Matemática"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Tipo
                  </label>
                  <select
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                    value={newEvent.type as string}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        type: e.target.value as RevisionEvent["type"],
                      }))
                    }
                  >
                    <option value="revision">Revisão</option>
                    <option value="study">Estudo</option>
                    <option value="exam">Prova</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Vincular a
                  </label>
                  <select
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                    value={newEvent.linkType || ""}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        linkType: e.target.value as "atividade" | "resumo",
                      }))
                    }
                  >
                    <option value="">Nenhum</option>
                    <option value="atividade">Atividade</option>
                    <option value="resumo">Resumo</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900"
                  size="sm"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateEvent}
                  className="bg-violet-500 hover:bg-violet-600 text-white"
                  size="sm"
                >
                  Salvar Evento
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
