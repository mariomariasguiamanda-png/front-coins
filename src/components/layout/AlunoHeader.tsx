"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { aluno } from "@/lib/mock/aluno";

export default function AlunoHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 bg-white/10 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/homepage-aluno" className="flex items-center gap-2 group">
          <Image src="/logo-coins.png" alt="Coins for Study" width={28} height={28} className="rounded-sm" />
          <span className="text-sm font-semibold tracking-wide group-hover:opacity-90">Coins for Study</span>
        </Link>

        <div className="flex items-center gap-3">
          <button aria-label="Notificações" className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-purple-900/60" />
          </button>
          <div className="relative">
            <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-2 py-1 transition">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 grid place-items-center text-xs font-bold">
                {aluno.nome.split(" ")[0][0]}
              </div>
              <span className="text-sm hidden sm:block max-w-[140px] truncate">{aluno.nome}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white/95 text-secondary-800 shadow-xl ring-1 ring-black/5 overflow-hidden">
                <Link href="/perfil" className="block px-3 py-2 text-sm hover:bg-secondary-100">Meus Dados</Link>
                <Link href="/perfil?tab=config" className="block px-3 py-2 text-sm hover:bg-secondary-100">Configurações</Link>
                <button className="block w-full text-left px-3 py-2 text-sm hover:bg-secondary-100">Sair</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
