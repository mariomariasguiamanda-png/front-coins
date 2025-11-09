"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Menu, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { professor } from "@/lib/mock/professor";
import { Notifications } from "@/components/ui/Notifications";

type ProfessorHeaderProps = {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
};

// Mock de notificações
const mockNotifications = [
  {
    id: "1",
    type: "info" as const,
    category: "atividade" as const,
    title: "Nova Submissão",
    message: "João Silva enviou a atividade 'Equações de 2º Grau'",
    discipline: "Matemática",
    time: "Há 30 minutos",
    read: false,
  },
  {
    id: "2",
    type: "warning" as const,
    category: "prazo" as const,
    title: "Prazo de Correção",
    message: "Prazo para correção da Prova 2 se encerra amanhã às 18:00",
    discipline: "Sistema",
    time: "Há 1 hora",
    read: false,
  },
  {
    id: "3",
    type: "success" as const,
    category: "conquista" as const,
    title: "Meta Atingida",
    message: "A turma 1º A atingiu 95% de entregas na atividade 'Lista de Funções'",
    discipline: "Matemática",
    time: "Há 3 horas",
    read: false,
  },
  {
    id: "4",
    type: "info" as const,
    category: "resumo" as const,
    title: "Novo Resumo para Revisar",
    message: "Um aluno enviou um resumo para sua revisão: 'Revisão de Trigonometria - João Silva'",
    discipline: "Matemática",
    time: "Há 5 horas",
    read: true,
  },
];

export default function ProfessorHeader({
  onToggleSidebar,
  sidebarOpen,
}: ProfessorHeaderProps) {
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
          <Link href="/professor/inicio" className="flex items-center gap-2 group">
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
            onMarkAsRead={(id) => {
              setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
              );
            }}
            onMarkAllAsRead={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            }}
            onDelete={(id) => {
              setNotifications((prev) => prev.filter((n) => n.id !== id));
            }}
          />

          <Link
            href="/professor/perfil"
            className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-2 py-1 transition"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 grid place-items-center text-xs font-bold text-[#fff]">
              {professor.nome.split(" ")[0][0]}
            </div>
            <span className="text-sm hidden sm:block max-w-[140px] truncate">
              {professor.nome}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}