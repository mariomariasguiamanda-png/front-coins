"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
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

type SidebarAdmProps = {
  open?: boolean;
  active?: string; // pode ser o href atual
  onChange?: Dispatch<SetStateAction<string>>;
};

const menuItems = [
  { title: "Dashboard",   icon: BarChart2,    href: "/adm/dashboard" },
  { title: "Usuários",    icon: Users,        href: "/adm/usuarios" },
  { title: "Disciplinas", icon: BookOpen,     href: "/adm/disciplinas" },
  { title: "Moedas",      icon: Coins,        href: "/adm/moedas" },
  { title: "Relatórios",  icon: FileText,     href: "/adm/relatorios-hub" },
  { title: "Compras",     icon: ShoppingCart, href: "/adm/compras" },
  { title: "Suporte",     icon: HelpCircle,   href: "/adm/suporte" },
  { title: "Configurações", icon: Settings,   href: "/adm/configuracoes" },
  { title: "Segurança",   icon: Lock,         href: "/adm/seguranca" },
];

export function SidebarAdm({ open = true, active, onChange }: SidebarAdmProps) {
  const router = useRouter();
  const currentPath = active ?? router.pathname;

  return (
    <aside
      className={`${
        open ? "w-[280px] px-4 py-6" : "w-[80px] px-2 py-6"
      } bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm`}
    >
      {/* Logo (mantém padrão do professor) */}
      {open && (
        <div className="flex items-center justify-center px-0 mb-4 w-full mx-[-16px]">
          <Image
            src="/logo-menulateral.png"
            alt="Coins for Study"
            width={280}
            height={120}
            className="w-[280px] h-auto object-contain"
            priority
          />
        </div>
      )}

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.href ||
            (item.href !== "/adm/dashboard" && currentPath.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onChange?.(item.href)}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center w-full rounded-xl py-3 transition-all duration-300 group relative
                ${open ? "px-4 justify-start hover:bg-[#7C3AED]/30" : "px-0 justify-center md:justify-center hover:bg-[#7C3AED]/30 md:mx-2"}
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
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {item.title}
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
