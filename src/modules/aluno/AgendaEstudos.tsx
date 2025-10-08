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

// ==================== TIPOS E INTERFACES ====================

type RevisionEvent = {
  id: string;
  title: string;
  date: string;
  subject: string;
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

// ==================== DADOS MOCK ====================

const mockRevisionEvents: RevisionEvent[] = [
  {
    id: "1",
    title: "Quiz - Funções Matemáticas",
    date: "2025-10-07", // Hoje
    subject: "Matemática",
    type: "revision",
    completed: false,
    linkType: "atividade",
    disciplinaId: "mat",
    itemId: "a9",
  },
  {
    id: "2",
    title: "Revisão Brasil Colônia",
    date: "2025-10-10",
    subject: "História",
    type: "revision",
    completed: false,
    linkType: "resumo",
    disciplinaId: "hist",
    itemId: "r3",
  },
  {
    id: "3",
    title: "Lista de Equações 1",
    date: "2025-10-12",
    subject: "Matemática",
    type: "study",
    completed: false,
    linkType: "atividade",
    disciplinaId: "mat",
    itemId: "a1",
  },
  {
    id: "4",
    title: "Quiz - Figuras de Linguagem",
    date: "2025-10-15",
    subject: "Português",
    type: "exam",
    completed: false,
    linkType: "atividade",
    disciplinaId: "port",
    itemId: "a12",
  },
  {
    id: "5",
    title: "Quiz - Sistema Digestório",
    date: "2025-10-18",
    subject: "Biologia",
    type: "revision",
    completed: false,
    linkType: "atividade",
    disciplinaId: "bio",
    itemId: "a10",
  },
];

// ==================== COMPONENTE PRINCIPAL ====================

export default function Frequencia() {
  // ==================== HOOKS ====================
  const router = useRouter();
  
  // ==================== ESTADOS ====================
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events] = useState<RevisionEvent[]>(mockRevisionEvents);
  const [showNotification, setShowNotification] = useState(true);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<RevisionEvent[]>(
    []
  );

  // ==================== EFFECTS ====================
  useEffect(() => {
    setMounted(true);
    // Simular notificação de revisão para hoje
    const today = new Date().toISOString().split("T")[0];
    const todayEvents = events.filter(
      (event) => event.date === today && !event.completed
    );
    if (todayEvents.length > 0) {
      setShowNotification(true);
    }
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
    // Aqui você pode implementar a lógica para marcar como concluído
    console.log("Evento concluído:", eventId);
  };

  const handleNavigateToItem = (event: RevisionEvent) => {
    if (event.linkType && event.disciplinaId && event.itemId) {
      if (event.linkType === "atividade") {
        router.push(`/aluno/disciplinas/${event.disciplinaId}/atividades/${event.itemId}`);
      } else if (event.linkType === "resumo") {
        router.push(`/aluno/disciplinas/${event.disciplinaId}/resumos`);
      }
      setShowDayModal(false);
    }
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
      {/* ==================== HEADER ==================== */}
      <header className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Calendário de Revisão
          </h1>
          <p className="text-gray-600">
            Revisões baseadas no método de Ebbinghaus escolhido em disciplinas
          </p>
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
            {days.map((day, index) => (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                className={`
                  relative h-16 p-2 rounded-lg border-2 cursor-pointer smooth-transition
                  ${
                    day.isCurrentMonth
                      ? day.isToday
                        ? "bg-violet-100 border-violet-300 font-bold"
                        : day.hasEvents
                        ? "bg-yellow-50 border-yellow-300 hover:bg-yellow-100"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      : "bg-gray-25 border-gray-100 text-gray-400"
                  }
                `}
              >
                <div
                  className={`text-sm ${
                    day.isToday ? "text-violet-700" : "text-gray-700"
                  }`}
                >
                  {day.date.getDate()}
                </div>

                {/* Indicadores de Eventos */}
                {day.hasEvents && (
                  <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1">
                    {day.events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`w-2 h-2 rounded-full ${
                          getEventTypeColor(event.type).split(" ")[0]
                        }`}
                        title={event.title}
                      />
                    ))}
                    {day.events.length > 2 && (
                      <div className="text-xs text-gray-600 font-bold">
                        +{day.events.length - 2}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ==================== MODAL DE ATIVIDADES DO DIA ==================== */}
      {showDayModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden card-bounce">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-violet-500 to-violet-600 p-6 text-white">
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
                    {/* Cabeçalho da Atividade */}
                    <div className="flex items-start gap-4 mb-3">
                      <div
                        className={`p-3 rounded-xl ${getEventTypeColor(
                          event.type
                        )}`}
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

                    {/* Botões de Ação */}
                    <div className="flex justify-between items-center gap-3">
                      {/* Botão para acessar atividade/resumo */}
                      {event.linkType && event.disciplinaId && event.itemId && (
                        <Button
                          onClick={() => handleNavigateToItem(event)}
                          className="bg-violet-500 hover:bg-violet-600 text-white shadow-md hover:shadow-lg smooth-transition flex items-center gap-2"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {event.linkType === "atividade" ? "Ir para Atividade" : "Ir para Resumo"}
                        </Button>
                      )}
                      
                      {/* Botão para marcar como concluído */}
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
    </div>
  );
}
