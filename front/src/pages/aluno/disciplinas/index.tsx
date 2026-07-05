"use client";

import { getAlunoLayout } from "@/components/aluno/AlunoLayout";
import Disciplinas from "@/components/aluno/Disciplinas";
import type { NextPageWithLayout } from "@/pages/_app";

const DisciplinasPage: NextPageWithLayout = () => <Disciplinas />;
DisciplinasPage.getLayout = getAlunoLayout;

export default DisciplinasPage;
