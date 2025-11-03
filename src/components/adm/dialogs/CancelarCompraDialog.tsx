import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  transacao?: any | null;
  onConfirm: (motivo: string) => void | Promise<void>;
};

export function CancelarCompraDialog({ open, onClose, transacao, onConfirm }: Props) {
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (open) setMotivo("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Cancelar Transação</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="text-muted-foreground">
            Confirme o cancelamento da compra de pontos do aluno
            {transacao ? ` ${transacao.alunoNome}` : ""}.
          </div>
          <div>
            <label className="text-sm font-medium">Motivo</label>
            <Input className="rounded-lg" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-lg" onClick={onClose}>
            Voltar
          </Button>
          <Button
            className="rounded-lg text-white bg-red-600 hover:bg-red-700"
            onClick={async () => {
              await onConfirm(motivo);
            }}
          >
            Cancelar Transação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CancelarCompraDialog;
