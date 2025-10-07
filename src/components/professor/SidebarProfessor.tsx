import { cn } from "@/lib/utils";
import {
  Award,
  BarChart2,
  BookOpen,
  Coins,
  Home,
  Layout,
  PlayCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/professor/dashboard",
  },
  {
    title: "Atividades",
    icon: BookOpen,
    href: "/professor/atividades",
  },
  {
    title: "Resumos",
    icon: Layout,
    href: "/professor/resumos",
  },
  {
    title: "Videoaulas",
    icon: PlayCircle,
    href: "/professor/videoaulas",
  },
  {
    title: "Notas",
    icon: Star,
    href: "/professor/notas",
  },
  {
    title: "Desempenho",
    icon: BarChart2,
    href: "/professor/desempenho",
  },
  {
    title: "Configurar Pontos",
    icon: Coins,
    href: "/professor/config-moedas",
  },
];

export function SidebarProfessor() {
  const router = useRouter();

  return (
    <nav className="space-y-2 p-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = router.pathname === item.href;

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
          >
            <Icon className="h-5 w-5" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}