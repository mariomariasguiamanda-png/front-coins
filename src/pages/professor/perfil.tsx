import { PerfilProfessor } from "@/components/professor/PerfilProfessor";
import { ProfessorLayout } from "@/components/professor/ProfessorLayout";

export default function PerfilPage() {
  // Mock data - replace with API calls later
  const profileData = {
    readonly: {
      nomeCompleto: "Ana Silva Santos",
      matricula: "2023001",
      cpf: "123.456.789-00",
      disciplinas: ["Matemática", "Física", "Química"],
      turmas: ["1º A", "2º B", "3º C"],
      emailInstitucional: "ana.silva@escola.edu.br",
    },
    editable: {
      emailAlternativo: "ana.silva@gmail.com",
      telefone: "(11) 98765-4321",
      senha: "",
      foto: "/placeholder-avatar.png",
    },
  };

  return (
    <ProfessorLayout>
      <PerfilProfessor data={profileData} />
    </ProfessorLayout>
  );
}