import { Card, CardContent } from "@/components/ui/Card";
import { Users, GraduationCap, BookOpen, Coins } from "lucide-react";

interface DashboardStats {
  students: {
    total: number;
    active: number;
    inactive: number;
  };
  teachers: {
    total: number;
    active: number;
    pending: number;
  };
  disciplines: {
    total: number;
    active: number;
    inactive: number;
  };
  coins: {
    total: number;
    distributed: number;
    available: number;
  };
}

export function DashboardCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      title: "Alunos",
      icon: Users,
      color: "text-blue-600",
      borderColor: "border-blue-600",
      stats: [
        { label: "Total", value: stats.students.total },
        { label: "Ativos", value: stats.students.active },
        { label: "Inativos", value: stats.students.inactive },
      ],
    },
    {
      title: "Professores",
      icon: GraduationCap,
      color: "text-green-600",
      borderColor: "border-green-600",
      stats: [
        { label: "Total", value: stats.teachers.total },
        { label: "Ativos", value: stats.teachers.active },
        { label: "Pendentes", value: stats.teachers.pending },
      ],
    },
    {
      title: "Disciplinas",
      icon: BookOpen,
      color: "text-purple-600",
      borderColor: "border-purple-600",
      stats: [
        { label: "Total", value: stats.disciplines.total },
        { label: "Ativas", value: stats.disciplines.active },
        { label: "Inativas", value: stats.disciplines.inactive },
      ],
    },
    {
      title: "Moedas",
      icon: Coins,
      color: "text-yellow-600",
      borderColor: "border-yellow-600",
      stats: [
        { label: "Total", value: stats.coins.total },
        { label: "Distribuídas", value: stats.coins.distributed },
        { label: "Disponíveis", value: stats.coins.available },
      ],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={`rounded-xl border-l-4 ${card.borderColor}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{card.title}</h3>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="mt-4 space-y-2">
                {card.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{stat.label}:</span>
                    <span className="font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}