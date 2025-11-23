"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import NotificationCard from "@/components/ui/NotificationCard";
import { User, Camera, Edit, Save, X, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

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

  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(
    null
  );

  const [idUsuario, setIdUsuario] = useState<number | null>(null);
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
  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    } finally {
      // replace: não deixa o usuário voltar para a página anterior logada
      router.replace("/login");
    }
  }

  // ========= CARREGAR PERFIL DO SUPABASE =========
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);

        // 1) Usuário autenticado (Supabase Auth)
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) {
          // se não tiver usuário, manda direto pro login
          router.replace("/login");
          return;
        }

        // 2) Buscar dados básicos na tabela "usuarios"
        const { data: usuario, error: usuarioError } = await supabase
          .from("usuarios")
          .select("id_usuario, nome, email, telefone, instituicao")
          .eq("auth_user_id", user.id)
          .single();

        if (usuarioError) throw usuarioError;

        setIdUsuario(usuario.id_usuario);

        // 3) Buscar dados acadêmicos na tabela "alunos"
        const { data: aluno, error: alunoError } = await supabase
          .from("alunos")
          .select("matricula, cpf, turma, foto_url")
          .eq("id_usuario", usuario.id_usuario)
          .maybeSingle();

        if (alunoError) throw alunoError;

        const loadedProfile: ProfileData = {
          nome: usuario.nome ?? "",
          email: usuario.email ?? "",
          telefone: usuario.telefone ?? "",
          instituicao: usuario.instituicao ?? "",
          matricula: aluno?.matricula ?? "",
          cpf: aluno?.cpf ?? "",
          turma: aluno?.turma ?? "",
          foto_url: aluno?.foto_url ?? null,
        };

        setProfile(loadedProfile);
        setOriginalProfile(loadedProfile);
      } catch (error: any) {
        console.error(error);
        // se deu erro de auth, garante redirecionamento
        showNotificationFn(
          "Erro ao carregar dados do perfil. Faça login novamente.",
          "error"
        );
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
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
    if (!idUsuario) return;
    try {
      setSaving(true);

      // Atualiza apenas campos que o aluno PODE editar: nome e telefone
      const { error: usuariosError } = await supabase
        .from("usuarios")
        .update({
          nome: profile.nome,
          telefone: profile.telefone,
          // instituicao: não atualiza aqui, é só o admin
        })
        .eq("id_usuario", idUsuario);

      if (usuariosError) throw usuariosError;

      // Atualiza cópia original (para Cancelar ficar coerente)
      setOriginalProfile(profile);
      setIsEditing(false);

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

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setTempPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setTempPhotoPreview(previewUrl);
  }

  // ========= FOTO: SALVAR =========

  async function handleSavePhoto() {
    if (!tempPhotoFile || !idUsuario) return;

    try {
      setUploadingImage(true);

      // verifica se já existe registro na tabela "alunos"
      const { data: aluno, error: alunoError } = await supabase
        .from("alunos")
        .select("id_aluno")
        .eq("id_usuario", idUsuario)
        .maybeSingle();

      if (alunoError) throw alunoError;

      if (!aluno) {
        showNotificationFn(
          "Seus dados acadêmicos ainda não foram cadastrados. Peça ao administrador para registrar você antes de salvar a foto.",
          "error"
        );
        return;
      }

      const file = tempPhotoFile;
      const fileExt = file.name.split(".").pop();
      const filePath = `aluno-${idUsuario}-${Date.now()}.${fileExt}`;

      // 1) Upload da imagem no bucket
      const { error: uploadError } = await supabase.storage
        .from("alunos-avatars")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 2) Pega URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from("alunos-avatars").getPublicUrl(filePath);

      // 3) Atualiza APENAS foto_url no registro existente de "alunos"
      const { error: alunosError } = await supabase
        .from("alunos")
        .update({ foto_url: publicUrl })
        .eq("id_usuario", idUsuario);

      if (alunosError) throw alunosError;

      // 4) Atualiza estado local
      setProfile((prev) => ({ ...prev, foto_url: publicUrl }));
      if (originalProfile) {
        setOriginalProfile((prev) =>
          prev ? { ...prev, foto_url: publicUrl } : prev
        );
      }

      // limpa temporários
      setTempPhotoFile(null);
      setTempPhotoPreview(null);

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
                      src={profile.foto_url}
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
