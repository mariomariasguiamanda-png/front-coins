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
      <DialogContent className="sm:max-w-[560px] admin-form-light bg-white text-slate-900 border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Histórico da Disciplina</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-3 overflow-auto text-sm text-slate-700">
          {history.length === 0 && (
            <div className="text-slate-500">Sem alterações registradas.</div>
          )}
          {history.map((h: any, idx: number) => (
            <div key={idx} className="rounded-md border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-900">{h.changedBy || "Usuário"}</div>
                <div className="text-xs text-slate-500">{new Date(h.timestamp).toLocaleString("pt-BR")}</div>
              </div>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-600">
                {h.changes && Object.keys(h.changes).length > 0
                  ? JSON.stringify(h.changes, null, 2)
                  : "Sem detalhes de alteração"}
              </pre>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewDisciplineHistoryDialog;
