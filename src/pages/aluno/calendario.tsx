"use client";

import AlunoLayout from "@/components/layout/AlunoLayout";
import Frequencia from "@/modules/aluno/AgendaEstudos";

export default function CalendarioPage() {
  return (
    <AlunoLayout>
      <Frequencia />
    </AlunoLayout>
  );
}
