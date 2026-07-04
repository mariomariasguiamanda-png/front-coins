import { PerfilProfessor } from "@/components/professor/PerfilProfessor";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";

export default function PerfilPage() {
  // Mock data - replace with API calls later
  const profileData = {
    readonly: {
      nomeCompleto: "Ana Silva Santos",
      matricula: "PROF2024001",
      cpf: "123.456.789-00",
      disciplinas: ["Matemática", "Física", "Química"],
      turmas: ["1º A", "1º B", "2º A", "2º B", "3º C"],
      emailInstitucional: "ana.silva@escola.edu.br",
      dataAdmissao: "2020-02-15",
      departamento: "Ciências Exatas",
    },
    editable: {
      emailAlternativo: "ana.silva@gmail.com",
      telefone: "(11) 98765-4321",
      senha: "",
      foto: "/placeholder-avatar.png",
      endereco: "Rua das Flores, 123 - Centro, São Paulo - SP",
      biografia: "Professora de Matemática, Física e Química com 15 anos de experiência. Apaixonada por ensinar e ajudar os alunos a descobrirem o fascínio das ciências exatas.",
    },
    stats: {
      totalAulas: 245,
      totalAlunos: 156,
      mediaAvaliacoes: 4.8,
    },
  };

  return (
    <ProfessorLayout>
      <PerfilProfessor data={profileData} />
    </ProfessorLayout>
  );
}