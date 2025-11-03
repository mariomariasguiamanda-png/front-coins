import { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { ArrowLeft, Save } from "lucide-react";

type Perm = {
  key: string;
  label: string;
};

const permissions: Perm[] = [
  { key: "view_reports", label: "Ver relatórios" },
  { key: "manage_users", label: "Gerenciar usuários" },
  { key: "manage_disciplines", label: "Gerenciar disciplinas" },
  { key: "manage_coins", label: "Gerenciar moedas" },
];

export default function UsuariosPermissoesPage() {
  const [roles, setRoles] = useState<Record<string, Record<string, boolean>>>(
    {
      Administrador: {
        view_reports: true,
        manage_users: true,
        manage_disciplines: true,
        manage_coins: true,
      },
      Professor: {
        view_reports: true,
        manage_users: false,
        manage_disciplines: true,
        manage_coins: false,
      },
      Aluno: {
        view_reports: true,
        manage_users: false,
        manage_disciplines: false,
        manage_coins: false,
      },
    }
  );

  const toggle = (role: string, perm: string) => {
    setRoles((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role][perm],
      },
    }));
  };

  const save = () => {
    console.log("Salvar permissões", roles);
    alert("Permissões salvas.");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Perfis e Permissões</h1>
            <p className="text-muted-foreground">Defina acessos por perfil do sistema</p>
          </div>
          <div className="flex gap-2">
            <Link href="/adm/usuarios">
              <Button variant="outline" className="rounded-lg">
                <ArrowLeft className="h-4 w-4" /> Voltar ao hub
              </Button>
            </Link>
            <Button onClick={save} className="rounded-lg bg-violet-600 hover:bg-violet-700">
              <Save className="h-4 w-4" /> Salvar alterações
            </Button>
          </div>
        </header>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="grid gap-6">
              {Object.keys(roles).map((role) => (
                <div key={role} className="space-y-3">
                  <h3 className="text-lg font-semibold">{role}</h3>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {permissions.map((p) => (
                      <label key={p.key} className="flex items-center gap-3 rounded-lg border p-3">
                        <input
                          type="checkbox"
                          checked={!!roles[role][p.key]}
                          onChange={() => toggle(role, p.key)}
                          className="h-4 w-4"
                        />
                        <Label className="cursor-pointer select-none">{p.label}</Label>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
