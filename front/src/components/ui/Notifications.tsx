import {
  Bell,
  X,
  CheckCheck,
  FileText,
  Calendar,
  Trophy,
  BookOpen,
  Video,
  Award,
  Clock,
  Settings,
  History,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  useAlunoNotifications,
  type Notification,
} from "@/hooks/useAlunoNotifications";

export type { Notification };

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useAlunoNotifications();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

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

  const handleClickNotification = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      setIsOpen(false);
      router.push(notification.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão de Notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
      >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-purple-700"></span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-xl bg-white text-gray-800 shadow-2xl ring-1 ring-black/10 overflow-hidden border border-gray-200 z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-violet-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </h3>
                <p className="text-sm opacity-90">
                  {unreadCount > 0
                    ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}`
                    : "Todas lidas"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition disabled:opacity-50"
                disabled={loading}
              >
                <CheckCheck className="h-4 w-4 inline mr-1" />
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* Conteúdo */}
          <div className="max-h-96 overflow-y-auto">
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 border-b border-red-100">
                {error}
              </div>
            )}

            {loading ? (
              <div className="p-6 text-center text-gray-500">
                Carregando notificações...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleClickNotification(notification)}
                  className={`relative p-4 border-b border-gray-100 transition cursor-pointer ${
                    !notification.read
                      ? "bg-violet-50 border-l-4 border-l-violet-500 hover:bg-violet-100"
                      : "opacity-60 hover:opacity-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
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
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-500"
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
                        <span className="text-gray-500">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - ver histórico completo */}
          <div className="border-t border-gray-100 p-3 bg-gray-50">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/aluno/notificacoes");
              }}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-violet-700 hover:text-violet-900 transition py-1"
            >
              <History className="h-4 w-4" />
              Ver histórico completo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
