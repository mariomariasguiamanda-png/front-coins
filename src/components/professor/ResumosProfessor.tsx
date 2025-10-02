import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileText, LinkIcon, Upload } from "lucide-react";

interface Summary {
  id: string;
  title: string;
  content: string;
  attachments?: string[];
  links?: string[];
  discipline: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

interface ResumosProfessorProps {
  summaries: Summary[];
  onCreateSummary: (summary: Omit<Summary, "id" | "createdAt" | "status">) => void;
  onEditSummary: (id: string, summary: Partial<Summary>) => void;
  onDeleteSummary: (id: string) => void;
  onApproveSummary: (id: string) => void;
  onRejectSummary: (id: string) => void;
}

export function ResumosProfessor({
  summaries = [],
  onCreateSummary,
  onEditSummary,
  onDeleteSummary,
  onApproveSummary,
  onRejectSummary,
}: ResumosProfessorProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Resumos</h1>
        <p className="text-muted-foreground">
          Gerencie os resumos das suas disciplinas
        </p>
      </header>

      {/* Criar novo resumo */}
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold">Novo Resumo</h2>
          </div>

          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Título</Label>
                <Input placeholder="Ex: Revisão - Funções do 2º Grau" className="rounded-xl" />
              </div>
              <div>
                <Label>Disciplina</Label>
                <Input placeholder="Ex: Matemática" className="rounded-xl" />
              </div>
            </div>

            <div>
              <Label>Conteúdo</Label>
              <Textarea 
                placeholder="Digite o conteúdo do resumo ou instruções..." 
                className="min-h-[150px] rounded-xl" 
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Links</Label>
                <div className="flex gap-2">
                  <Input placeholder="Cole um link aqui..." className="rounded-xl" />
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Anexos</Label>
                <Button variant="outline" className="w-full rounded-xl">
                  <Upload className="mr-2 h-4 w-4" /> Selecionar arquivos
                </Button>
              </div>
            </div>

            <Button className="rounded-xl">Publicar Resumo</Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de resumos */}
      <div className="space-y-4">
        {summaries.map((summary) => (
          <Card key={summary.id} className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-violet-600" />
                  <div>
                    <h3 className="font-semibold">{summary.title}</h3>
                    <p className="text-sm text-muted-foreground">{summary.discipline}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl text-red-600 hover:bg-red-50">
                    Excluir
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                {summary.content.substring(0, 200)}...
              </div>

              {summary.attachments && summary.attachments.length > 0 && (
                <div className="mt-4">
                  <Label>Anexos:</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {summary.attachments.map((attachment, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        {attachment}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Criado em {new Date(summary.createdAt).toLocaleDateString()}
                </span>
                <span className={`font-medium ${
                  summary.status === "approved" ? "text-green-600" :
                  summary.status === "rejected" ? "text-red-600" :
                  "text-yellow-600"
                }`}>
                  {summary.status === "approved" ? "Aprovado" :
                   summary.status === "rejected" ? "Rejeitado" :
                   "Pendente"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}