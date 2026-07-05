import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  User,
  Mail,
  Phone,
  School,
  Lock,
  Shield,
  Calendar,
  BookOpen,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileHero, type ProfileStat } from "@/components/perfil/ProfileHero";

interface ProfileData {
  readonly: {
    nomeCompleto: string;
    disciplinas: string[];
    turmas: string[];
    emailInstitucional: string;
    cadastradoEm?: string | null;
  };
  editable: {
    telefone: string;
    especialidade: string;
    foto: string | null;
  };
  stats?: {
    totalAlunos: number;
  };
}

interface PerfilProfessorProps {
  data: ProfileData;
  onSave: (dados: { telefone: string; especialidade: string }) => Promise<void>;
  onUploadFoto: (file: File) => Promise<void>;
  onChangePassword: (senhaAtual: string, senhaNova: string) => Promise<void>;
}

export function PerfilProfessor({ data, onSave, onUploadFoto, onChangePassword }: PerfilProfessorProps) {
  const { signOut } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [editableData, setEditableData] = useState(data.editable);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
  const [erroSenha, setErroSenha] = useState<string | null>(null);

  // Ressincroniza os campos com o que vem do servidor (ex: depois de salvar
  // ou trocar a foto, o pai recarrega `data` - sem isso os inputs ficavam
  // presos no valor capturado só no primeiro mount). Não mexe se o professor
  // estiver editando, pra não apagar o que ele está digitando.
  useEffect(() => {
    if (!isEditing) {
      setEditableData(data.editable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.editable]);

  const limparCamposSenha = () => {
    setSenhaAtual("");
    setSenhaNova("");
    setSenhaConfirmacao("");
    setErroSenha(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ telefone: editableData.telefone, especialidade: editableData.especialidade });

      if (senhaAtual || senhaNova || senhaConfirmacao) {
        if (senhaNova.length < 6) {
          setErroSenha("A nova senha precisa de pelo menos 6 caracteres");
          setSaving(false);
          return;
        }
        if (senhaNova !== senhaConfirmacao) {
          setErroSenha("As senhas não coincidem");
          setSaving(false);
          return;
        }
        await onChangePassword(senhaAtual, senhaNova);
        limparCamposSenha();
      }

      setIsEditing(false);
    } catch (err: any) {
      setErroSenha(err?.message ?? "Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditableData(data.editable);
    limparCamposSenha();
    setIsEditing(false);
  };

  const handleUploadFoto = async (file: File) => {
    setUploadingFoto(true);
    try {
      await onUploadFoto(file);
    } finally {
      setUploadingFoto(false);
    }
  };

  const stats: ProfileStat[] = [
    { label: "Total de Alunos", value: data.stats?.totalAlunos ?? 0, icon: Users, color: "blue" },
    { label: "Disciplinas", value: data.readonly.disciplinas.length, icon: BookOpen, color: "violet" },
    { label: "Turmas", value: data.readonly.turmas.length, icon: Users, color: "amber" },
  ];

  return (
    <div className="space-y-6 pb-8">
      <ProfileHero
        nomeCompleto={data.readonly.nomeCompleto}
        subtitulo="Professor(a)"
        badges={data.readonly.disciplinas}
        fotoUrl={data.editable.foto}
        onUploadFoto={handleUploadFoto}
        uploadingFoto={uploadingFoto}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
        onSignOut={signOut}
        stats={data.stats ? stats : undefined}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dados Institucionais */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <School className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Dados Institucionais</h2>
                <p className="text-sm text-gray-500">Informações não editáveis</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Nome Completo
                </Label>
                <Input
                  value={data.readonly.nomeCompleto}
                  disabled
                  className="rounded-xl mt-1 bg-gray-50"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  Disciplinas
                </Label>
                <Input
                  value={data.readonly.disciplinas.join(", ") || "Nenhuma disciplina vinculada"}
                  disabled
                  className="rounded-xl mt-1 bg-gray-50"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  Turmas
                </Label>
                <Input
                  value={data.readonly.turmas.join(", ") || "Nenhuma turma"}
                  disabled
                  className="rounded-xl mt-1 bg-gray-50"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  E-mail Institucional
                </Label>
                <Input
                  value={data.readonly.emailInstitucional}
                  disabled
                  className="rounded-xl mt-1 bg-gray-50"
                />
              </div>

              {data.readonly.cadastradoEm && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Cadastrado em
                  </Label>
                  <Input
                    value={new Date(data.readonly.cadastradoEm).toLocaleDateString('pt-BR')}
                    disabled
                    className="rounded-xl mt-1 bg-gray-50"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dados Pessoais Editáveis */}
        <Card className={`rounded-xl shadow-sm ${isEditing ? 'border-2 border-violet-300' : ''}`}>
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <User className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Dados Pessoais</h2>
                <p className="text-sm text-gray-500">Informações editáveis</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  Telefone/WhatsApp
                </Label>
                <Input
                  value={editableData.telefone}
                  onChange={(e) => setEditableData({ ...editableData, telefone: e.target.value })}
                  disabled={!isEditing}
                  className={`rounded-xl mt-1 ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  Especialidade
                </Label>
                <Input
                  value={editableData.especialidade}
                  onChange={(e) => setEditableData({ ...editableData, especialidade: e.target.value })}
                  disabled={!isEditing}
                  className={`rounded-xl mt-1 ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Ex: Matemática e Física"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  Alterar Senha
                </Label>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha atual"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      disabled={!isEditing}
                      className={`rounded-xl ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nova senha"
                        value={senhaNova}
                        onChange={(e) => setSenhaNova(e.target.value)}
                        className="rounded-xl"
                      />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirmar nova senha"
                        value={senhaConfirmacao}
                        onChange={(e) => setSenhaConfirmacao(e.target.value)}
                        className="rounded-xl"
                      />
                    </>
                  )}
                  {erroSenha && <p className="text-sm text-red-600">{erroSenha}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
