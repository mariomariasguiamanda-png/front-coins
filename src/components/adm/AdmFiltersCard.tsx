import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface AdmFiltersCardProps {
  title?: string;
  icon?: LucideIcon;
  accentClassName?: string;
  children: ReactNode;
}

export function AdmFiltersCard({
  title = "Filtros",
  icon: Icon = Filter,
  accentClassName = "from-blue-500 to-blue-600",
  children,
}: AdmFiltersCardProps) {
  return (
    <Card className="rounded-xl shadow-sm">
      <div className={`h-2 bg-gradient-to-r ${accentClassName} rounded-t-xl`}></div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-5 w-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
