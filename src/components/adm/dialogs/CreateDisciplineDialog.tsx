import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
};

export function CreateDisciplineDialog({ open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Nova Disciplina</DialogTitle>
          <DialogDescription>Preencha as informações básicas da disciplina</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input className="rounded-lg" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Código</label>
            <Input className="rounded-lg" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-lg" onClick={onClose}>Cancelar</Button>
          <Button
            className="rounded-lg"
            onClick={() => {
              onSave({
                code: code || "NOVO001",
                name: name || "Nova Disciplina",
                color: "#4F46E5",
                icon: "book",
                classes: [],
                teachers: [],
                points: { maxPoints: 50, pointPrice: 10 },
                status: "active",
              });
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

export default CreateDisciplineDialog;
