"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import NotificationCard from "@/components/ui/NotificationCard";
import {
  User,
  Mail,
  Phone,
  School,
  IdCard,
  Users,
  Coins,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { api, resolveMediaUrl } from "@/lib/api";
import { useAuth } from "@/services/auth/AuthContext";
import { ProfileHero, type ProfileStat } from "@/components/perfil/ProfileHero";

type NotificationType = "success" | "error" | "info";

interface ProfileData {
  nome: string;
  email: string;
  telefone: string;
  instituicao: string;
  matricula: string;
  cpf: string;
  turma: string;
  foto_url: string | null;
  total_moedas_historico: number;
}

export default function Perfil() {
  const router = useRouter();
  const { signOut, refresh } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    nome: "",
    email: "",
    telefone: "",
    instituicao: "",
    matricula: "",
    cpf: "",
    turma: "",
    foto_url: null,
    total_moedas_historico: 0,
  });

  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
  const [erroSenha, setErroSenha] = useState<string | null>(null);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<NotificationType>("info");

  function showNotificationFn(message: string, type: NotificationType) {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setLoading(true);

        const data = await api.get("/aluno/perfil");
        if (!isMounted) return;

        const loadedProfile: ProfileData = {
          nome: data.nome ?? "",
          email: data.email ?? "",
          telefone: data.telefone ?? "",
          instituicao: data.instituicao ?? "",
          matricula: data.matricula ?? "",
          cpf: data.cpf ?? "",
          turma: data.turma?.nome ?? "",
          foto_url: data.foto_url ?? null,
          total_moedas_historico: data.total_moedas_historico ?? 0,
        };

        setProfile(loadedProfile);
        setOriginalProfile(loadedProfile);
      } catch (error: any) {
        console.error(error);
        if (!isMounted) return;

        showNotificationFn(
          "Erro ao carregar seus dados. Fale com o administrador ou faça login novamente.",
          "error"
        );
        router.replace("/login");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  function handleChange(field: "nome" | "telefone", value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function limparCamposSenha() {
    setSenhaAtual("");
    setSenhaNova("");
    setSenhaConfirmacao("");
    setErroSenha(null);
  }

  async function handleSave() {
    const nomeAparado = profile.nome.trim();
    if (!nomeAparado) {
      setErroSenha("O nome não pode ficar em branco.");
      return;
    }

    try {
      setSaving(true);

      await api.patch("/aluno/perfil", {
        nome: nomeAparado,
        telefone: profile.telefone,
      });

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
        await api.patch("/aluno/perfil/senha", {
          senha_atual: senhaAtual,
          senha_nova: senhaNova,
        });
        limparCamposSenha();
      }

      setProfile((prev) => ({ ...prev, nome: nomeAparado }));
      setOriginalProfile((prev) => (prev ? { ...prev, nome: nomeAparado } : prev));
      setIsEditing(false);

      // Atualiza nome exibido no header (AuthContext) sem precisar recarregar a página
      refresh();

      showNotificationFn("Dados atualizados com sucesso!", "success");
    } catch (error: any) {
      console.error(error);
      setErroSenha(error?.message ?? "Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    limparCamposSenha();
    setIsEditing(false);
  }

  const TAMANHO_MAX_FOTO = 5 * 1024 * 1024; // 5MB

  async function handleUploadFoto(file: File) {
    if (!file.type.startsWith("image/")) {
      showNotificationFn("Selecione um arquivo de imagem válido.", "error");
      return;
    }
    if (file.size > TAMANHO_MAX_FOTO) {
      showNotificationFn("A foto deve ter no máximo 5MB.", "error");
      return;
    }

    try {
      setUploadingFoto(true);

      const formData = new FormData();
      formData.append("foto", file);

      const data = await api.upload("/aluno/perfil/foto", formData);
      const fotoUrl = data.foto_url as string;

      setProfile((prev) => ({ ...prev, foto_url: fotoUrl }));
      setOriginalProfile((prev) => (prev ? { ...prev, foto_url: fotoUrl } : prev));

      // Atualiza foto exibida no header (AuthContext) sem precisar recarregar a página
      refresh();

      showNotificationFn("Foto atualizada com sucesso!", "success");
    } catch (error: any) {
      console.error(error);
      showNotificationFn("Erro ao salvar a foto.", "error");
    } finally {
      setUploadingFoto(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  const stats: ProfileStat[] = [
    { label: "Turma", value: profile.turma || "Sem turma", icon: Users, color: "blue" },
    { label: "Matrícula", value: profile.matricula || "-", icon: IdCard, color: "violet" },
    { label: "Moedas Totais", value: profile.total_moedas_historico, icon: Coins, color: "amber" },
  ];

  return (
    <div className="page-enter min-h-screen bg-violet-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <ProfileHero
          nomeCompleto={profile.nome}
          subtitulo="Aluno(a)"
          fotoUrl={resolveMediaUrl(profile.foto_url)}
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
                  <School className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Dados Institucionais</h2>
                  <p className="text-sm text-gray-500">
                    Informações gerenciadas pela instituição, não editáveis
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    E-mail
                  </Label>
                  <Input value={profile.email} disabled className="rounded-xl mt-1 bg-gray-50" />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <School className="h-4 w-4 text-gray-500" />
                    Instituição
                  </Label>
                  <Input value={profile.instituicao} disabled className="rounded-xl mt-1 bg-gray-50" />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-gray-500" />
                    Matrícula
                  </Label>
                  <Input value={profile.matricula} disabled className="rounded-xl mt-1 bg-gray-50" />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-gray-500" />
                    CPF
                  </Label>
                  <Input value={profile.cpf} disabled className="rounded-xl mt-1 bg-gray-50" />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    Turma
                  </Label>
                  <Input value={profile.turma} disabled className="rounded-xl mt-1 bg-gray-50" />
                </div>
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
                    Nome completo
                  </Label>
                  <Input
                    value={profile.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                    disabled={!isEditing}
                    className={`rounded-xl mt-1 ${!isEditing ? "bg-gray-50" : ""}`}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Celular
                  </Label>
                  <Input
                    value={profile.telefone}
                    onChange={(e) => handleChange("telefone", e.target.value)}
                    disabled={!isEditing}
                    className={`rounded-xl mt-1 ${!isEditing ? "bg-gray-50" : ""}`}
                    placeholder="+55 49 90000-0000"
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
      </div>

      <NotificationCard
        show={showNotification}
        onClose={() => setShowNotification(false)}
        message={notificationMessage}
        type={notificationType}
      />
    </div>
  );
}
