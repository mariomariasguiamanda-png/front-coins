import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Transacao {
  id: string;
  alunoNome: string;
  disciplinaNome: string;
  pontosComprados: number;
  moedasGastas: number;
  saldoAntes: number;
  saldoDepois: number;
  data: string;
  status: "concluida" | "cancelada";
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  transacao: Transacao | null;
}

export function CancelarCompraDialog({ open, onClose, onConfirm, transacao }: Props) {
  const [motivo, setMotivo] = useState("");

  if (!transacao) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(motivo);
    setMotivo("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Cancelar Compra de Pontos</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Aviso */}
          <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">Atenção: Esta ação não pode ser desfeita</p>
            </div>
          </div>

          {/* Detalhes da Transação */}
          <div className="rounded-lg border border-violet-100 bg-violet-50/50 p-4">
            <h4 className="mb-3 font-medium">Detalhes da Transação</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aluno:</span>
                <span className="font-medium">{transacao.alunoNome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Disciplina:</span>
                <span className="font-medium">{transacao.disciplinaNome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pontos Comprados:</span>
                <span className="font-medium text-emerald-600">
                  +{transacao.pontosComprados}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Moedas Gastas:</span>
                <span className="font-medium text-amber-600">
                  -{transacao.moedasGastas}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data da Compra:</span>
                <span className="font-medium">
                  {new Date(transacao.data).toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
          </div>

          {/* Resultado do Cancelamento */}
          <div className="rounded-lg border border-violet-100 bg-violet-50/50 p-4">
            <h4 className="mb-3 font-medium">Após o Cancelamento</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Moedas Devolvidas:</span>
                <span className="font-medium text-emerald-600">
                  +{transacao.moedasGastas}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pontos Removidos:</span>
                <span className="font-medium text-red-600">
                  -{transacao.pontosComprados}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saldo Final de Moedas:</span>
                <span className="font-medium">{transacao.saldoAntes}</span>
              </div>
            </div>
          </div>

          {/* Justificativa */}
          <div className="space-y-2">
            <Label htmlFor="motivo">Justificativa do Cancelamento</Label>
            <Textarea
              id="motivo"
              className="rounded-lg bg-violet-50/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200 min-h-[100px]"
              placeholder="Descreva o motivo do cancelamento..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={onClose}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              className="rounded-lg bg-red-600 hover:bg-red-700"
              disabled={!motivo.trim()}
            >
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}