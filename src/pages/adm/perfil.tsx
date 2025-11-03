import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { Camera, Mail, Phone, User, Lock, Save, Eye, EyeOff, Bell, Palette } from "lucide-react";
import { admin } from "@/lib/mock/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useTheme } from "@/contexts/ThemeContext";

type Tab = "dados" | "senha" | "preferencias";

export default function PerfilAdministrador() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("dados");
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dados pessoais
  const [nome, setNome] = useState(admin.nome);
  const [email, setEmail] = useState(admin.email);
  const [telefone, setTelefone] = useState("(11) 98765-4321");
  const [cargo, setCargo] = useState("Administrador do Sistema");

  // Senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Preferências
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesPush, setNotificacoesPush] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(theme === "dark");

  // Sync theme state with context
  useEffect(() => {
    setTemaEscuro(theme === "dark");
  }, [theme]);

  const handleSaveDados = () => {
    // Mock - aqui você faria a chamada à API
    alert("Dados salvos com sucesso!");
    setIsEditing(false);
  };

  const handleSaveSenha = () => {
    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    if (novaSenha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres!");
      return;
    }
    // Mock - aqui você faria a chamada à API
    alert("Senha alterada com sucesso!");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  const handleSavePreferencias = () => {
    // Save notification preferences to localStorage
    localStorage.setItem("notificacoesEmail", JSON.stringify(notificacoesEmail));
    localStorage.setItem("notificacoesPush", JSON.stringify(notificacoesPush));
    
    // Theme is already saved by ThemeContext
    alert("Preferências salvas com sucesso!");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex items-end gap-6 -mt-16">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">
                    {admin.nome.split(" ")[0][0]}{admin.nome.split(" ")[1]?.[0] || ""}
                  </span>
                </div>
                <button className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition flex items-center justify-center">
                  <Camera className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">{admin.nome}</h2>
                <p className="text-gray-600">{cargo}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {admin.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {telefone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex gap-1 p-1">
              <button
                onClick={() => setActiveTab("dados")}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === "dados"
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <User className="h-4 w-4 inline-block mr-2" />
                Dados Pessoais
              </button>
              <button
                onClick={() => setActiveTab("senha")}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === "senha"
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Lock className="h-4 w-4 inline-block mr-2" />
                Segurança
              </button>
              <button
                onClick={() => setActiveTab("preferencias")}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === "preferencias"
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Palette className="h-4 w-4 inline-block mr-2" />
                Preferências
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Tab: Dados Pessoais */}
            {activeTab === "dados" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Informações Pessoais</h3>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      Editar
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      disabled={!isEditing}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      disabled={!isEditing}
                      className="input-field"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSaveDados} className="inline-flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setNome(admin.nome);
                        setEmail(admin.email);
                      }}
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Segurança */}
            {activeTab === "senha" && (
              <div className="space-y-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Alterar Senha</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Sua senha deve ter no mínimo 6 caracteres
                  </p>
                </div>

                <div className="max-w-md space-y-4">
                  <div>
                    <Label htmlFor="senhaAtual">Senha Atual</Label>
                    <div className="relative">
                      <Input
                        id="senhaAtual"
                        type={showCurrentPassword ? "text" : "password"}
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        className="input-field pr-10"
                        placeholder="Digite sua senha atual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="novaSenha">Nova Senha</Label>
                    <div className="relative">
                      <Input
                        id="novaSenha"
                        type={showNewPassword ? "text" : "password"}
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        className="input-field pr-10"
                        placeholder="Digite sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmarSenha"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className="input-field pr-10"
                        placeholder="Confirme sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button onClick={handleSaveSenha} className="inline-flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Alterar Senha
                    </Button>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Dicas de Segurança</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Use uma senha forte com letras, números e símbolos</li>
                    <li>• Não compartilhe sua senha com ninguém</li>
                    <li>• Altere sua senha regularmente</li>
                    <li>• Não use a mesma senha em múltiplos sistemas</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Preferências */}
            {activeTab === "preferencias" && (
              <div className="space-y-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Preferências do Sistema</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Personalize sua experiência no sistema
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Notificações */}
                  <div className="border-b border-gray-200 pb-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Bell className="h-5 w-5 text-violet-600" />
                      Notificações
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Notificações por E-mail</p>
                          <p className="text-sm text-gray-600">
                            Receba atualizações importantes por e-mail
                          </p>
                        </div>
                        <button
                          onClick={() => setNotificacoesEmail(!notificacoesEmail)}
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
                        <div>
                          <p className="font-medium text-gray-900">Notificações Push</p>
                          <p className="text-sm text-gray-600">
                            Receba notificações em tempo real no navegador
                          </p>
                        </div>
                        <button
                          onClick={() => setNotificacoesPush(!notificacoesPush)}
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
                    </div>
                  </div>

                  {/* Aparência */}
                  <div className="pb-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette className="h-5 w-5 text-violet-600" />
                      Aparência
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Modo Escuro</p>
                        <p className="text-sm text-gray-600">
                          Ative o tema escuro para reduzir o brilho da tela
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newValue = !temaEscuro;
                          setTemaEscuro(newValue);
                          toggleTheme();
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          temaEscuro ? "bg-violet-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            temaEscuro ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button onClick={handleSavePreferencias} className="inline-flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Preferências
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
