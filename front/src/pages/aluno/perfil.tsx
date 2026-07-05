"use client";

import { getAlunoLayout } from "@/components/aluno/AlunoLayout";
import Perfil from "@/components/aluno/Perfil";
import type { NextPageWithLayout } from "@/pages/_app";

const PerfilPage: NextPageWithLayout = () => <Perfil />;
PerfilPage.getLayout = getAlunoLayout;

export default PerfilPage;
