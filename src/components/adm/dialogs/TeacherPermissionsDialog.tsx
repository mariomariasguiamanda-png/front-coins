import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNotification, composeMessages } from "@/services/api/notifications";

interface TeacherPermissions {
  createActivities: boolean;
  assignCoins: boolean;
  createContent: boolean;
  generateReports: boolean;
}

interface TeacherRole {
  subject: string;
  role: "principal" | "collaborator";
  classes: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (permissions: TeacherPermissions, roles: TeacherRole[]) => void;
  initialPermissions?: TeacherPermissions;
  initialRoles?: TeacherRole[];
  teacherName: string;
}

const AVAILABLE_SUBJECTS = [
  "Matemática",
  "Português",
  "Ciências",
  "História",
  "Geografia",
  "Física",
  "Química",
  "Biologia",
  "Inglês",
];

const AVAILABLE_CLASSES = [
  "1º A",
  "1º B",
  "2º A",
  "2º B",
  "3º A",
  "3º B",
];

export function TeacherPermissionsDialog({
  open,
  onClose,
  onSave,
  initialPermissions,
  initialRoles,
  teacherName,
}: Props) {
  const [permissions, setPermissions] = useState<TeacherPermissions>(
    initialPermissions || {
      createActivities: false,
      assignCoins: false,
      createContent: false,
      generateReports: false,
    }
  );

  const [roles, setRoles] = useState<TeacherRole[]>(
    initialRoles || []
  );

  const handleAddRole = () => {
    setRoles([
      ...roles,
      {
        subject: "",
        role: "collaborator",
        classes: [],
      },
    ]);
  };

  const handleRemoveRole = async (index: number) => {
    const removed = roles[index];
    setRoles(roles.filter((_, i) => i !== index));
    if (removed && removed.subject) {
      const { message, actionType } = composeMessages.teacherUnlinked({
        adminNome: "Administrador (sessão)",
        teacherNome: teacherName,
        disciplina: removed.subject,
      });
      await createNotification({ message, actionType, recipients: ["Administrador", "Coordenador"], context: { subject: removed.subject } });
    }
  };

  const handleRoleChange = (index: number, field: keyof TeacherRole, value: any) => {
    setRoles(
      roles.map((role, i) =>
        i === index ? { ...role, [field]: value } : role
      )
    );
  };

  const handleSave = () => {
    onSave(permissions, roles);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Permissões do Professor - {teacherName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Permissões */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permissões</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="createActivities" className="flex flex-col">
                  <span>Criar e Publicar Atividades</span>
                  <span className="text-sm text-muted-foreground">
                    Permite criar e publicar novas atividades para os alunos
                  </span>
                </Label>
                <Switch
                  id="createActivities"
                  checked={permissions.createActivities}
                  onCheckedChange={(checked) =>
                    setPermissions({ ...permissions, createActivities: checked })
                  }
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="assignCoins" className="flex flex-col">
                  <span>Atribuir Moedas</span>
                  <span className="text-sm text-muted-foreground">
                    Permite atribuir moedas aos alunos
                  </span>
                </Label>
                <Switch
                  id="assignCoins"
                  checked={permissions.assignCoins}
                  onCheckedChange={(checked) =>
                    setPermissions({ ...permissions, assignCoins: checked })
                  }
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="createContent" className="flex flex-col">
                  <span>Criar Conteúdo</span>
                  <span className="text-sm text-muted-foreground">
                    Permite criar resumos e videoaulas
                  </span>
                </Label>
                <Switch
                  id="createContent"
                  checked={permissions.createContent}
                  onCheckedChange={(checked) =>
                    setPermissions({ ...permissions, createContent: checked })
                  }
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="generateReports" className="flex flex-col">
                  <span>Gerar Relatórios</span>
                  <span className="text-sm text-muted-foreground">
                    Permite gerar relatórios da turma
                  </span>
                </Label>
                <Switch
                  id="generateReports"
                  checked={permissions.generateReports}
                  onCheckedChange={(checked) =>
                    setPermissions({ ...permissions, generateReports: checked })
                  }
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>
            </div>
          </div>

          {/* Disciplinas e Funções */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Disciplinas e Funções</h3>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg bg-violet-50/50 border-violet-100 hover:bg-violet-100/50"
                onClick={handleAddRole}
              >
                Adicionar Disciplina
              </Button>
            </div>

            <div className="space-y-4">
              {roles.map((role, index) => (
                <div
                  key={index}
                  className="grid gap-4 p-4 bg-violet-50/30 rounded-lg border border-violet-100"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Disciplina</Label>
                      <Select
                        value={role.subject}
                        onValueChange={(value) =>
                          handleRoleChange(index, "subject", value)
                        }
                      >
                        <SelectTrigger className="rounded-lg bg-white">
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_SUBJECTS.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Função</Label>
                      <Select
                        value={role.role}
                        onValueChange={(value) =>
                          handleRoleChange(index, "role", value)
                        }
                      >
                        <SelectTrigger className="rounded-lg bg-white">
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="principal">Principal</SelectItem>
                          <SelectItem value="collaborator">Colaborador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label>Turmas</Label>
                      <Select
                        value={role.classes[0]}
                        onValueChange={(value) =>
                          handleRoleChange(index, "classes", [value])
                        }
                      >
                        <SelectTrigger className="rounded-lg bg-white">
                          <SelectValue placeholder="Selecione as turmas" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_CLASSES.map((className) => (
                            <SelectItem key={className} value={className}>
                              {className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveRole(index)}
                  >
                    Remover Disciplina
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-violet-600 hover:bg-violet-700"
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}