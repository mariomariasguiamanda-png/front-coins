import { Card, CardContent } from "@/components/ui/Card";
import { Users, GraduationCap, BookOpen, Coins, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

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
      bgColor: "bg-blue-100",
      gradient: "from-blue-500 to-blue-600",
      link: "/adm/usuarios-lista",
      mainValue: stats.students.total,
      mainLabel: "Total de alunos",
      change: +12,
      stats: [
        { label: "Ativos", value: stats.students.active, highlight: true },
        { label: "Inativos", value: stats.students.inactive, highlight: false },
      ],
    },
    {
      title: "Professores",
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-100",
      gradient: "from-green-500 to-green-600",
      link: "/adm/usuarios-lista",
      mainValue: stats.teachers.total,
      mainLabel: "Total de professores",
      change: +3,
      stats: [
        { label: "Ativos", value: stats.teachers.active, highlight: true },
        { label: "Pendentes", value: stats.teachers.pending, highlight: false },
      ],
    },
    {
      title: "Disciplinas",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      gradient: "from-purple-500 to-purple-600",
      link: "/adm/disciplinas-lista",
      mainValue: stats.disciplines.total,
      mainLabel: "Total de disciplinas",
      change: +2,
      stats: [
        { label: "Ativas", value: stats.disciplines.active, highlight: true },
        { label: "Inativas", value: stats.disciplines.inactive, highlight: false },
      ],
    },
    {
      title: "Moedas",
      icon: Coins,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      gradient: "from-amber-500 to-amber-600",
      link: "/adm/moedas-saldos",
      mainValue: stats.coins.total.toLocaleString(),
      mainLabel: "Total em circulação",
      change: +8,
      stats: [
        { label: "Distribuídas", value: stats.coins.distributed.toLocaleString(), highlight: true },
        { label: "Disponíveis", value: stats.coins.available.toLocaleString(), highlight: false },
      ],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositiveChange = card.change > 0;
        
        return (
          <Link 
            key={index} 
            href={card.link}
            className="group"
          >
            <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-0 overflow-hidden h-full">
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>
              
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <h3 className="text-3xl font-bold text-gray-900">{card.mainValue}</h3>
                      {card.change !== 0 && (
                        <span className={`flex items-center gap-0.5 text-xs font-medium ${
                          isPositiveChange ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isPositiveChange ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {Math.abs(card.change)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  {card.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{stat.label}</span>
                      <span className={`font-semibold ${
                        stat.highlight ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Hover Indicator */}
                <div className="mt-4 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    Ver detalhes
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}