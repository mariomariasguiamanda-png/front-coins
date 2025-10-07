import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { User, Mail, Phone, Building, School } from "lucide-react";

interface ProfileData {
  readonly: {
    nomeCompleto: string;
    matricula: string;
    cpf: string;
    disciplinas: string[];
    turmas: string[];
    emailInstitucional: string;
  };
  editable: {
    emailAlternativo: string;
    telefone: string;
    senha: string;
    foto: string;
  };
}

export function PerfilProfessor({ data }: { data: ProfileData }) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie seus dados pessoais e institucionais
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Dados Institucionais */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <School className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold">Dados Institucionais</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Nome Completo</Label>
                <Input value={data.readonly.nomeCompleto} disabled className="rounded-xl" />
              </div>
              <div>
                <Label>Matrícula</Label>
                <Input value={data.readonly.matricula} disabled className="rounded-xl" />
              </div>
              <div>
                <Label>CPF</Label>
                <Input value={data.readonly.cpf} disabled className="rounded-xl" />
              </div>
              <div>
                <Label>Disciplinas</Label>
                <Input value={data.readonly.disciplinas.join(", ")} disabled className="rounded-xl" />
              </div>
              <div>
                <Label>Turmas</Label>
                <Input value={data.readonly.turmas.join(", ")} disabled className="rounded-xl" />
              </div>
              <div>
                <Label>E-mail Institucional</Label>
                <Input value={data.readonly.emailInstitucional} disabled className="rounded-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Pessoais */}
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <User className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold">Dados Pessoais</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label>E-mail Alternativo</Label>
                <Input value={data.editable.emailAlternativo} className="rounded-xl" />
              </div>
              <div>
                <Label>Telefone/WhatsApp</Label>
                <Input value={data.editable.telefone} className="rounded-xl" />
              </div>
              <div>
                <Label>Alterar Senha</Label>
                <Input type="password" placeholder="••••••••" className="rounded-xl" />
              </div>
              <div>
                <Label>Foto de Perfil</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-violet-100">
                    <img
                      src={data.editable.foto || "/placeholder-avatar.png"}
                      alt="Foto de perfil"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <Button variant="outline" className="rounded-xl">
                    Alterar foto
                  </Button>
                </div>
              </div>

              <Button className="w-full rounded-xl">Salvar alterações</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}