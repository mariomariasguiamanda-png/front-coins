"use client";

import { getAlunoLayout } from "@/components/layout/AlunoLayout";
import Frequencia from "@/modules/aluno/AgendaEstudos";
import type { NextPageWithLayout } from "@/pages/_app";

const CalendarioPage: NextPageWithLayout = () => <Frequencia />;
CalendarioPage.getLayout = getAlunoLayout;

export default CalendarioPage;
