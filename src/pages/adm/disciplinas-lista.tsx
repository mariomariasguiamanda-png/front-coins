import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Edit, 
  Archive, 
  History,
  BookOpen,
  Users,
  Coins,
  GraduationCap,
  CheckCircle2
} from "lucide-react";
import { CreateDisciplineDialog } from "@/components/adm/dialogs/CreateDisciplineDialog";
import { EditDisciplineDialog } from "@/components/adm/dialogs/EditDisciplineDialog";
import { ViewDisciplineHistoryDialog } from "@/components/adm/dialogs/ViewDisciplineHistoryDialog";

interface DisciplinePoints {
  maxPoints: number;
  pointPrice: number;
}

interface DisciplineTeacher {
  id: string;
  name: string;
  role: "principal" | "collaborator";
}

interface Discipline {
  id: string;
  code: string;
  name: string;
  color: string;
  icon: string;
  classes: string[];
  teachers: DisciplineTeacher[];
  points: DisciplinePoints;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  history: Array<{
    timestamp: string;
    changedBy: string;
    changes: Partial<Omit<Discipline, "id" | "history">>;
  }>;
}

const initialDisciplines: Discipline[] = [
  {
    id: "1",
    code: "MAT001",
    name: "Matemática",
    color: "#4F46E5",
    icon: "calculator",
    classes: ["1º A", "1º B", "2º A"],
    teachers: [
      { id: "1", name: "João Silva", role: "principal" },
      { id: "2", name: "Maria Santos", role: "collaborator" }
    ],
    points: { maxPoints: 50, pointPrice: 20 },
    status: "active",
    createdAt: "2023-01-01",
    updatedAt: "2023-10-12",
    history: [
      {
        timestamp: "2023-10-12T10:00:00Z",
        changedBy: "Admin",
        changes: {}
      }
    ]
  },
  {
    id: "2",
    code: "PORT001",
    name: "Português",
    color: "#059669",
    icon: "book",
    classes: ["1º A", "1º B", "2º A"],
    teachers: [{ id: "3", name: "Ana Oliveira", role: "principal" }],
    points: { maxPoints: 40, pointPrice: 15 },
    status: "active",
    createdAt: "2023-01-01",
    updatedAt: "2023-10-12",
    history: []
  },
  {
    id: "3",
    code: "FIS001",
    name: "Física",
    color: "#DC2626",
    icon: "atom",
    classes: ["2º A", "2º B", "3º A"],
    teachers: [
      { id: "4", name: "Carlos Mendes", role: "principal" }
    ],
    points: { maxPoints: 45, pointPrice: 18 },
    status: "active",
    createdAt: "2023-01-01",
    updatedAt: "2023-10-15",
    history: []
  },
  {
    id: "4",
    code: "QUIM001",
    name: "Química",
    color: "#7C3AED",
    icon: "flask",
    classes: ["2º A", "3º A"],
    teachers: [
      { id: "5", name: "Paula Costa", role: "principal" }
    ],
    points: { maxPoints: 45, pointPrice: 18 },
    status: "active",
    createdAt: "2023-01-01",
    updatedAt: "2023-10-10",
    history: []
  },
  {
    id: "5",
    code: "BIO001",
    name: "Biologia",
    color: "#10B981",
    icon: "leaf",
    classes: ["2º B", "3º A", "3º B"],
    teachers: [
      { id: "6", name: "Roberto Lima", role: "principal" }
    ],
    points: { maxPoints: 40, pointPrice: 15 },
    status: "active",
    createdAt: "2023-01-01",
    updatedAt: "2023-10-08",
    history: []
  }
];

function DisciplineCard({
  discipline,
  onEdit,
  onArchive,
  onViewHistory,
}: {
  discipline: Discipline;
  onEdit: (d: Discipline) => void;
  onArchive: (id: string) => void;
  onViewHistory: (d: Discipline) => void;
}) {
  return (
    <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-0 overflow-hidden">
      {/* Color Header */}
      <div className="h-2" style={{ backgroundColor: discipline.color }}></div>
      
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: discipline.color }}
            >
              {discipline.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{discipline.name}</h3>
              <p className="text-sm text-gray-500">{discipline.code}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            discipline.status === "active" 
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "bg-gray-100 text-gray-700 border border-gray-200"
          }`}>
            {discipline.status === "active" ? "Ativa" : "Arquivada"}
          </span>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 mb-4">
          {/* Turmas */}
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1">Turmas</p>
              <div className="flex flex-wrap gap-1">
                {discipline.classes.map((cls, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Professores */}
          <div className="flex items-start gap-2">
            <GraduationCap className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1">Professores</p>
              <div className="space-y-0.5">
                {discipline.teachers.map((t) => (
                  <p key={t.id} className="text-sm text-gray-700 truncate">
                    {t.name}
                    <span className="text-xs text-gray-500 ml-1">
                      ({t.role === "principal" ? "Principal" : "Colaborador"})
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Pontos */}
          <div className="flex items-start gap-2">
            <Coins className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-1">Configuração de Pontos</p>
              <div className="flex gap-4 text-sm text-gray-700">
                <span>Máx: <strong>{discipline.points.maxPoints}</strong></span>
                <span>Preço: <strong>{discipline.points.pointPrice}</strong> moedas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-lg text-xs inline-flex items-center gap-1 justify-center"
            onClick={() => onEdit(discipline)}
          >
            <Edit className="h-3 w-3" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-lg text-xs inline-flex items-center gap-1 justify-center"
            onClick={() => onViewHistory(discipline)}
          >
            <History className="h-3 w-3" />
            Histórico
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex-1 rounded-lg text-xs inline-flex items-center gap-1 justify-center ${
              discipline.status === "active"
                ? "text-orange-600 hover:bg-orange-50"
                : "text-green-600 hover:bg-green-50"
            }`}
            onClick={() => onArchive(discipline.id)}
          >
            <Archive className="h-3 w-3" />
            {discipline.status === "active" ? "Arquivar" : "Reativar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DisciplinasListaPage() {
  // Load disciplines from localStorage or use initial data
  const [disciplines, setDisciplines] = useState<Discipline[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adm-disciplines");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error("Erro ao carregar disciplinas:", error);
        }
      }
    }
    return initialDisciplines;
  });

  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editDiscipline, setEditDiscipline] = useState<Discipline | null>(null);
  const [historyDiscipline, setHistoryDiscipline] = useState<Discipline | null>(null);

  // Save disciplines to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adm-disciplines", JSON.stringify(disciplines));
    }
  }, [disciplines]);

  const list = useMemo(() => {
    const s = search.trim().toLowerCase();
    return disciplines.filter((d) => {
      const matches = !s || d.name.toLowerCase().includes(s) || d.code.toLowerCase().includes(s);
      const status = showArchived ? d.status === "archived" : d.status === "active";
      return matches && status;
    });
  }, [disciplines, search, showArchived]);

  const stats = useMemo(() => ({
    total: list.length,
    turmas: new Set(list.flatMap(d => d.classes)).size,
    professores: new Set(list.flatMap(d => d.teachers.map(t => t.id))).size,
    moedas: list.reduce((sum, d) => sum + d.points.maxPoints, 0),
  }), [list]);

  const handleArchiveToggle = (id: string) => {
    setDisciplines((prev) => prev.map((d) => (d.id === id ? { ...d, status: d.status === "active" ? "archived" as const : "active" as const } : d)));
    alert("Status da disciplina atualizado.");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Dialogs */}
        <CreateDisciplineDialog open={createOpen} onClose={() => setCreateOpen(false)} onSave={(data: any) => console.log("create", data)} />
        <EditDisciplineDialog open={!!editDiscipline} onClose={() => setEditDiscipline(null)} onSave={(data: any) => console.log("edit", data)} discipline={editDiscipline as any} />
        <ViewDisciplineHistoryDialog open={!!historyDiscipline} onClose={() => setHistoryDiscipline(null)} discipline={historyDiscipline as any} />

        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link 
                href="/adm/disciplinas"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Lista de Disciplinas</h1>
            </div>
            <p className="text-gray-600">
              Gerencie todas as disciplinas, professores e configurações
            </p>
          </div>
          <Button 
            className="rounded-lg inline-flex items-center gap-2" 
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" /> Nova Disciplina
          </Button>
        </header>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-xl border-0 bg-gradient-to-br from-blue-50 to-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Exibido</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0 bg-gradient-to-br from-purple-50 to-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Turmas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.turmas}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0 bg-gradient-to-br from-green-50 to-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Professores</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.professores}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-0 bg-gradient-to-br from-amber-50 to-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pontos Totais</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.moedas}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="rounded-xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Buscar por nome ou código..." 
                    className="input-field rounded-lg pl-10" 
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={!showArchived ? "primary" : "outline"}
                  className="rounded-lg inline-flex items-center gap-1"
                  onClick={() => setShowArchived(false)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Ativas
                </Button>
                <Button 
                  variant={showArchived ? "primary" : "outline"}
                  className="rounded-lg inline-flex items-center gap-1"
                  onClick={() => setShowArchived(true)}
                >
                  <Archive className="h-4 w-4" />
                  Arquivadas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        {list.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((d) => (
              <DisciplineCard 
                key={d.id} 
                discipline={d} 
                onEdit={setEditDiscipline} 
                onArchive={handleArchiveToggle} 
                onViewHistory={setHistoryDiscipline} 
              />
            ))}
          </div>
        ) : (
          <Card className="rounded-xl shadow-sm border-0">
            <CardContent className="p-12">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Nenhuma disciplina encontrada
                </h3>
                <p className="text-gray-500 mb-4">
                  {showArchived 
                    ? "Não há disciplinas arquivadas no momento" 
                    : "Comece criando uma nova disciplina"}
                </p>
                {!showArchived && (
                  <Button 
                    className="rounded-lg inline-flex items-center gap-2"
                    onClick={() => setCreateOpen(true)}
                  >
                    <Plus className="h-4 w-4" /> Nova Disciplina
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
