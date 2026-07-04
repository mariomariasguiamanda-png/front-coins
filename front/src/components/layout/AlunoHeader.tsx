"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ChevronLeft } from "lucide-react";
import { Notifications } from "@/components/ui/Notifications";
import { useUsuarioLogado } from "@/hooks/useUsuarioLogado";

type AlunoHeaderProps = {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
};

export default function AlunoHeader({
  onToggleSidebar,
  sidebarOpen,
}: AlunoHeaderProps) {
  const { nome, fotoUrl } = useUsuarioLogado();

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
          <Link href="/aluno/inicio" className="flex items-center gap-2 group">
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
            href="/aluno/perfil"
            title="Ver meu perfil"
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
          >
            <span className="text-sm font-medium">
              {nome || "Carregando..."}
            </span>
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt="Foto do usuário"
                className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                {nome ? nome.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
