import { useEffect, useState } from "react";
import { PerfilProfessor } from "@/components/professor/PerfilProfessor";
import { getProfessorLayout } from "@/components/professor/ProfessorLayout";
import type { NextPageWithLayout } from "@/pages/_app";
import { api, resolveMediaUrl } from "@/lib/api";

type ProfileData = {
  readonly: {
    nomeCompleto: string;
    disciplinas: string[];
    turmas: string[];
    emailInstitucional: string;
    cadastradoEm: string | null;
  };
  editable: {
    telefone: string;
    especialidade: string;
    foto: string | null;
  };
  stats: {
    totalAlunos: number;
  };
};

function PerfilPage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const carregar = async () => {
    try {
      const data = await api.get("/professor/perfil");
      setProfileData({
        readonly: {
          nomeCompleto: data.nome,
          disciplinas: data.disciplinas ?? [],
          turmas: data.turmas ?? [],
          emailInstitucional: data.email,
          cadastradoEm: data.criado_em,
        },
        editable: {
          telefone: data.telefone ?? "",
          especialidade: data.especialidade ?? "",
          foto: resolveMediaUrl(data.foto_url),
        },
        stats: {
          totalAlunos: data.total_alunos,
        },
      });
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleSave = async (dados: { telefone: string; especialidade: string }) => {
    await api.patch("/professor/perfil", dados);
    await carregar();
  };

  const handleUploadFoto = async (file: File) => {
    const formData = new FormData();
    formData.append("foto", file);
    await api.upload("/professor/perfil/foto", formData);
    await carregar();
  };

  const handleChangePassword = async (senhaAtual: string, senhaNova: string) => {
    await api.patch("/professor/perfil/senha", {
      senha_atual: senhaAtual,
      senha_nova: senhaNova,
    });
  };

  if (!profileData) {
    return <><div className="p-6 text-gray-500">Carregando perfil...</div></>;
  }

  return (
    <>
      <PerfilProfessor
        data={profileData}
        onSave={handleSave}
        onUploadFoto={handleUploadFoto}
        onChangePassword={handleChangePassword}
      />
    </>
  );
}

(PerfilPage as NextPageWithLayout).getLayout = getProfessorLayout;

export default PerfilPage;
