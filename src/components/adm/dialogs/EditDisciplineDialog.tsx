import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  discipline?: any | null;
};

export function EditDisciplineDialog({ open, onClose, onSave, discipline }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    setName(discipline?.name || "");
    setCode(discipline?.code || "");
  }, [discipline]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] admin-form-light bg-white text-slate-900 border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Editar Disciplina</DialogTitle>
          <DialogDescription className="text-slate-600">Atualize as informações básicas</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Nome</label>
            <Input className="rounded-lg bg-white text-slate-900 border-slate-300" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Código</label>
            <Input className="rounded-lg bg-white text-slate-900 border-slate-300" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-lg" onClick={onClose}>Cancelar</Button>
          <Button
            className="rounded-lg"
            onClick={() => {
              onSave({ ...discipline, name, code });
              onClose();
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditDisciplineDialog;
