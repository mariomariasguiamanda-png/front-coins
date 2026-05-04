import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

type Accent = "violet" | "blue" | "green" | "amber" | "purple";

interface QuickActionItem {
  href: string;
  label: string;
  icon: LucideIcon;
  accent?: Accent;
}

interface AdmQuickActionsCardProps {
  items: QuickActionItem[];
  title?: string;
  columnsClassName?: string;
  cardAccent?: Accent;
}

const accentMap: Record<Accent, { card: string; border: string; iconBg: string; icon: string }> = {
  violet: {
    card: "from-violet-50 to-white",
    border: "hover:border-violet-300",
    iconBg: "bg-violet-100",
    icon: "text-violet-600",
  },
  blue: {
    card: "from-blue-50 to-white",
    border: "hover:border-blue-300",
    iconBg: "bg-blue-100",
    icon: "text-blue-600",
  },
  green: {
    card: "from-green-50 to-white",
    border: "hover:border-green-300",
    iconBg: "bg-green-100",
    icon: "text-green-600",
  },
  amber: {
    card: "from-amber-50 to-white",
    border: "hover:border-amber-300",
    iconBg: "bg-amber-100",
    icon: "text-amber-600",
  },
  purple: {
    card: "from-purple-50 to-white",
    border: "hover:border-purple-300",
    iconBg: "bg-purple-100",
    icon: "text-purple-600",
  },
};

export function AdmQuickActionsCard({
  items,
  title = "Ações Rápidas",
  columnsClassName = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
  cardAccent = "violet",
}: AdmQuickActionsCardProps) {
  const cardStyle = accentMap[cardAccent];

  return (
    <Card className={`rounded-xl shadow-sm border-0 bg-gradient-to-br ${cardStyle.card}`}>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className={columnsClassName}>
          {items.map((item) => {
            const style = accentMap[item.accent ?? cardAccent];
            const Icon = item.icon;

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 ${style.border} hover:shadow-sm transition-all`}
              >
                <div className={`h-8 w-8 rounded-lg ${style.iconBg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${style.icon}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
