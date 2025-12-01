"use client";

import React, { useEffect, useState } from "react";
import { PerfilProfessor } from "@/components/professor/PerfilProfessor";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";
import { supabase } from "@/lib/supabaseClient";

type PerfilProfessorReadonly = {
  nomeCompleto: string;
  matricula: string;
  cpf: string;
  disciplinas: string[];
  turmas: string[];
  emailInstitucional: string;
  dataAdmissao: string;
  departamento: string;
};

type PerfilProfessorEditable = {
  emailAlternativo: string;
  telefone: string;
  senha: string;
  foto: string;
  endereco: string;
  biografia: string;
};

type PerfilProfessorStats = {
  totalAulas: number;
  totalAlunos: number;
  mediaAvaliacoes: number;
};

export type PerfilProfessorData = {
  readonly: PerfilProfessorReadonly;
  editable: PerfilProfessorEditable;
  stats: PerfilProfessorStats;
};

export default function PerfilPage() {
  const [profileData, setProfileData] = useState<PerfilProfessorData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  useEffect(() => {
    carregarPerfilProfessor();
  }, []);

  async function carregarPerfilProfessor() {
    setLoading(true);
    setError(null);

    try {
      // 1) Garantir sessão ativa
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error(sessionError);
        setError("Erro ao carregar sessão.");
        setLoading(false);
        return;
      }

      if (!session) {
        setError("Nenhum usuário autenticado.");
        setLoading(false);
        return;
      }

      const user = session.user;
      setAuthUserId(user.id);

      // Foto salva no user_metadata (se já existir)
      const fotoMetadata =
        (user.user_metadata as any)?.foto_url || "/placeholder-avatar.png";

      // 2) Buscar perfil no banco
      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select(
          `
          id_usuario,
          nome,
          email,
          telefone,
          instituicao,
          tipo_usuario
        `
        )
        .eq("auth_user_id", user.id)
        .single();

      if (usuarioError || !usuario) {
        console.error(usuarioError);
        setError("Não foi possível carregar os dados do seu perfil.");
        setLoading(false);
        return;
      }

      // 3) Montar objeto final no formato esperado pelo PerfilProfessor
      const data: PerfilProfessorData = {
        readonly: {
          nomeCompleto: usuario.nome,
          matricula: "",
          cpf: "",
          disciplinas: [],
          turmas: [],
          emailInstitucional: usuario.email,
          dataAdmissao: "",
          departamento: usuario.instituicao ?? "",
        },
        editable: {
          emailAlternativo: usuario.email,
          telefone: usuario.telefone ?? "",
          senha: "",
          foto: fotoMetadata, // vem do user_metadata ou placeholder
          endereco: "",
          biografia: "",
        },
        stats: {
          totalAulas: 0,
          totalAlunos: 0,
          mediaAvaliacoes: 0,
        },
      };

      setProfileData(data);
    } catch (e) {
      console.error(e);
      setError("Erro inesperado ao carregar perfil.");
    } finally {
      setLoading(false);
    }
  }

  // 4) Handler para upload de foto
  async function handleFotoChange(file: File) {
    try {
      if (!authUserId) {
        setError("Usuário não autenticado para enviar foto.");
        return;
      }

      setUploadingFoto(true);
      setError(null);

      const fileExt = file.name.split(".").pop() || "jpg";
      const filePath = `professor-${authUserId}-${Date.now()}.${fileExt}`;

      // Upload no Storage
      const { error: uploadError } = await supabase.storage
        .from("fotos-perfil")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error(uploadError);
        setError("Erro ao enviar foto de perfil.");
        setUploadingFoto(false);
        return;
      }

      // URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from("fotos-perfil").getPublicUrl(filePath);

      // Atualiza user_metadata do Auth com a nova URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { foto_url: publicUrl },
      });

      if (updateError) {
        console.error(updateError);
        setError("Erro ao salvar foto de perfil.");
        setUploadingFoto(false);
        return;
      }

      // Atualiza estado local para refletir na tela
      setProfileData((old) =>
        old
          ? {
              ...old,
              editable: {
                ...old.editable,
                foto: publicUrl,
              },
            }
          : old
      );
    } catch (e) {
      console.error(e);
      setError("Erro inesperado ao enviar foto.");
    } finally {
      setUploadingFoto(false);
    }
  }

  if (loading) {
    return (
      <ProfessorLayout>
        <div className="p-6">Carregando dados do seu perfil...</div>
      </ProfessorLayout>
    );
  }

  if (error) {
    return (
      <ProfessorLayout>
        <div className="p-6 text-sm text-red-500">{error}</div>
      </ProfessorLayout>
    );
  }

  if (!profileData) {
    return (
      <ProfessorLayout>
        <div className="p-6 text-sm">Não foi possível carregar o perfil.</div>
      </ProfessorLayout>
    );
  }

  return (
    <ProfessorLayout>
      <PerfilProfessor
        data={profileData}
        onChangeFoto={handleFotoChange}
        uploadingFoto={uploadingFoto}
      />
    </ProfessorLayout>
  );
}
