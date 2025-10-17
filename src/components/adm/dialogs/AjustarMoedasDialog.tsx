import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface AjusteMoedas {
  alunoId: string;
  disciplinaId: string;
  quantidade: number;
  tipo: "adicionar" | "remover";
  justificativa: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (ajuste: AjusteMoedas) => void;
}

// Mock data para o exemplo
const mockAlunos = [
  { id: "1", nome: "João Silva" },
  { id: "2", nome: "Maria Santos" },
];

const mockDisciplinas = [
  { id: "1", nome: "Matemática" },
  { id: "2", nome: "História" },
];

export function AjustarMoedasDialog({ open, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<AjusteMoedas>({
    alunoId: "",
    disciplinaId: "",
    quantidade: 0,
    tipo: "adicionar",
    justificativa: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajuste Manual de Moedas</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Aluno</Label>
              <Select
                value={formData.alunoId}
                onValueChange={(value) =>
                  setFormData({ ...formData, alunoId: value })
                }
              >
                <SelectTrigger className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {mockAlunos.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Disciplina</Label>
              <Select
                value={formData.disciplinaId}
                onValueChange={(value) =>
                  setFormData({ ...formData, disciplinaId: value })
                }
              >
                <SelectTrigger className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200">
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {mockDisciplinas.map((disciplina) => (
                    <SelectItem key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Ajuste</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: "adicionar" | "remover") =>
                  setFormData({ ...formData, tipo: value })
                }
              >
                <SelectTrigger className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adicionar">Adicionar Moedas</SelectItem>
                  <SelectItem value="remover">Remover Moedas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade de Moedas</Label>
              <Input
                id="quantidade"
                type="number"
                className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                value={formData.quantidade}
                onChange={(e) =>
                  setFormData({ ...formData, quantidade: Number(e.target.value) })
                }
                required
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justificativa">Justificativa</Label>
              <Textarea
                id="justificativa"
                className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200 min-h-[100px]"
                value={formData.justificativa}
                onChange={(e) =>
                  setFormData({ ...formData, justificativa: e.target.value })
                }
                placeholder="Descreva o motivo do ajuste..."
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className={`rounded-lg ${
                formData.tipo === "adicionar"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {formData.tipo === "adicionar" ? "Adicionar" : "Remover"} Moedas
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}