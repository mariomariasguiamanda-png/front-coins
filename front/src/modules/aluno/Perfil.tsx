"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import NotificationCard from "@/components/ui/NotificationCard";
import { User, Camera, Edit, Save, X, LogOut } from "lucide-react";
import { api, resolveMediaUrl } from "@/lib/api";
import { useAuth } from "@/services/auth/AuthContext";

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
}

export default function Perfil() {
  const router = useRouter();
  const { signOut, refresh } = useAuth();

  // ========= ESTADOS PRINCIPAIS =========
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    nome: "",
    email: "",
    telefone: "",
    instituicao: "",
    matricula: "",
    cpf: "",
    turma: "",
    foto_url: null,
  });

  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  // foto temporária (preview)
  const [tempPhotoFile, setTempPhotoFile] = useState<File | null>(null);
  const [tempPhotoPreview, setTempPhotoPreview] = useState<string | null>(null);

  // ========= NOTIFICAÇÕES =========
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] =
    useState<NotificationType>("info");

  function showNotificationFn(message: string, type: NotificationType) {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  }

  // ========= LOGOUT =========
  function handleLogout() {
    signOut();
  }

  // ========= CARREGAR PERFIL (a API resolve o aluno logado a partir do JWT) =========
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

  // ========= HANDLERS =========

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ProfileData
  ) {
    const value = e.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveProfile() {
    const nomeAparado = profile.nome.trim();
    if (!nomeAparado) {
      showNotificationFn("O nome não pode ficar em branco.", "error");
      return;
    }

    try {
      setSaving(true);

      // Atualiza apenas campos que o aluno PODE editar: nome e telefone
      await api.patch("/aluno/perfil", {
        nome: nomeAparado,
        telefone: profile.telefone,
      });

      setProfile((prev) => ({ ...prev, nome: nomeAparado }));
      setOriginalProfile({ ...profile, nome: nomeAparado });
      setIsEditing(false);

      // Atualiza nome exibido no header (AuthContext) sem precisar recarregar a página
      refresh();

      showNotificationFn("Dados atualizados com sucesso!", "success");
    } catch (error: any) {
      console.error(error);
      showNotificationFn("Erro ao salvar alterações.", "error");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setIsEditing(false);
  }

  // ========= FOTO: SELEÇÃO (preview) =========

  const TAMANHO_MAX_FOTO = 5 * 1024 * 1024; // 5MB

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotificationFn("Selecione um arquivo de imagem válido.", "error");
      e.target.value = "";
      return;
    }

    if (file.size > TAMANHO_MAX_FOTO) {
      showNotificationFn("A foto deve ter no máximo 5MB.", "error");
      e.target.value = "";
      return;
    }

    setTempPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setTempPhotoPreview(previewUrl);
  }

  // ========= FOTO: SALVAR =========

  async function handleSavePhoto() {
    if (!tempPhotoFile) return;

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("foto", tempPhotoFile);

      const data = await api.upload("/aluno/perfil/foto", formData);
      const fotoUrl = data.foto_url as string;

      setProfile((prev) => ({ ...prev, foto_url: fotoUrl }));
      if (originalProfile) {
        setOriginalProfile((prev) =>
          prev ? { ...prev, foto_url: fotoUrl } : prev
        );
      }

      setTempPhotoFile(null);
      setTempPhotoPreview(null);

      // Atualiza foto exibida no header (AuthContext) sem precisar recarregar a página
      refresh();

      showNotificationFn("Foto atualizada com sucesso!", "success");
    } catch (error: any) {
      console.error(error);
      showNotificationFn("Erro ao salvar a foto.", "error");
    } finally {
      setUploadingImage(false);
    }
  }

  // ========= UI =========

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen bg-violet-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600">
                Veja e atualize seus dados pessoais.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="rounded-2xl flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD AVATAR */}
          <aside className="md:col-span-1">
            <Card className="rounded-2xl">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="relative">
                  {tempPhotoPreview ? (
                    <img
                      src={tempPhotoPreview}
                      alt="Pré-visualização da foto"
                      className="w-32 h-32 rounded-full object-cover border-4 border-violet-200 shadow-md"
                    />
                  ) : profile.foto_url ? (
                    <img
                      src={resolveMediaUrl(profile.foto_url) ?? undefined}
                      alt="Foto do aluno"
                      className="w-32 h-32 rounded-full object-cover border-4 border-violet-200 shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-violet-500 flex items-center justify-center border-4 border-violet-200 shadow-md">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}

                  <label
                    htmlFor="avatar-upload"
                    aria-label="Alterar foto de perfil"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-violet-50 hover:border-violet-400 border border-transparent transition"
                  >
                    <Camera className="w-4 h-4 text-violet-600" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                  />
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  {uploadingImage
                    ? "Salvando foto..."
                    : tempPhotoFile
                    ? "Veja a pré-visualização e clique em Salvar foto."
                    : "Clique no ícone de câmera para selecionar uma foto."}
                </p>

                <Button
                  className="mt-2 rounded-2xl w-full"
                  disabled={!tempPhotoFile || uploadingImage}
                  onClick={handleSavePhoto}
                >
                  {uploadingImage
                    ? "Salvando foto..."
                    : tempPhotoFile
                    ? "Salvar foto"
                    : "Escolha uma foto para salvar"}
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* CARD ÚNICO: DADOS */}
          <section className="md:col-span-2">
            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Dados
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Alguns dados são gerenciados pela instituição e não podem
                      ser alterados pelo aluno.
                    </p>
                  </div>

                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-2xl flex items-center gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl flex items-center gap-2"
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-2xl flex items-center gap-2"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Nome (editável) */}
                  <div>
                    <Label>Nome completo</Label>
                    <Input
                      className="rounded-2xl"
                      value={profile.nome}
                      onChange={(e) => handleChange(e, "nome")}
                      disabled={!isEditing}
                    />
                  </div>

                  {/* E-mail (sempre READONLY) */}
                  <div>
                    <Label>E-mail</Label>
                    <Input
                      className="rounded-2xl bg-muted/60"
                      value={profile.email}
                      disabled
                    />
                  </div>

                  {/* Celular (editável) */}
                  <div>
                    <Label>Celular</Label>
                    <Input
                      className="rounded-2xl"
                      placeholder="+55 49 90000-0000"
                      value={profile.telefone}
                      onChange={(e) => handleChange(e, "telefone")}
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Instituição (sempre somente leitura → admin-only) */}
                  <div>
                    <Label>Instituição</Label>
                    <Input
                      className="rounded-2xl bg-muted/60"
                      value={profile.instituicao}
                      disabled
                    />
                  </div>

                  {/* Matrícula (somente leitura) */}
                  <div>
                    <Label>Matrícula</Label>
                    <Input
                      className="rounded-2xl bg-muted/60"
                      value={profile.matricula}
                      disabled
                    />
                  </div>

                  {/* CPF (somente leitura) */}
                  <div>
                    <Label>CPF</Label>
                    <Input
                      className="rounded-2xl bg-muted/60"
                      value={profile.cpf}
                      disabled
                    />
                  </div>

                  {/* Turma (somente leitura) */}
                  <div>
                    <Label>Turma</Label>
                    <Input
                      className="rounded-2xl bg-muted/60"
                      value={profile.turma}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>

      {/* NOTIFICAÇÕES */}
      <NotificationCard
        show={showNotification}
        onClose={() => setShowNotification(false)}
        message={notificationMessage}
        type={notificationType}
      />
    </div>
  );
}
