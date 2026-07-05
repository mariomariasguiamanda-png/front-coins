"use client";

import { getAlunoLayout } from "@/components/aluno/AlunoLayout";
import Frequencia from "@/components/aluno/AgendaEstudos";
import type { NextPageWithLayout } from "@/pages/_app";

const CalendarioPage: NextPageWithLayout = () => <Frequencia />;
CalendarioPage.getLayout = getAlunoLayout;

export default CalendarioPage;
