import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
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
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Settings,
  TrendingUp,
  Coins
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error" | "achievement";
  category: "resumo" | "atividade" | "videoaula" | "nota" | "conquista" | "sistema" | "prazo" | "material";
  title: string;
  message: string;
  discipline?: string;
  time: string;
  read: boolean;
  icon?: React.ReactNode;
}

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

export function Notifications({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const getNotificationIcon = (category: string, type: string) => {
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

  const getNotificationColor = (type: string, read: boolean) => {
    if (read) return "bg-gray-50 border-gray-200";
    
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "achievement":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getIconColor = (type: string) => {
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
      "Matemática": "text-blue-600",
      "Física": "text-purple-600",
      "Química": "text-green-600",
      "Inglês": "text-orange-600",
      "Português": "text-pink-600",
      "História": "text-amber-600",
      "Biologia": "text-emerald-600",
      "Sistema": "text-gray-600",
    };
    return colors[discipline || ""] || "text-violet-600";
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
          {/* Header do Dropdown */}
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
                onClick={onMarkAllAsRead}
                className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
              >
                <CheckCheck className="h-4 w-4 inline mr-1" />
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && onMarkAsRead(notification.id)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                    !notification.read
                      ? "bg-violet-50 border-l-4 border-l-violet-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                      {getNotificationIcon(notification.category, notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={`font-semibold text-sm ${
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-medium ${getDisciplineColor(notification.discipline)}`}
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
        </div>
      )}
    </div>
  );
}
