import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Search, Archive, History, Pencil } from "lucide-react";
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

const archivedMock: Discipline[] = [
  {
    id: "10",
    code: "HIS001",
    name: "História",
    color: "#EA580C",
    icon: "book",
    classes: ["3º A"],
    teachers: [{ id: "9", name: "Carlos Pereira", role: "principal" }],
    points: { maxPoints: 30, pointPrice: 10 },
    status: "archived",
    createdAt: "2022-03-01",
    updatedAt: "2023-02-11",
    history: [],
  },
];

function Row({ d, onRestore, onEdit, onViewHistory }: { d: Discipline; onRestore: (id: string) => void; onEdit: (d: Discipline) => void; onViewHistory: (d: Discipline) => void }) {
  return (
    <Card className="rounded-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <div>
              <div className="font-medium">{d.name} <span className="text-sm text-muted-foreground">({d.code})</span></div>
              <div className="text-xs text-muted-foreground">{d.classes.join(", ")}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg" onClick={() => onEdit(d)}>
              <Pencil className="h-4 w-4" /> Ver/Editar
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg" onClick={() => onViewHistory(d)}>
              <History className="h-4 w-4" /> Histórico
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => onRestore(d.id)}>
              <Archive className="h-4 w-4" /> Restaurar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DisciplinasArquivadasPage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>(archivedMock);
  const [search, setSearch] = useState("");
  const [editDiscipline, setEditDiscipline] = useState<Discipline | null>(null);
  const [historyDiscipline, setHistoryDiscipline] = useState<Discipline | null>(null);

  const list = useMemo(() => {
    const s = search.trim().toLowerCase();
    return disciplines.filter((d) => d.status === "archived" && (!s || d.name.toLowerCase().includes(s) || d.code.toLowerCase().includes(s)));
  }, [disciplines, search]);

  const restore = (id: string) => {
    setDisciplines((prev) => prev.map((d) => (d.id === id ? { ...d, status: "active" } : d)));
    alert("Disciplina restaurada.");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <EditDisciplineDialog open={!!editDiscipline} onClose={() => setEditDiscipline(null)} onSave={(data: any) => console.log("edit", data)} discipline={editDiscipline as any} />
        <ViewDisciplineHistoryDialog open={!!historyDiscipline} onClose={() => setHistoryDiscipline(null)} discipline={historyDiscipline as any} />

        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Disciplinas Arquivadas</h1>
            <p className="text-muted-foreground">Consulte e restaure disciplinas arquivadas</p>
          </div>
          <Link href="/adm/disciplinas">
            <Button variant="outline" className="rounded-lg">
              <ArrowLeft className="h-4 w-4" /> Voltar ao hub
            </Button>
          </Link>
        </header>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 max-w-[360px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar disciplinas arquivadas..." className="input-field rounded-lg" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          {list.map((d) => (
            <Row key={d.id} d={d} onRestore={restore} onEdit={setEditDiscipline} onViewHistory={setHistoryDiscipline} />
          ))}
          {list.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma disciplina arquivada encontrada.</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
