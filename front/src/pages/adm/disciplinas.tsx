import { useMemo, useState, useEffect } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmFiltersCard } from "@/components/adm/AdmFiltersCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
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
import { api } from "@/lib/api";
import { CreateDisciplineDialog } from "@/components/adm/dialogs/CreateDisciplineDialog";
import { EditDisciplineDialog } from "@/components/adm/dialogs/EditDisciplineDialog";
import { ViewDisciplineHistoryDialog } from "@/components/adm/dialogs/ViewDisciplineHistoryDialog";
import { ManageTeachersDialog } from "@/components/adm/dialogs/ManageTeachersDialog";

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


function DisciplineCard({
  discipline,
  onEdit,
  onArchive,
  onViewHistory,
  onManageTeachers,
}: {
  discipline: Discipline;
  onEdit: (d: Discipline) => void;
  onArchive: (id: string) => void;
  onViewHistory: (d: Discipline) => void;
  onManageTeachers: (d: Discipline) => void;
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
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
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
            onClick={() => onManageTeachers(discipline)}
          >
            <Users className="h-3 w-3" />
            Professores
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

const CORES = ["#4F46E5", "#059669", "#DC2626", "#7C3AED", "#10B981", "#F59E0B", "#0EA5E9", "#EC4899"];

export default function GestaoDisciplinasPage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  
  // Dialogs de estado
  const [editDiscipline, setEditDiscipline] = useState<Discipline | null>(null);
  const [historyDiscipline, setHistoryDiscipline] = useState<Discipline | null>(null);
  // Se for null, o dialog entende que deve abrir a versão "global" com select
  const [manageTeachersDiscipline, setManageTeachersDiscipline] = useState<Discipline | null | "global">(null);
  const [professoresGlobais, setProfessoresGlobais] = useState<any[]>([]);

  const [stats, setStats] = useState({
    total: 0,
    ativas: 0,
    arquivadas: 0,
    professores: 0,
    alunos: 0,
    moedas: 0,
  });

  const carregar = async () => {
    try {
      const [discs, configs, professores, statsRes] = await Promise.all([
        api.get("/disciplinas"),
        api.get("/admin/moedas/config-precos"),
        api.get("/professores"),
        api.get("/admin/disciplinas/stats"),
      ]);

      setProfessoresGlobais(professores ?? []);
      setStats(statsRes);

      const mapaConfig = new Map<number, any>(
        (configs ?? []).map((c: any) => [Number(c.id_disciplina), c]),
      );

      const professoresPorDisciplina = new Map<number, DisciplineTeacher[]>();
      for (const p of professores ?? []) {
        for (const idDisc of p.disciplinas ?? []) {
          if (!professoresPorDisciplina.has(idDisc)) professoresPorDisciplina.set(idDisc, []);
          professoresPorDisciplina.get(idDisc)!.push({
            id: String(p.id_professor),
            name: p.nome,
            role: professoresPorDisciplina.get(idDisc)!.length === 0 ? "principal" : "collaborator",
          });
        }
      }

      setDisciplines(
        (discs ?? []).map((d: any, idx: number): Discipline => {
          const config = mapaConfig.get(Number(d.id_disciplina));
          return {
            id: String(d.id_disciplina),
            code: d.codigo ?? "",
            name: d.nome,
            color: CORES[idx % CORES.length],
            icon: "book",
            classes: [],
            teachers: professoresPorDisciplina.get(Number(d.id_disciplina)) ?? [],
            points: {
              maxPoints: config?.pontos_por_compra_max ?? 10,
              pointPrice: config?.preco_moedas_por_ponto ?? 10,
            },
            status: d.ativo === false ? "archived" : "active",
            createdAt: d.criado_em ?? "",
            updatedAt: d.criado_em ?? "",
            history: [],
          };
        }),
      );
    } catch (err) {
      console.error("Erro ao carregar disciplinas:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await api.post("/admin/disciplinas", {
        nome: data.name,
        codigo: data.code,
      });
      await carregar();
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Erro ao criar disciplina");
    }
  };

  const handleEdit = async (data: any) => {
    try {
      await api.patch(`/admin/disciplinas/${data.id}`, {
        nome: data.name,
        codigo: data.code,
      });
      await carregar();
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Erro ao editar disciplina");
    }
  };

  const list = useMemo(() => {
    const s = search.trim().toLowerCase();
    return disciplines.filter((d) => {
      const matches = !s || d.name.toLowerCase().includes(s) || d.code.toLowerCase().includes(s);
      const status = showArchived ? d.status === "archived" : d.status === "active";
      return matches && status;
    });
  }, [disciplines, search, showArchived]);

  const handleArchiveToggle = async (id: string) => {
    const disciplina = disciplines.find((d) => d.id === id);
    if (!disciplina) return;
    try {
      if (disciplina.status === "active") {
        await api.delete(`/admin/disciplinas/${id}`);
      } else {
        await api.patch(`/admin/disciplinas/${id}`, { ativo: true });
      }
      await carregar();
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Erro ao atualizar o status da disciplina");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Dialogs */}
        <CreateDisciplineDialog open={createOpen} onClose={() => setCreateOpen(false)} onSave={handleCreate} />
        <EditDisciplineDialog open={!!editDiscipline} onClose={() => setEditDiscipline(null)} onSave={handleEdit} discipline={editDiscipline as any} />
        <ViewDisciplineHistoryDialog
          open={!!historyDiscipline}
          onClose={() => setHistoryDiscipline(null)}
          history={historyDiscipline?.history || []}
          disciplineName={historyDiscipline?.name || ""}
        />
        <ManageTeachersDialog
          open={!!manageTeachersDiscipline}
          onClose={() => setManageTeachersDiscipline(null)}
          discipline={manageTeachersDiscipline === "global" ? null : manageTeachersDiscipline}
          professoresGlobais={professoresGlobais}
          todasDisciplinas={disciplines}
          onUpdate={carregar}
        />

        {/* Header */}
        <header className="flex items-start justify-between gap-4 flex-col lg:flex-row">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Disciplinas</h1>
            <p className="text-muted-foreground">
              Administre disciplinas, professores, turmas e regras de pontuação
            </p>
          </div>
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <Button 
              variant="outline"
              className="rounded-lg inline-flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800" 
              onClick={() => setManageTeachersDiscipline("global")}
            >
              <Users className="h-4 w-4" /> Atribuir Professores
            </Button>
            <Button 
              className="rounded-lg inline-flex items-center gap-2" 
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4" /> Nova Disciplina
            </Button>
          </div>
        </header>

        {/* API Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-0 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Disciplinas Ativas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.ativas}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Alunos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.alunos}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Professores</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.professores}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Moedas Distribuídas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.moedas.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* Filters */}
        <AdmFiltersCard accentClassName="from-blue-500 to-blue-600">
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
                  aria-pressed={!showArchived}
                  onClick={() => setShowArchived(false)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Ativas
                </Button>
                <Button 
                  variant={showArchived ? "primary" : "outline"}
                  className="rounded-lg inline-flex items-center gap-1"
                  aria-pressed={showArchived}
                  onClick={() => setShowArchived(true)}
                >
                  <Archive className="h-4 w-4" />
                  Arquivadas
                </Button>
              </div>
            </div>
        </AdmFiltersCard>

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
                onManageTeachers={setManageTeachersDiscipline}
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