import { useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";

interface DisciplinaBackButtonProps {
  disciplinaInfo: {
    nome: string;
    cor: string;
  };
  className?: string;
}

export const DisciplinaBackButton: React.FC<DisciplinaBackButtonProps> = ({
  disciplinaInfo,
  className = "",
}) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleBack = () => {
    setIsNavigating(true);

    // Animação de saída suave
    setTimeout(() => {
      if (router.query.id && typeof router.query.id === "string") {
        // Determinar se estamos no contexto aluno ou disciplinas
        const currentPath = router.asPath;
        const isHomepageAluno = currentPath.includes("/aluno/");

        if (isHomepageAluno) {
          // Se estamos em aluno, voltar para aluno/[materia]
          router.push(`/aluno/${router.query.id}`, undefined, {
            scroll: false,
          });
        } else {
          // Se estamos em disciplinas, voltar para aluno/[materia]
          router.push(`/aluno/${router.query.id}`, undefined, {
            scroll: false,
          });
        }
      } else {
        router.back();
      }
    }, 250);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleBack}
        disabled={isNavigating}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl bg-white 
          border border-gray-200 hover:bg-gray-50 
          shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
          nav-button ${isNavigating ? "exiting" : ""}
          ${className}
        `}
      >
        {isNavigating ? (
          <div
            className="w-4 h-4 border-2 border-gray-300 border-t-current rounded-full animate-spin"
            style={{ borderTopColor: disciplinaInfo.cor }}
          />
        ) : (
          <ArrowLeft
            className="w-4 h-4"
            style={{ color: disciplinaInfo.cor }}
          />
        )}
        <span
          className="text-sm font-medium"
          style={{ color: disciplinaInfo.cor }}
        >
          {isNavigating ? "Voltando..." : "Voltar"}
        </span>
      </button>

      <div className="text-sm text-gray-600">
        <span className="font-medium" style={{ color: disciplinaInfo.cor }}>
          {disciplinaInfo.nome}
        </span>
      </div>
    </div>
  );
};
