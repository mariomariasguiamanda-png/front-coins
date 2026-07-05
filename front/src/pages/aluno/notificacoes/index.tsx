"use client";

import { useRouter } from "next/router";
import { getAlunoLayout } from "@/components/layout/AlunoLayout";
import type { NextPageWithLayout } from "@/pages/_app";
import {
  useAlunoNotifications,
  type Notification,
} from "@/hooks/useAlunoNotifications";
import {
  Bell,
  CheckCheck,
  FileText,
  Calendar,
  Trophy,
  BookOpen,
  Video,
  Award,
  Clock,
  Settings,
} from "lucide-react";

const getNotificationIcon = (category: Notification["category"]) => {
  const iconClass = "h-5 w-5";
  switch (category) {
    case "resumo":
      return <FileText className={iconClass} />;
    case "atividade":
      return <Calendar className={iconClass} />;
    case "videoaula":
      return <Video className={iconClass} />;
    case "nota":
      return <Award className={iconClass} />;
    case "conquista":
      return <Trophy className={iconClass} />;
    case "prazo":
      return <Clock className={iconClass} />;
    case "material":
      return <BookOpen className={iconClass} />;
    case "sistema":
      return <Settings className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

const getIconColor = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return "text-green-600 bg-green-100";
    case "warning":
      return "text-amber-600 bg-amber-100";
    case "error":
      return "text-red-600 bg-red-100";
    case "achievement":
      return "text-purple-600 bg-purple-100";
    default:
      return "text-blue-600 bg-blue-100";
  }
};

const getDisciplineColor = (discipline?: string) => {
  const colors: Record<string, string> = {
    Matemática: "text-blue-600",
    Física: "text-purple-600",
    Química: "text-green-600",
    Inglês: "text-orange-600",
    Português: "text-pink-600",
    História: "text-amber-600",
    Biologia: "text-emerald-600",
    Sistema: "text-gray-600",
  };
  return colors[discipline || ""] || "text-violet-600";
};

const NotificacoesPage: NextPageWithLayout = () => {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  } = useAlunoNotifications();

  const handleClick = (notification: Notification) => {
    if (!notification.read) markAsRead(notification.id);
    if (notification.link) router.push(notification.link);
  };

  return (
    <div className="px-8 py-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-6 w-6 text-violet-600" />
              Histórico de notificações
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount > 0
                ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}`
                : "Todas lidas"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 text-white text-sm font-medium px-4 py-2 hover:bg-violet-700 transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              Marcar todas como lidas
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Carregando notificações...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>Nenhuma notificação por aqui ainda.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={`flex items-start gap-3 p-4 border-b border-gray-100 last:border-b-0 transition ${
                  notification.link ? "cursor-pointer" : ""
                } ${
                  !notification.read
                    ? "bg-violet-50 border-l-4 border-l-violet-500 hover:bg-violet-100"
                    : "opacity-60 hover:opacity-100 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`relative h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(
                    notification.type
                  )}`}
                >
                  {!notification.read && (
                    <span className="absolute inset-0 rounded-lg animate-ping bg-current opacity-20" />
                  )}
                  {getNotificationIcon(notification.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`font-semibold text-sm ${
                        !notification.read ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600"></span>
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mb-2 ${
                      !notification.read ? "text-gray-600" : "text-gray-500"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-medium ${getDisciplineColor(
                        notification.discipline
                      )}`}
                    >
                      {notification.discipline || "Sistema"}
                    </span>
                    <span className="text-gray-500">{notification.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

NotificacoesPage.getLayout = getAlunoLayout;

export default NotificacoesPage;
