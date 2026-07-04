import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: {
    id: string;
    name: string;
    email: string;
    type: "student" | "teacher";
    status: "active" | "inactive" | "pending";
  }) => void;
  user: {
    id: string;
    name: string;
    email: string;
    type: "student" | "teacher";
    status: "active" | "inactive" | "pending";
  } | null;
}

export function EditUserDialog({
  open,
  onClose,
  onSave,
  user,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState(
    user || {
      id: "",
      name: "",
      email: "",
      type: "student" as const,
      status: "pending" as const,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] admin-form-light bg-white text-slate-900 border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900">{user ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-xl bg-white text-slate-900 border-slate-300"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-700">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-xl bg-white text-slate-900 border-slate-300"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-slate-700">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "student" | "teacher") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type" className="rounded-xl bg-white text-slate-900 border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900 border-slate-200">
                  <SelectItem value="student">Aluno</SelectItem>
                  <SelectItem value="teacher">Professor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-slate-700">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive" | "pending") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status" className="rounded-xl bg-white text-slate-900 border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-slate-900 border-slate-200">
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
