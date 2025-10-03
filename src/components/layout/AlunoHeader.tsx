"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, Menu, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { aluno } from "@/lib/mock/aluno";

type AlunoHeaderProps = {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
};

export default function AlunoHeader({
  onToggleSidebar,
  sidebarOpen,
}: AlunoHeaderProps) {
  const [open, setOpen] = useState(false);
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
            href="/homepage-aluno"
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
          <button
            aria-label="Notificações"
            className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-purple-900/60" />
          </button>
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-2 py-1 transition"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 grid place-items-center text-xs font-bold text-[#fff]">
                {aluno.nome.split(" ")[0][0]}
              </div>
              <span className="text-sm hidden sm:block max-w-[140px] truncate">
                {aluno.nome}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white text-secondary-800 shadow-xl ring-1 ring-black/5 overflow-hidden border border-gray-200">
                <Link
                  href="/perfil"
                  className="block px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Meus Dados
                </Link>
                <Link
                  href="/perfil?tab=config"
                  className="block px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Configurações
                </Link>
                <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
