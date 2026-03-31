import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmBackButton } from "@/components/adm/AdmBackButton";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/Toast";
import { Save } from "lucide-react";

type Perm = {
  key: string;
  label: string;
  description: string;
};

const permissions: Perm[] = [
  {
    key: "view_reports",
    label: "Ver relatorios",
    description: "Acesso a paineis e indicadores de desempenho.",
  },
  {
    key: "manage_users",
    label: "Gerenciar usuarios",
    description: "Criar, editar e alterar status de contas no sistema.",
  },
  {
    key: "manage_disciplines",
    label: "Gerenciar disciplinas",
    description: "Configurar disciplinas, vinculos e conteudos.",
  },
  {
    key: "manage_coins",
    label: "Gerenciar moedas",
    description: "Ajustar regras, saldo e operacoes de moedas.",
  },
];

const initialRoles = {
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
} as const;

const roleMeta: Record<string, { chipClass: string; subtitle: string }> = {
  Administrador: {
    chipClass: "bg-violet-100 text-violet-700",
    subtitle: "Controle total da plataforma",
  },
  Professor: {
    chipClass: "bg-blue-100 text-blue-700",
    subtitle: "Permissões acadêmicas e operacionais",
  },
  Aluno: {
    chipClass: "bg-emerald-100 text-emerald-700",
    subtitle: "Acesso de leitura e recursos limitados",
  },
};

export default function UsuariosPermissoesPage() {
  const { show } = useToast();
  const [roles, setRoles] = useState<Record<string, Record<string, boolean>>>(
    initialRoles
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

  const setAllPermissions = (role: string, value: boolean) => {
    setRoles((prev) => ({
      ...prev,
      [role]: permissions.reduce<Record<string, boolean>>((acc, perm) => {
        acc[perm.key] = value;
        return acc;
      }, {}),
    }));
  };

  const pendingChanges = useMemo(
    () => JSON.stringify(roles) !== JSON.stringify(initialRoles),
    [roles]
  );

  const totalEnabled = useMemo(() => {
    return Object.values(roles).reduce((sum, rolePerms) => {
      return sum + Object.values(rolePerms).filter(Boolean).length;
    }, 0);
  }, [roles]);

  const save = () => {
    console.log("Salvar permissões", roles);
    show({
      variant: "success",
      title: "Permissões salvas com sucesso",
      description: "Os perfis foram atualizados.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Perfis e Permissões</h1>
            <p className="text-gray-600">Defina acessos por perfil do sistema</p>
          </div>
          <div className="flex gap-2">
            <AdmBackButton href="/adm/usuarios" />
            <Button
              onClick={save}
              disabled={!pendingChanges}
              className="rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> Salvar alterações
            </Button>
          </div>
        </header>

        <Card className="rounded-xl border border-violet-100 shadow-sm bg-gradient-to-br from-violet-50 via-white to-slate-50">
          <CardContent className="p-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-600">Resumo de acesso</p>
              <p className="text-xl font-semibold text-gray-900">
                {totalEnabled} permissões ativas de {Object.keys(roles).length * permissions.length}
              </p>
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                pendingChanges
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {pendingChanges ? "Alterações pendentes" : "Tudo salvo"}
            </span>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-3">
          {Object.keys(roles).map((role) => {
            const enabledCount = permissions.filter(
              (perm) => roles[role][perm.key]
            ).length;

            return (
              <Card key={role} className="rounded-xl shadow-sm border-0">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{role}</h3>
                      <p className="text-sm text-gray-600">{roleMeta[role]?.subtitle}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        roleMeta[role]?.chipClass
                      }`}
                    >
                      {enabledCount}/{permissions.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => setAllPermissions(role, true)}
                    >
                      Marcar todas
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => setAllPermissions(role, false)}
                    >
                      Limpar
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {permissions.map((perm) => (
                      <div
                        key={perm.key}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">{perm.label}</p>
                          <p className="text-xs text-gray-500">{perm.description}</p>
                        </div>
                        <Switch
                          className="data-[state=checked]:bg-violet-400 data-[state=unchecked]:bg-slate-200"
                          checked={!!roles[role][perm.key]}
                          onCheckedChange={() => toggle(role, perm.key)}
                          aria-label={`${perm.label} para ${role}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
