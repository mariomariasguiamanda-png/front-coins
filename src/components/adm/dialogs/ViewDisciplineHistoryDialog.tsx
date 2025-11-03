import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  discipline?: any | null;
};

export function ViewDisciplineHistoryDialog({ open, onClose, discipline }: Props) {
  const history = (discipline?.history as any[]) || [];
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Histórico da Disciplina</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-3 overflow-auto text-sm">
          {history.length === 0 && (
            <div className="text-muted-foreground">Sem alterações registradas.</div>
          )}
          {history.map((h: any, idx: number) => (
            <div key={idx} className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{h.changedBy || "Usuário"}</div>
                <div className="text-xs text-muted-foreground">{new Date(h.timestamp).toLocaleString("pt-BR")}</div>
              </div>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-600">{JSON.stringify(h.changes, null, 2)}</pre>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewDisciplineHistoryDialog;
