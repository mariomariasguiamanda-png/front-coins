"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
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

type MenuItem = {
  key: string;
  label: string;
  icon: React.ElementType;
  href: string;
};

type SidebarAdmProps = {
  open: boolean;
  active: string;
  items?: MenuItem[];
  onChange: (key: string) => void;
};

const defaultItems: MenuItem[] = [
  {
    key: "dashboard",
    label: "Início",
    icon: BarChart2,
    href: "/adm/dashboard",
  },
  {
    key: "usuarios",
    label: "Usuários",
    icon: Users,
    href: "/adm/usuarios",
  },
  {
    key: "disciplinas",
    label: "Disciplinas",
    icon: BookOpen,
    href: "/adm/disciplinas",
  },
  {
    key: "moedas",
    label: "Moedas",
    icon: Coins,
    href: "/adm/moedas",
  },
  {
    key: "relatorios",
    label: "Relatórios",
    icon: FileText,
    href: "/adm/relatorios",
  },
  {
    key: "compras",
    label: "Compras",
    icon: ShoppingCart,
    href: "/adm/compras",
  },
  {
    key: "suporte",
    label: "Suporte",
    icon: HelpCircle,
    href: "/adm/suporte",
  },
  {
    key: "configuracoes",
    label: "Configurações",
    icon: Settings,
    href: "/adm/configuracoes",
  },
  {
    key: "seguranca",
    label: "Segurança",
    icon: Lock,
    href: "/adm/seguranca",
  },
];

export function SidebarAdm({
  open,
  active,
  items = defaultItems,
  onChange,
}: SidebarAdmProps) {
  return (
    <aside
      className={`${
        open ? "w-[280px] px-4 py-6" : "w-[80px] px-2 py-6"
      } bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm h-screen sticky top-0`}
    >
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
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => onChange(item.key)}
              className={`flex items-center w-full rounded-xl py-3 transition-all duration-300 group relative ${
                open
                  ? "px-4 justify-start hover:bg-[#7C3AED]/30"
                  : "px-0 justify-center md:justify-center hover:bg-[#7C3AED]/30 md:mx-2"
              } ${
                isActive
                  ? "bg-[#7C3AED] text-white shadow-md"
                  : "hover:shadow-sm"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7C3AED] rounded-r-lg" />
              )}
              <div className="flex items-center gap-3">
                <Icon
                  size={20}
                  className={`${
                    isActive ? "text-white" : "text-[#7C3AED]"
                  } flex-shrink-0`}
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