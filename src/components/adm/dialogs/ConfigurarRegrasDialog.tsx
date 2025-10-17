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
import { useState } from "react";

interface RegrasDistribuicao {
  atividadeEntregue: number;
  atividadeNotaMaxima: number;
  resumoPostado: number;
  quizConcluido: number;
  limiteAluno: number;
  periodoDias: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (regras: RegrasDistribuicao) => void;
  regrasAtuais: RegrasDistribuicao;
}

export function ConfigurarRegrasDialog({ open, onClose, onSave, regrasAtuais }: Props) {
  const [formData, setFormData] = useState<RegrasDistribuicao>(regrasAtuais);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar Regras de Distribuição</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recompensas por Atividade</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="atividadeEntregue">Atividade Entregue</Label>
                <Input
                  id="atividadeEntregue"
                  type="number"
                  className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                  value={formData.atividadeEntregue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      atividadeEntregue: Number(e.target.value),
                    })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Moedas recebidas ao entregar uma atividade no prazo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="atividadeNotaMaxima">Bônus Nota Máxima</Label>
                <Input
                  id="atividadeNotaMaxima"
                  type="number"
                  className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                  value={formData.atividadeNotaMaxima}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      atividadeNotaMaxima: Number(e.target.value),
                    })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Moedas extras por atingir nota máxima
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumoPostado">Resumo Postado</Label>
                <Input
                  id="resumoPostado"
                  type="number"
                  className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                  value={formData.resumoPostado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resumoPostado: Number(e.target.value),
                    })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Moedas por postar um resumo ou revisão
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quizConcluido">Quiz Concluído</Label>
                <Input
                  id="quizConcluido"
                  type="number"
                  className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                  value={formData.quizConcluido}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quizConcluido: Number(e.target.value),
                    })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Moedas por completar um quiz ou avaliação
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Limites do Sistema</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="limiteAluno">Limite por Aluno</Label>
                <Input
                  id="limiteAluno"
                  type="number"
                  className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                  value={formData.limiteAluno}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      limiteAluno: Number(e.target.value),
                    })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Máximo de moedas que um aluno pode acumular no período
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodoDias">Período (em dias)</Label>
                <Input
                  id="periodoDias"
                  type="number"
                  className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                  value={formData.periodoDias}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      periodoDias: Number(e.target.value),
                    })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Duração do período para o limite (ex: 180 para semestre)
                </p>
              </div>
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
              className="rounded-lg bg-violet-600 hover:bg-violet-700"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}