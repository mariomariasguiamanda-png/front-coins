import { useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search, Filter, Plus, Pencil, Archive, History } from "lucide-react";
import { createNotification, composeMessages } from "@/services/api/notifications";
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

// Mock data
const mockDisciplines: Discipline[] = [
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
    points: {
      maxPoints: 50,
      pointPrice: 20
    },
    status: "active",
    createdAt: "2023-01-01",
    updatedAt: "2023-10-12",
    history: [
      {
        timestamp: "2023-10-12T10:00:00Z",
        changedBy: "Admin",
        changes: {
          teachers: [
            { id: "1", name: "João Silva", role: "principal" },
            { id: "2", name: "Maria Santos", role: "collaborator" }
          ]
        }
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
    teachers: [
      { id: "3", name: "Ana Oliveira", role: "principal" }
    ],
    points: {
      maxPoints: 40,
      pointPrice: 15
    },
    status: "active",
    createdAt: "2023-01-01",
    updatedAt: "2023-10-12",
    history: []
  }
];

interface DisciplineCardProps {
  discipline: Discipline;
  onEdit: (discipline: Discipline) => void;
  onArchive: (id: string) => void;
  onViewHistory: (discipline: Discipline) => void;
}

function DisciplineCard({ discipline, onEdit, onArchive, onViewHistory }: DisciplineCardProps) {
  return (
    <Card className="rounded-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: discipline.color }}
              />
              <h3 className="text-lg font-semibold">{discipline.name}</h3>
              <span className="text-sm text-muted-foreground">({discipline.code})</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {discipline.classes.join(", ")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg bg-violet-50/50 border-violet-100 hover:bg-violet-100/50"
              onClick={() => onEdit(discipline)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg bg-violet-50/50 border-violet-100 hover:bg-violet-100/50"
              onClick={() => onViewHistory(discipline)}
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={discipline.status === "active" 
                ? "rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                : "rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              }
              onClick={() => onArchive(discipline.id)}
            >
              <Archive className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Professores</h4>
            <div className="space-y-1">
              {discipline.teachers.map(teacher => (
                <p key={teacher.id} className="text-sm">
                  {teacher.name}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({teacher.role === "principal" ? "Principal" : "Colaborador"})
                  </span>
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Configurações de Pontos</h4>
            <div className="space-y-1">
              <p className="text-sm">
                Máximo de pontos: {discipline.points.maxPoints}
              </p>
              <p className="text-sm">
                Preço por ponto: {discipline.points.pointPrice} moedas
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DisciplinasPage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>(mockDisciplines);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [selectedDisciplineForEdit, setSelectedDisciplineForEdit] = useState<Discipline | null>(null);
  const [selectedDisciplineForHistory, setSelectedDisciplineForHistory] = useState<Discipline | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredDisciplines = disciplines.filter(discipline => {
    const matchesSearch = discipline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discipline.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showArchived ? discipline.status === "archived" : discipline.status === "active";
    return matchesSearch && matchesStatus;
  });

  const handleSaveDiscipline = (data: Omit<Discipline, "id" | "history" | "createdAt" | "updatedAt">) => {
    // Implementar chamada API aqui
    console.log("Save discipline:", data);
  };

  const handleEditDiscipline = (data: any) => {
    // Implementar chamada API aqui
    console.log("Edit discipline:", data);
  };

  const handleArchiveDiscipline = async (id: string) => {
    try {
      // Implementar chamada API aqui
      const discipline = disciplines.find(d => d.id === id);
      if (!discipline) return;

      const newStatus = discipline.status === "active" ? "archived" : "active";
      const action = newStatus === "archived" ? "arquivada" : "ativada";

      // Mock update
      setDisciplines(disciplines.map(d =>
        d.id === id ? { ...d, status: newStatus } : d
      ));

      alert(`Disciplina ${action} com sucesso!`);

      // Notificação
      if (newStatus === "archived") {
        const { message, actionType } = composeMessages.disciplineArchived({
          adminNome: "Administrador (sessão)",
          disciplina: discipline.name,
        });
        await createNotification({ message, actionType, recipients: ["Administrador", "Coordenador"] });
      }
    } catch (error) {
      console.error('Error archiving discipline:', error);
      alert('Erro ao arquivar/ativar disciplina. Tente novamente.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <CreateDisciplineDialog 
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSave={handleSaveDiscipline}
        />

        <EditDisciplineDialog
          open={!!selectedDisciplineForEdit}
          onClose={() => setSelectedDisciplineForEdit(null)}
          onSave={handleEditDiscipline}
          discipline={selectedDisciplineForEdit as any}
        />

        <ViewDisciplineHistoryDialog
          open={!!selectedDisciplineForHistory}
          onClose={() => setSelectedDisciplineForHistory(null)}
          discipline={selectedDisciplineForHistory as any}
        />

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Gestão de Disciplinas</h1>
            <p className="text-muted-foreground">
              Gerencie as disciplinas, pontos e professores vinculados
            </p>
          </div>
          <Button 
            className="rounded-lg bg-violet-600 hover:bg-violet-700"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Disciplina
          </Button>
        </header>

        {/* Filters */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex max-w-[320px] items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar disciplinas..." 
                  className="rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={`rounded-lg ${
                    !showArchived
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : ""
                  }`}
                  onClick={() => setShowArchived(false)}
                >
                  Ativas
                </Button>
                <Button
                  variant="outline"
                  className={`rounded-lg ${
                    showArchived
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : ""
                  }`}
                  onClick={() => setShowArchived(true)}
                >
                  Arquivadas
                </Button>
                <Button variant="outline" className="rounded-lg">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disciplines Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredDisciplines.map(discipline => (
            <DisciplineCard
              key={discipline.id}
              discipline={discipline}
              onEdit={setSelectedDisciplineForEdit}
              onArchive={handleArchiveDiscipline}
              onViewHistory={(discipline) => {
                setSelectedDisciplineForHistory(discipline);
              }}
            />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}