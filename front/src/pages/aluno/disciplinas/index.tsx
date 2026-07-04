"use client";

import { getAlunoLayout } from "@/components/layout/AlunoLayout";
import Disciplinas from "@/modules/aluno/Disciplinas";
import type { NextPageWithLayout } from "@/pages/_app";

const DisciplinasPage: NextPageWithLayout = () => <Disciplinas />;
DisciplinasPage.getLayout = getAlunoLayout;

export default DisciplinasPage;
