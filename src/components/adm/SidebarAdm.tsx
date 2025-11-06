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
  open: boolean;
  active?: string;
  onChange?: Dispatch<SetStateAction<string>>;
};

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
];

export function SidebarAdm({ open, active, onChange }: SidebarAdmProps) {
  const router = useRouter();
  const current = active ?? router.pathname.split("/")[2];

  return (
    <aside
  className={`${
    open ? "w-[280px] px-4 py-6" : "w-[80px] px-2 py-6"
  } bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm rounded-xl`}
/>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.key || router.pathname.startsWith(item.href);

          return (
            <Link
           key={item.key}
          href={item.href}
          onClick={() => onChange?.(item.key)}
          aria-current={isActive ? "page" : undefined}
          className={`flex items-center w-full rounded-xl py-3 transition-all duration-300 group relative
            ${open ? "px-4 justify-start hover:bg-[#7C3AED]/30" : "px-0 justify-center hover:bg-[#7C3AED]/30 md:mx-2"}
            ${isActive ? "bg-[#7C3AED] text-white shadow-md" : "hover:shadow-sm"}
          `}
        />

                       {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7C3AED] rounded-r-lg" />
          )}


              <div className="flex items-center gap-3">
                <Icon
                  size={20}
                  className={`${isActive ? "text-white" : "text-[#7C3AED]"} flex-shrink-0`}
                />

                {open && (
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  >
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
