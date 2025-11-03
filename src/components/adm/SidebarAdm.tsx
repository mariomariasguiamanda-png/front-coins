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
import Link from "next/link";
import { useRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart2,
    href: "/adm/dashboard",
  },
  {
    title: "Usuários",
    icon: Users,
    href: "/adm/usuarios",
  },
  {
    title: "Disciplinas",
    icon: BookOpen,
    href: "/adm/disciplinas",
  },
  {
    title: "Moedas",
    icon: Coins,
    href: "/adm/moedas",
  },
  {
    title: "Relatórios",
    icon: FileText,
    href: "/adm/relatorios-hub",
  },
  {
    title: "Compras",
    icon: ShoppingCart,
    href: "/adm/compras",
  },
  {
    title: "Suporte",
    icon: HelpCircle,
    href: "/adm/suporte",
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/adm/configuracoes",
  },
  {
    title: "Segurança",
    icon: Lock,
    href: "/adm/seguranca",
  },
];

type SidebarAdmProps = {
  open?: boolean;
  active?: string;
  onChange?: Dispatch<SetStateAction<string>>;
};

export function SidebarAdm({ open, active, onChange }: SidebarAdmProps) {
  const router = useRouter();

  return (
    <nav className="space-y-2 p-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = (active ?? router.pathname) === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-violet-800 text-white"
                : "text-violet-800 hover:bg-violet-100"
            )}
            onClick={() => onChange?.(item.href)}
          >
            <Icon className="h-5 w-5" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
