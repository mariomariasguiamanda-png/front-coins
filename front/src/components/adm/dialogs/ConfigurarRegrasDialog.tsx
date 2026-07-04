import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Regras = {
  atividadeEntregue: number;
  atividadeNotaMaxima: number;
  resumoPostado: number;
  quizConcluido: number;
  limiteAluno: number;
  periodoDias: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  regrasAtuais: Regras;
  onSave: (novasRegras: Regras) => void;
};

export function ConfigurarRegrasDialog({ open, onClose, regrasAtuais, onSave }: Props) {
  const [draft, setDraft] = useState<Regras>(regrasAtuais);

  useEffect(() => setDraft(regrasAtuais), [regrasAtuais, open]);

  const update = (key: keyof Regras, val: number) => setDraft((d) => ({ ...d, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[560px] admin-form-light bg-white text-slate-900 border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Configurar Regras de Moedas</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            ["atividadeEntregue", "Atividade entregue"],
            ["atividadeNotaMaxima", "Atividade nota máxima"],
            ["resumoPostado", "Resumo postado"],
            ["quizConcluido", "Quiz concluído"],
            ["limiteAluno", "Limite por aluno"],
            ["periodoDias", "Período (dias)"],
          ] as Array<[keyof Regras, string]>).map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium text-slate-700">{label}</label>
              <Input
                type="number"
                className="rounded-lg bg-white text-slate-900 border-slate-300"
                value={(draft as any)[key]}
                onChange={(e) => update(key, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-lg" onClick={onClose}>Cancelar</Button>
          <Button className="rounded-lg" onClick={() => { onSave(draft); onClose(); }}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfigurarRegrasDialog;
