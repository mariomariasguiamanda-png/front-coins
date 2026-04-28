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
      <DialogContent className="sm:max-w-[520px] admin-form-light bg-white text-slate-900 border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Cancelar Transação</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="text-slate-600">
            Confirme o cancelamento da compra de pontos do aluno
            {transacao ? ` ${transacao.alunoNome}` : ""}.
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Motivo</label>
            <Input className="rounded-lg bg-white text-slate-900 border-slate-300" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
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
