"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import {
  BarChart2,
  BookOpen,
  Coins,
  FileText,
  Lock,
  Settings,
  ShoppingCart,
  Users,
  HelpCircle,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type SidebarAdmProps = {
  open: boolean;                 // <- obrigatório: AdminLayout sempre passa
  active?: string;
  onChange?: Dispatch<SetStateAction<string>>;
};

// mesma ideia do professor: itens fixos
const items = [
  { key: "dashboard", label: "Dashboard", icon: BarChart2, href: "/adm/dashboard" },
  { key: "usuarios", label: "Usuários", icon: Users, href: "/adm/usuarios" },
  { key: "disciplinas", label: "Disciplinas", icon: BookOpen, href: "/adm/disciplinas" },
  { key: "moedas", label: "Moedas", icon: Coins, href: "/adm/moedas" },
  { key: "relatorios", label: "Relatórios", icon: FileText, href: "/adm/relatorios-hub" },
  { key: "compras", label: "Compras", icon: ShoppingCart, href: "/adm/compras" },
  { key: "suporte", label: "Suporte", icon: HelpCircle, href: "/adm/suporte" },
  { key: "configuracoes", label: "Configurações", icon: Settings, href: "/adm/configuracoes" },
  { key: "seguranca", label: "Segurança", icon: Lock, href: "/adm/seguranca" },
] as const;
type Item = typeof items[number];

export function SidebarAdm({ open, active, onChange }: SidebarAdmProps) {
  const router = useRouter();
  const currentPath = active ?? router.pathname;

  return (
    <aside
      className={`${
        open ? "w-[280px] px-4 py-6" : "w-[80px] px-2 py-6"
      } bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm`}
    >
      <nav className="space-y-1">
        {items.map((item: Item) => {
          const Icon = item.icon;
          // ativo se for a rota exata OU qualquer subrota daquele item
          const isActive =
            currentPath === item.href ||
            (item.href !== "/adm/dashboard" && currentPath.startsWith(item.href));

          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => onChange?.(item.key)}
              aria-current={isActive ? "page" : undefined}
              className={`relative group flex items-center w-full py-3
                mx-1 rounded-xl !rounded-xl                /* garante raio sem “cortar” */
                transition-all duration-300
                ${open ? "px-4 justify-start hover:bg-[#7C3AED]/30" : "px-0 justify-center hover:bg-[#7C3AED]/30 md:mx-2"}
                ${isActive ? "bg-[#7C3AED] text-white shadow-md" : "hover:shadow-sm"}`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7C3AED] rounded-r-lg" />
              )}

              <div className="flex items-center gap-3">
                <Icon
                  size={20}
                  className={`${isActive ? "text-white" : "text-[#7C3AED]"} flex-shrink-0`}
                />
                {open && (
                  <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"}`}>
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
