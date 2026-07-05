import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  BookOpen,
  School,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Palette,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { ProfileHero, type ProfileStat } from "@/components/perfil/ProfileHero";

export interface AdminProfileData {
  readonly: {
    nomeCompleto: string;
    emailInstitucional: string;
    cadastradoEm: string | null;
  };
  editable: {
    telefone: string;
    foto: string | null;
  };
  stats: {
    totalAlunos: number;
    totalProfessores: number;
    totalTurmas: number;
  };
}

interface PerfilAdminProps {
  data: AdminProfileData;
  onSave: (dados: { nome: string; telefone: string }) => Promise<void>;
  onUploadFoto: (file: File) => Promise<void>;
  onChangePassword: (senhaAtual: string, senhaNova: string) => Promise<void>;
}

export function PerfilAdmin({ data, onSave, onUploadFoto, onChangePassword }: PerfilAdminProps) {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [nome, setNome] = useState(data.readonly.nomeCompleto);
  const [telefone, setTelefone] = useState(data.editable.telefone);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
  const [erroSenha, setErroSenha] = useState<string | null>(null);

  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesPush, setNotificacoesPush] = useState(true);

  useEffect(() => {
    if (!isEditing) {
      setNome(data.readonly.nomeCompleto);
      setTelefone(data.editable.telefone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.readonly.nomeCompleto, data.editable.telefone]);

  useEffect(() => {
    const email = localStorage.getItem("notificacoesEmail");
    const push = localStorage.getItem("notificacoesPush");
    if (email !== null) setNotificacoesEmail(JSON.parse(email));
    if (push !== null) setNotificacoesPush(JSON.parse(push));
  }, []);

  const limparCamposSenha = () => {
    setSenhaAtual("");
    setSenhaNova("");
    setSenhaConfirmacao("");
    setErroSenha(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ nome, telefone });

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
    setNome(data.readonly.nomeCompleto);
    setTelefone(data.editable.telefone);
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

  const handleTogglePreferencia = (tipo: "email" | "push") => {
    if (tipo === "email") {
      const novo = !notificacoesEmail;
      setNotificacoesEmail(novo);
      localStorage.setItem("notificacoesEmail", JSON.stringify(novo));
    } else {
      const novo = !notificacoesPush;
      setNotificacoesPush(novo);
      localStorage.setItem("notificacoesPush", JSON.stringify(novo));
    }
  };

  const stats: ProfileStat[] = [
    { label: "Total de Alunos", value: data.stats.totalAlunos, icon: Users, color: "blue" },
    { label: "Total de Professores", value: data.stats.totalProfessores, icon: BookOpen, color: "violet" },
    { label: "Total de Turmas", value: data.stats.totalTurmas, icon: School, color: "amber" },
  ];

  return (
    <div className="space-y-6 pb-8">
      <ProfileHero
        nomeCompleto={data.readonly.nomeCompleto}
        subtitulo="Administrador do Sistema"
        fotoUrl={data.editable.foto}
        onUploadFoto={handleUploadFoto}
        uploadingFoto={uploadingFoto}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
        onSignOut={signOut}
        stats={stats}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dados Institucionais */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Dados Institucionais</h2>
                <p className="text-sm text-gray-500">Informações não editáveis</p>
              </div>
            </div>

            <div className="space-y-4">
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
                    value={new Date(data.readonly.cadastradoEm).toLocaleDateString("pt-BR")}
                    disabled
                    className="rounded-xl mt-1 bg-gray-50"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dados Pessoais Editáveis */}
        <Card className={`rounded-xl shadow-sm ${isEditing ? "border-2 border-violet-300" : ""}`}>
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
                  <User className="h-4 w-4 text-gray-500" />
                  Nome Completo
                </Label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={!isEditing}
                  className={`rounded-xl mt-1 ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  Telefone
                </Label>
                <Input
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  disabled={!isEditing}
                  className={`rounded-xl mt-1 ${!isEditing ? "bg-gray-50" : ""}`}
                  placeholder="(11) 98765-4321"
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
                      className={`rounded-xl ${!isEditing ? "bg-gray-50" : ""}`}
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

      {/* Preferências (exclusivo do admin) */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Palette className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Preferências do Sistema</h2>
              <p className="text-sm text-gray-500">Personalize sua experiência no sistema</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Notificações por E-mail</p>
                  <p className="text-sm text-gray-600">Receba atualizações importantes por e-mail</p>
                </div>
              </div>
              <button
                onClick={() => handleTogglePreferencia("email")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  notificacoesEmail ? "bg-violet-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    notificacoesEmail ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Notificações Push</p>
                  <p className="text-sm text-gray-600">Receba notificações em tempo real no navegador</p>
                </div>
              </div>
              <button
                onClick={() => handleTogglePreferencia("push")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  notificacoesPush ? "bg-violet-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    notificacoesPush ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Modo Escuro</p>
                  <p className="text-sm text-gray-600">Ative o tema escuro para reduzir o brilho da tela</p>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  theme === "dark" ? "bg-violet-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
