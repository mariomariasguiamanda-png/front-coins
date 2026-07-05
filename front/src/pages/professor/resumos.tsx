import { useEffect, useState } from "react";
import { getProfessorLayout } from "@/components/professor/ProfessorLayout";
import type { NextPageWithLayout } from "@/pages/_app";
import { ResumosProfessor } from "@/components/professor/ResumosProfessor";
import { api, resolveMediaUrl } from "@/lib/api";

type Summary = {
  id: string;
  title: string;
  content: string;
  attachments: string[];
  links: string[];
  discipline: string;
  id_disciplina: string;
  createdAt: string;
  views: number;
};

type DisciplinaOption = { id: string; nome: string };

function ResumosPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [disciplinas, setDisciplinas] = useState<DisciplinaOption[]>([]);

  const carregarResumos = async () => {
    try {
      const data = await api.get("/professor/resumos");
      setSummaries(
        (data ?? []).map((r: any) => ({
          id: String(r.id_resumo),
          title: r.titulo,
          content: r.conteudo ?? "",
          attachments: r.anexos_urls ?? [],
          links: r.links ?? [],
          discipline: r.disciplinas?.nome ?? "",
          id_disciplina: String(r.id_disciplina),
          createdAt: r.data_criacao,
          views: r.views,
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar resumos:", err);
    }
  };

  useEffect(() => {
    carregarResumos();
    async function carregarDisciplinas() {
      try {
        const data = await api.get("/professor/disciplinas");
        setDisciplinas((data ?? []).map((d: any) => ({ id: String(d.id_disciplina), nome: d.nome })));
      } catch (err) {
        console.error("Erro ao carregar disciplinas:", err);
      }
    }
    carregarDisciplinas();
  }, []);

  const handleCreateSummary = async (dados: {
    titulo: string;
    conteudo: string;
    id_disciplina: string;
    links: string[];
  }) => {
    await api.post("/professor/resumos", dados);
    await carregarResumos();
  };

  const handleEditSummary = async (
    id: string,
    dados: { titulo: string; conteudo: string; links: string[] }
  ) => {
    await api.patch(`/professor/resumos/${id}`, dados);
    await carregarResumos();
  };

  const handleDeleteSummary = async (id: string) => {
    await api.delete(`/professor/resumos/${id}`);
    await carregarResumos();
  };

  const handleUploadAnexos = async (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("anexos", file));
    await api.upload(`/professor/resumos/${id}/anexos`, formData);
    await carregarResumos();
  };

  const handleRemoveAnexo = async (id: string, caminho: string) => {
    await api.delete(`/professor/resumos/${id}/anexos`, {
      body: JSON.stringify({ caminho }),
    });
    await carregarResumos();
  };

  return (
    <>
      <ResumosProfessor
        summaries={summaries}
        disciplinas={disciplinas}
        onCreateSummary={handleCreateSummary}
        onEditSummary={handleEditSummary}
        onDeleteSummary={handleDeleteSummary}
        onUploadAnexos={handleUploadAnexos}
        onRemoveAnexo={handleRemoveAnexo}
        resolveUrl={(path) => resolveMediaUrl(path) ?? path}
      />
    </>
  );
}

(ResumosPage as NextPageWithLayout).getLayout = getProfessorLayout;

export default ResumosPage;
