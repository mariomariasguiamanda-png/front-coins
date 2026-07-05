import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  User,
  Mail,
  Phone,
  School,
  Camera,
  Save,
  Lock,
  Shield,
  Calendar,
  BookOpen,
  Users,
  Eye,
  EyeOff,
  Upload
} from "lucide-react";
import { useState, useRef } from "react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editableData, setEditableData] = useState(data.editable);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
  const [erroSenha, setErroSenha] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await onUploadFoto(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      {/* Header com Avatar Grande */}
      <Card className="rounded-xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"></div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20">
            <div className="relative">
              <div className="h-32 w-32 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden">
                <img
                  src={data.editable.foto || "/placeholder-avatar.png"}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow-lg transition-all"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 md:mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{data.readonly.nomeCompleto}</h1>
              <p className="text-gray-900 mt-1">Professor(a)</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.readonly.disciplinas.slice(0, 3).map((disciplina, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700"
                  >
                    {disciplina}
                  </span>
                ))}
                {data.readonly.disciplinas.length > 3 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    +{data.readonly.disciplinas.length - 3}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl bg-violet-600 hover:bg-violet-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={saving}
                    className="rounded-xl"
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      {data.stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{data.stats.totalAlunos}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-l-4 border-l-violet-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disciplinas</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{data.readonly.disciplinas.length}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Turmas</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{data.readonly.turmas.length}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Camera className="h-4 w-4 text-gray-500" />
                  Foto de Perfil
                </Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-violet-100 overflow-hidden">
                    <img
                      src={data.editable.foto || "/placeholder-avatar.png"}
                      alt="Foto de perfil"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={triggerFileInput}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar foto
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
