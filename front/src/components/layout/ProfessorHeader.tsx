"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ChevronLeft } from "lucide-react";
import { professor } from "@/lib/mock/professor";
import { Notifications } from "@/components/ui/Notifications";

type ProfessorHeaderProps = {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
};

export default function ProfessorHeader({
  onToggleSidebar,
  sidebarOpen,
}: ProfessorHeaderProps) {
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
          <Link
            href="/professor/inicio"
            className="flex items-center gap-2 group"
          >
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
          <Notifications />

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
