import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { createNotification, composeMessages } from "@/services/api/notifications";

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface EditPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
  initialPermissions: Permission[];
  onSave: (permissions: Permission[]) => void;
}

export function EditPermissionsDialog({
  isOpen,
  onClose,
  profileName,
  initialPermissions,
  onSave,
}: EditPermissionsDialogProps) {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);

  const handleTogglePermission = (permissionId: string) => {
    setPermissions((currentPermissions) =>
      currentPermissions.map((permission) =>
        permission.id === permissionId
          ? { ...permission, enabled: !permission.enabled }
          : permission
      )
    );
  };

  const handleSave = async () => {
    // Compute diffs against initialPermissions
    const changed = permissions.filter((p) => {
      const original = initialPermissions.find((i) => i.id === p.id);
      return original && original.enabled !== p.enabled;
    });

    if (changed.length) {
      const { message, actionType } = composeMessages.permissionsChanged({
        perfil: profileName,
        adminNome: "Administrador (sessão)",
        diffs: changed.map((c) => ({ name: c.name, enabled: c.enabled })),
      });
      await createNotification({
        message,
        actionType,
        recipients: ["Administrador", "Coordenador"],
        context: { perfil: profileName },
      });
    }
    onSave(permissions);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Editar Permissões - {profileName}
          </DialogTitle>
          <DialogDescription>
            Ative ou desative as permissões para este perfil de acesso.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {permissions.map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50/50"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {permission.name}
                </h4>
                <p className="text-sm text-gray-500">{permission.description}</p>
              </div>
              <Switch
                checked={permission.enabled}
                onCheckedChange={() => handleTogglePermission(permission.id)}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-lg border-violet-100 hover:border-violet-200 hover:bg-violet-50/50"
          >
            <div className="flex items-center justify-center">
              <X className="mr-2 h-4 w-4 text-violet-500" />
              <span className="text-violet-700">Cancelar</span>
            </div>
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-lg bg-violet-600 hover:bg-violet-700"
          >
            <div className="flex items-center justify-center">
              <Check className="mr-2 h-4 w-4" />
              <span>Salvar Alterações</span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}