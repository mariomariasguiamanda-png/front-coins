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

// 🔴 TROQUE AQUI PELO NOME DO BUCKET QUE VOCÊ TIVER NO SUPABASE
const PROFILE_BUCKET = "alunos-avatars";

export default function Perfil() {
  const router = useRouter();

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
  const [isEditing, setIsEditing] = useState(false);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  const [tempPhotoFile, setTempPhotoFile] = useState<File | null>(null);
  const [tempPhotoPreview, setTempPhotoPreview] = useState<string | null>(null);

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
      router.replace("/login");
    } catch (e) {
      console.error(e);
      showNotificationFn("Erro ao sair. Tente novamente.", "error");
    }
  }

  // ========= CARREGAR PERFIL =========
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Erro de auth:", authError);
          showNotificationFn(
            "Erro de autenticação. Faça login novamente.",
            "error"
          );
          router.replace("/login");
          return;
        }

        if (!user) {
          router.replace("/login");
          return;
        }

        // usuários
        const { data: usuario, error: usuarioError } = await supabase
          .from("usuarios")
          .select("id_usuario, nome, email, telefone, instituicao")
          .eq("auth_user_id", user.id)
          .single();

        if (usuarioError) {
          console.error("Erro buscando usuarios:", usuarioError);
          showNotificationFn(
            "Erro ao carregar seus dados. Tente novamente mais tarde.",
            "error"
          );
          return;
        }

        setIdUsuario(usuario.id_usuario);

        // alunos
        const { data: aluno, error: alunoError } = await supabase
          .from("alunos")
          .select("matricula, cpf, foto_url, id_turma")
          .eq("id_usuario", usuario.id_usuario)
          .maybeSingle();

        if (alunoError) {
          console.error("Erro buscando alunos:", alunoError);
          showNotificationFn(
            "Erro ao carregar seus dados acadêmicos.",
            "error"
          );
        }

        // turma
        let turmaNome = "";

        if (aluno?.id_turma) {
          const { data: turma, error: turmaError } = await supabase
            .from("turmas")
            .select("nome")
            .eq("id_turma", aluno.id_turma)
            .maybeSingle();

          if (turmaError) {
            console.error(
              "Erro buscando nome da turma (via alunos.id_turma):",
              turmaError
            );
          } else {
            turmaNome = turma?.nome ?? "";
          }
        } else {
          const { data: rel, error: relError } = await supabase
            .from("alunos_turmas")
            .select("id_turma")
            .eq("id_aluno", usuario.id_usuario)
            .maybeSingle();

          if (relError) {
            console.error(
              "Erro buscando relação aluno-turma em alunos_turmas:",
              relError
            );
          } else if (rel?.id_turma) {
            const { data: turma, error: turmaError } = await supabase
              .from("turmas")
              .select("nome")
              .eq("id_turma", rel.id_turma)
              .maybeSingle();

            if (turmaError) {
              console.error(
                "Erro buscando nome da turma (via alunos_turmas):",
                turmaError
              );
            } else {
              turmaNome = turma?.nome ?? "";
            }
          }
        }

        const loadedProfile: ProfileData = {
          nome: usuario.nome ?? "",
          email: usuario.email ?? "",
          telefone: usuario.telefone ?? "",
          instituicao: usuario.instituicao ?? "",
          matricula: aluno?.matricula ?? "",
          cpf: aluno?.cpf ?? "",
          turma: turmaNome,
          foto_url: aluno?.foto_url ?? null,
        };

        setProfile(loadedProfile);
        setOriginalProfile(loadedProfile);
      } catch (error: any) {
        console.error("Erro inesperado em loadProfile:", error);
        showNotificationFn(
          "Erro inesperado ao carregar dados do perfil.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  // ========= HANDLERS =========

  function handleChange(
    e: ChangeEvent<HTMLInputElement>,
    field: keyof ProfileData
  ) {
    const value = e.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveProfile() {
    if (!idUsuario) return;

    try {
      setSaving(true);

      // 🔒 Instituição NÃO é atualizada aqui – só admin muda em outra tela
      const { error: usuariosError } = await supabase
        .from("usuarios")
        .update({
          nome: profile.nome,
          telefone: profile.telefone,
        })
        .eq("id_usuario", idUsuario);

      if (usuariosError) throw usuariosError;

      const { error: alunosError } = await supabase
        .from("alunos")
        .update({
          matricula: profile.matricula,
          cpf: profile.cpf,
        })
        .eq("id_usuario", idUsuario);

      if (alunosError) throw alunosError;

      setOriginalProfile(profile);
      setIsEditing(false);
      showNotificationFn("Perfil atualizado com sucesso!", "success");
    } catch (error: any) {
      console.error(error);
      showNotificationFn("Erro ao salvar o perfil.", "error");
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

  // ========= FOTO =========

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setTempPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSavePhoto() {
    if (!tempPhotoFile || !idUsuario) return;

    try {
      setUploadingImage(true);

      const { data: aluno, error: alunoError } = await supabase
        .from("alunos")
        .select("id_usuario")
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

      // ⚠️ aqui usa o bucket configurado lá em cima
      const { error: uploadError } = await supabase.storage
        .from(PROFILE_BUCKET)
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("alunos")
        .update({ foto_url: publicUrl })
        .eq("id_usuario", idUsuario);

      if (updateError) throw updateError;

      setProfile((prev) => ({ ...prev, foto_url: publicUrl }));
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

  // ========= RENDER =========

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
              <h1 className="text-2xl font-bold text-slate-900">Meu Perfil</h1>
              <p className="text-sm text-muted-foreground">
                Veja e atualize seus dados pessoais.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10 rounded-2xl"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </header>

        {/* CONTEÚDO */}
        <main className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          {/* ESQUERDA: FOTO */}
          <section>
            <Card className="rounded-2xl">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-violet-500 bg-slate-100 flex items-center justify-center">
                    {tempPhotoPreview ? (
                      <img
                        src={tempPhotoPreview}
                        alt="Pré-visualização"
                        className="w-full h-full object-cover"
                      />
                    ) : profile.foto_url ? (
                      <img
                        src={profile.foto_url}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-violet-500" />
                    )}
                  </div>

                  <label
                    htmlFor="fotoPerfil"
                    className="absolute bottom-0 right-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-violet-500 text-white shadow-md cursor-pointer hover:bg-violet-600"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      id="fotoPerfil"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>

                <div className="text-center space-y-1">
                  <p className="font-semibold text-slate-900">
                    {profile.nome || "Aluno"}
                  </p>
                  {profile.turma && (
                    <p className="text-sm text-muted-foreground">
                      Turma: {profile.turma}
                    </p>
                  )}
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
                  {uploadingImage ? "Salvando foto..." : "Salvar foto de perfil"}
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* DIREITA: DADOS */}
          <section>
            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Dados
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Alguns dados são gerenciados pela instituição e não podem
                      ser alterados pelo aluno.
                    </p>
                  </div>

                  {!isEditing ? (
                    <Button
                      variant="outline"
                      className="rounded-2xl border-violet-500 text-violet-600 hover:bg-violet-50"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="rounded-2xl"
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                      <Button
                        className="rounded-2xl bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? (
                          "Salvando..."
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome completo</Label>
                    <Input
                      className="rounded-2xl"
                      value={profile.nome}
                      onChange={(e) => handleChange(e, "nome")}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label>E-mail</Label>
                    <Input
                      className="rounded-2xl bg-muted/60"
                      value={profile.email}
                      disabled
                    />
                  </div>

                  <div>
                    <Label>Celular</Label>
                    <Input
                      className="rounded-2xl"
                      value={profile.telefone}
                      onChange={(e) => handleChange(e, "telefone")}
                      disabled={!isEditing}
                    />
                  </div>

                  {/* 🔒 Instituição – somente leitura para o aluno */}
                  <div>
                    <Label>Instituição</Label>
                    <Input
                      className="rounded-2xl bg-muted/60"
                      value={profile.instituicao}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Esse dado é definido pela secretaria/administrador.
                    </p>
                  </div>

                  <div>
                    <Label>Matrícula</Label>
                    <Input
                      className="rounded-2xl bg-muted/60"
                      value={profile.matricula}
                      disabled
                    />
                  </div>

                  <div>
                    <Label>CPF</Label>
                    <Input
                      className="rounded-2xl bg-muted/60"
                      value={profile.cpf}
                      disabled
                    />
                  </div>

                  <div>
                    <Label>Turma</Label>
                    <Input
                      className="rounded-2xl bg-muted/60"
                      value={profile.turma}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      A turma é definida pela secretaria/administrador do
                      sistema.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
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
