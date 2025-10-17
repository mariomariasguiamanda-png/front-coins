"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Bell, 
  Menu, 
  ChevronLeft, 
  X, 
  Settings, 
  LogOut
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { admin, adminNotificacoes, type AdminNotificacao } from "@/lib/mock/admin";

type AdminHeaderProps = {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
};

export default function AdminHeader({
  onToggleSidebar,
  sidebarOpen,
}: AdminHeaderProps) {
  const [notificacoesOpen, setNotificacoesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [listaNotificacoes, setListaNotificacoes] =
    useState<AdminNotificacao[]>(adminNotificacoes);
  const notificacoesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificacoesRef.current &&
        !notificacoesRef.current.contains(event.target as Node)
      ) {
        setNotificacoesOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    if (notificacoesOpen || profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [notificacoesOpen, profileOpen]);

  // Função para formatar tempo relativo
  const formatarTempoRelativo = (dataHora: string) => {
    const agora = new Date();
    const data = new Date(dataHora);
    const diffMs = agora.getTime() - data.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffHoras / 24);

    if (diffHoras < 1) return "Agora";
    if (diffHoras < 24) return `${diffHoras}h atrás`;
    if (diffDias === 1) return "1 dia atrás";
    return `${diffDias} dias atrás`;
  };

  // Marcar notificação como lida
  const marcarComoLida = (id: string) => {
    setListaNotificacoes((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, lida: true } : notif))
    );
  };

  // Marcar todas como lidas
  const marcarTodasComoLidas = () => {
    setListaNotificacoes((prev) =>
      prev.map((notif) => ({ ...notif, lida: true }))
    );
  };

  // Contar notificações não lidas
  const notificacaoNaoLidas = listaNotificacoes.filter((n) => !n.lida).length;

  // Função para obter a cor do tipo de notificação
  const getNotificationTypeColor = (tipo: AdminNotificacao['tipo']) => {
    switch (tipo) {
      case 'usuario':
        return 'text-blue-600';
      case 'relatorio':
        return 'text-green-600';
      case 'alerta':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <header className="bg-gradient-to-br from-[#7C3AED] via-[#7C3AED] to-[#7C3AED] text-white border-b border-white/20">
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
          {/* Notifications */}
          <div className="relative" ref={notificacoesRef}>
            <button
              onClick={() => setNotificacoesOpen(!notificacoesOpen)}
              aria-label="Notificações"
              className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              <Bell className="h-5 w-5" />
              {notificacaoNaoLidas > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 ring-2 ring-slate-900/60 flex items-center justify-center text-xs font-bold text-white">
                  {notificacaoNaoLidas > 9 ? "9+" : notificacaoNaoLidas}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificacoesOpen && (
              <div className="absolute right-0 mt-2 w-96 rounded-xl bg-white text-gray-800 shadow-2xl ring-1 ring-black/10 overflow-hidden border border-gray-200 z-50">
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">Notificações</h3>
                      <p className="text-sm opacity-90">
                        {notificacaoNaoLidas > 0
                          ? `${notificacaoNaoLidas} não lida${
                              notificacaoNaoLidas > 1 ? "s" : ""
                            }`
                          : "Todas lidas"}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotificacoesOpen(false)}
                      className="p-1 hover:bg-white/20 rounded-full transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {notificacaoNaoLidas > 0 && (
                    <button
                      onClick={marcarTodasComoLidas}
                      className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {listaNotificacoes.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma notificação</p>
                    </div>
                  ) : (
                    listaNotificacoes.map((notificacao) => (
                      <div
                        key={notificacao.id}
                        onClick={() =>
                          !notificacao.lida && marcarComoLida(notificacao.id)
                        }
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                          !notificacao.lida
                            ? "bg-slate-50 border-l-4 border-l-slate-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 text-2xl">
                            {notificacao.icone}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className={`font-semibold text-sm ${
                                  !notificacao.lida
                                    ? "text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notificacao.titulo}
                              </h4>
                              {!notificacao.lida && (
                                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notificacao.mensagem}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-medium ${getNotificationTypeColor(notificacao.tipo)}`}>
                                {notificacao.tipo.charAt(0).toUpperCase() + notificacao.tipo.slice(1)}
                              </span>
                              <span className="text-gray-500">
                                {formatarTempoRelativo(notificacao.dataHora)}
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

          {/* Profile Section */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-2 py-1 transition"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-700 grid place-items-center text-xs font-bold text-white">
                {admin.nome.split(" ")[0][0]}
              </div>
              <span className="text-sm hidden sm:block max-w-[140px] truncate">
                {admin.nome}
              </span>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-gray-800 shadow-2xl ring-1 ring-black/10 overflow-hidden border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-semibold">{admin.nome}</p>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    href="/adm/perfil"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                  <button
                    onClick={() => {/* Implement logout */}}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}