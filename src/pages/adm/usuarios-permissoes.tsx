import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { AdmBackButton } from "@/components/adm/AdmBackButton";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/Toast";
import { Save } from "lucide-react";
import { getSystemSettings, updateSystemSettings, type SystemSettings } from "@/services/api/system-settings";

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

type RolesState = Record<string, Record<string, boolean>>;

const roleKeys = Object.keys(initialRoles);

const createDefaultRolesState = (): RolesState =>
  roleKeys.reduce<RolesState>((acc, role) => {
    acc[role] = { ...initialRoles[role as keyof typeof initialRoles] };
    return acc;
  }, {});

const permissionsToRoleState = (permissions?: SystemSettings["permissions"]): RolesState => {
  const next = createDefaultRolesState();

  permissions?.forEach((permissionGroup) => {
    if (!next[permissionGroup.perfil]) return;

    next[permissionGroup.perfil] = {
      ...next[permissionGroup.perfil],
      view_reports: Boolean(permissionGroup.modulos?.view_reports),
      manage_users: Boolean(permissionGroup.modulos?.manage_users),
      manage_disciplines: Boolean(permissionGroup.modulos?.manage_disciplines),
      manage_coins: Boolean(permissionGroup.modulos?.manage_coins),
    };
  });

  return next;
};

const roleStateToPermissions = (
  roles: RolesState,
  currentPermissions?: SystemSettings["permissions"]
): NonNullable<SystemSettings["permissions"]> => {
  const byRole = new Map((currentPermissions ?? []).map((item) => [item.perfil, item]));

  return roleKeys.map((role) => {
    const existing = byRole.get(role);
    const rolePermissions = roles[role] ?? initialRoles[role as keyof typeof initialRoles];

    return {
      perfil: role,
      ...(existing?.recursos ? { recursos: existing.recursos } : {}),
      modulos: {
        ...existing?.modulos,
        view_reports: Boolean(rolePermissions.view_reports),
        manage_users: Boolean(rolePermissions.manage_users),
        manage_disciplines: Boolean(rolePermissions.manage_disciplines),
        manage_coins: Boolean(rolePermissions.manage_coins),
      },
    };
  });
};

export default function UsuariosPermissoesPage() {
  const { show } = useToast();
  const [data, setData] = useState<SystemSettings | null>(null);
  const [roles, setRoles] = useState<RolesState | null>(null);
  const [saving, setSaving] = useState(false);
  const currentRoles = roles ?? createDefaultRolesState();

  useEffect(() => {
    getSystemSettings().then((settings) => {
      setData(settings);
      setRoles(permissionsToRoleState(settings.permissions));
    });
  }, []);

  const toggle = (role: string, perm: string) => {
    setRoles((prev) => ({
      ...(prev ?? createDefaultRolesState()),
      [role]: {
        ...((prev ?? createDefaultRolesState())[role]),
        [perm]: !((prev ?? createDefaultRolesState())[role][perm]),
      },
    }));
  };

  const setAllPermissions = (role: string, value: boolean) => {
    setRoles((prev) => ({
      ...(prev ?? createDefaultRolesState()),
      [role]: permissions.reduce<Record<string, boolean>>((acc, perm) => {
        acc[perm.key] = value;
        return acc;
      }, {}),
    }));
  };

  const pendingChanges = useMemo(() => {
    if (!data || !roles) return false;

    return JSON.stringify(roles) !== JSON.stringify(permissionsToRoleState(data.permissions));
  }, [data, roles]);

  const totalEnabled = useMemo(() => {
    return Object.values(currentRoles).reduce((sum, rolePerms) => {
      return sum + Object.values(rolePerms).filter(Boolean).length;
    }, 0);
  }, [currentRoles]);

  const save = async () => {
    if (!data || !roles) return;

    try {
      setSaving(true);
      const saved = await updateSystemSettings({
        ...data,
        permissions: roleStateToPermissions(roles, data.permissions),
      });

      setData(saved);
      setRoles(permissionsToRoleState(saved.permissions));

      show({
        variant: "success",
        title: "Permissões salvas com sucesso",
        description: "Os perfis foram atualizados.",
      });
    } finally {
      setSaving(false);
    }
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
              type="button"
              onClick={save}
              disabled={!pendingChanges || saving || !roles}
              isLoading={saving}
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
                {totalEnabled} permissões ativas de {roleKeys.length * permissions.length}
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
          {roleKeys.map((role) => {
            const rolePermissions = roles?.[role] ?? initialRoles[role as keyof typeof initialRoles];
            const enabledCount = permissions.filter(
              (perm) => (rolePermissions as Record<string, boolean>)[perm.key]
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
                          checked={!!(rolePermissions as Record<string, boolean>)[perm.key]}
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
