import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Phone, GraduationCap, Loader2 } from "lucide-react";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    email: string;
    phone: string;
    type: "student" | "teacher" | "admin";
    status: "active" | "inactive";
    password: string;
  }) => Promise<void>;
}

export function CreateUserDialog({
  open,
  onClose,
  onSave,
}: CreateUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "student" as "student" | "teacher" | "admin",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (
      formData.phone &&
      !/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(formData.phone)
    ) {
      newErrors.phone = "Telefone inválido. Use formato: (11) 98765-4321";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        type: formData.type,
        status: "active", // 👈 sempre cria como ativo
        password: formData.password,
      });
      handleClose();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao criar usuário. Tente novamente.";

      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      type: "student",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <User className="h-5 w-5 text-violet-600" />
            </div>
            Novo Usuário
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome Completo *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                placeholder="Ex: João Silva"
                className={`pl-10 bg-white ${
                  errors.name ? "border-red-500" : ""
                }`}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              E-mail *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="usuario@escola.edu.br"
                className={`pl-10 bg-white ${
                  errors.email ? "border-red-500" : ""
                }`}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Telefone
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                placeholder="(11) 98765-4321"
                className={`pl-10 bg-white ${
                  errors.phone ? "border-red-500" : ""
                }`}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Tipo (Aluno / Professor / Admin) */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Tipo *
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value: "student" | "teacher" | "admin") =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger id="type" className="bg-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Aluno
                  </div>
                </SelectItem>
                <SelectItem value="teacher">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Professor
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Administrador
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Senha *
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Senha temporária"
              className={`bg-white ${errors.password ? "border-red-500" : ""}`}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirmar senha */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirmar Senha *
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              className={`bg-white ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.submit && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                "Criar Usuário"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
