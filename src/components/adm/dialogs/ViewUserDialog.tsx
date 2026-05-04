import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/Label"

interface ViewUserDialogProps {
  open: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    email: string
    type: "student" | "teacher"
    status: "active" | "inactive" | "pending"
    createdAt: string
  } | null
}

export function ViewUserDialog({ open, onClose, user }: ViewUserDialogProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] admin-form-light bg-white text-slate-900 border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Detalhes do Usuário</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="text-slate-700">Nome</Label>
            <div className="rounded-lg border border-slate-300 bg-white p-2 text-slate-900">{user.name}</div>
          </div>
          <div className="grid gap-2">
            <Label className="text-slate-700">E-mail</Label>
            <div className="rounded-lg border border-slate-300 bg-white p-2 text-slate-900">{user.email}</div>
          </div>
          <div className="grid gap-2">
            <Label className="text-slate-700">Tipo</Label>
            <div className="rounded-lg border border-slate-300 bg-white p-2 text-slate-900">
              {user.type === "student" ? "Aluno" : "Professor"}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-slate-700">Status</Label>
            <div className="rounded-lg border border-slate-300 bg-white p-2">
              <span
                className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                  user.status === "active"
                    ? "bg-green-100 text-green-700"
                    : user.status === "inactive"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {user.status === "active"
                  ? "Ativo"
                  : user.status === "inactive"
                  ? "Inativo"
                  : "Pendente"}
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-slate-700">Data de Cadastro</Label>
            <div className="rounded-lg border border-slate-300 bg-white p-2 text-slate-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}