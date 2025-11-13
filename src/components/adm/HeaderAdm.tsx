"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Menu, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { admin } from "@/lib/mock/admin";
import { Notifications } from "@/components/ui/Notifications";

type HeaderAdmProps = {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
};

// Mock de notificações
const mockNotifications = [
  {
    id: "1",
    type: "error" as const,
    category: "sistema" as const,
    title: "Falha no Backup",
    message: "O backup automático das 02:00 falhou. Verificação necessária.",
    discipline: "Sistema",
    time: "Há 15 minutos",
    read: false,
  },
  {
    id: "2",
    type: "info" as const,
    category: "sistema" as const,
    title: "Novos Usuários",
    message: "15 novos alunos se cadastraram hoje",
    discipline: "Sistema",
    time: "Há 1 hora",
    read: false,
  },
  {
    id: "3",
    type: "warning" as const,
    category: "sistema" as const,
    title: "Armazenamento",
    message: "Uso de armazenamento atingiu 85% da capacidade",
    discipline: "Sistema",
    time: "Há 3 horas",
    read: false,
  },
  {
    id: "4",
    type: "success" as const,
    category: "sistema" as const,
    title: "Atualização Concluída",
    message: "Sistema atualizado para versão 2.5.0 com sucesso",
    discipline: "Sistema",
    time: "Há 1 dia",
    read: true,
  },
];

export function HeaderAdm({ onToggleSidebar, sidebarOpen }: HeaderAdmProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-br from-[#7C3AED] via-[#7C3AED] to-[#7C3AED] text-white border-b border-white/20">
      <div className="w-full px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label={
                sidebarOpen ? "Fechar menu lateral" : "Abrir menu lateral"
              }
              aria-pressed={!!sidebarOpen}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          )}
          <Link href="/adm/dashboard" className="flex items-center gap-2 group">
            <Image
              src="/logo-coins.png"
              alt="Coins for Study"
              width={36}
              height={36}
              className="rounded-sm"
            />
            <span className="text-sm font-semibold tracking-wide group-hover:opacity-90">
              Coins for Study
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Notifications
            notifications={notifications}
            onMarkAsRead={(id: string) => {
              setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
              );
            }}
            onMarkAllAsRead={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            }}
            onDelete={(id: string) => {
              setNotifications((prev) => prev.filter((n) => n.id !== id));
            }}
          />

          <Link
            href="/adm/perfil"
            className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-2 py-1 transition"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 grid place-items-center text-xs font-bold text-[#fff]">
              {admin.nome.split(" ")[0][0]}
            </div>
            <span className="text-sm hidden sm:block max-w-[140px] truncate">
              {admin.nome}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
