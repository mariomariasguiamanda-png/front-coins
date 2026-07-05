import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/adm/AdminLayout";
import { PerfilAdmin, type AdminProfileData } from "@/components/adm/PerfilAdmin";
import { api, resolveMediaUrl } from "@/lib/api";

export default function PerfilAdministradorPage() {
  const [profileData, setProfileData] = useState<AdminProfileData | null>(null);

  const carregar = async () => {
    try {
      const data = await api.get("/adm/perfil");
      setProfileData({
        readonly: {
          nomeCompleto: data.nome,
          emailInstitucional: data.email,
          cadastradoEm: data.criado_em,
        },
        editable: {
          telefone: data.telefone ?? "",
          foto: resolveMediaUrl(data.foto_url),
        },
        stats: {
          totalAlunos: data.total_alunos,
          totalProfessores: data.total_professores,
          totalTurmas: data.total_turmas,
        },
      });
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleSave = async (dados: { nome: string; telefone: string }) => {
    await api.patch("/adm/perfil", dados);
    await carregar();
  };

  const handleUploadFoto = async (file: File) => {
    const formData = new FormData();
    formData.append("foto", file);
    await api.upload("/adm/perfil/foto", formData);
    await carregar();
  };

  const handleChangePassword = async (senhaAtual: string, senhaNova: string) => {
    await api.patch("/adm/perfil/senha", {
      senha_atual: senhaAtual,
      senha_nova: senhaNova,
    });
  };

  if (!profileData) {
    return (
      <AdminLayout>
        <div className="p-6 text-gray-500">Carregando perfil...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <PerfilAdmin
          data={profileData}
          onSave={handleSave}
          onUploadFoto={handleUploadFoto}
          onChangePassword={handleChangePassword}
        />
      </div>
    </AdminLayout>
  );
}
