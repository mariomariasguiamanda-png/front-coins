import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Ajuste = {
  alunoId?: string;
  disciplinaId?: string;
  quantidade: number;
  justificativa?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (ajuste: Ajuste) => void;
};

export function AjustarMoedasDialog({ open, onClose, onSave }: Props) {
  const [ajuste, setAjuste] = useState<Ajuste>({ quantidade: 0 });
  useEffect(() => { if (open) setAjuste({ quantidade: 0 }); }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Ajuste Manual de Moedas</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Aluno (opcional)</label>
            <Input className="rounded-lg" value={ajuste.alunoId || ""} onChange={(e) => setAjuste({ ...ajuste, alunoId: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Disciplina (opcional)</label>
            <Input className="rounded-lg" value={ajuste.disciplinaId || ""} onChange={(e) => setAjuste({ ...ajuste, disciplinaId: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Quantidade</label>
            <Input type="number" className="rounded-lg" value={ajuste.quantidade} onChange={(e) => setAjuste({ ...ajuste, quantidade: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-sm font-medium">Justificativa</label>
            <Input className="rounded-lg" value={ajuste.justificativa || ""} onChange={(e) => setAjuste({ ...ajuste, justificativa: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-lg" onClick={onClose}>Cancelar</Button>
          <Button className="rounded-lg" onClick={() => { onSave(ajuste); onClose(); }}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AjustarMoedasDialog;
