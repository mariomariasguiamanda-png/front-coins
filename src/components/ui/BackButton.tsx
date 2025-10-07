import { useState } from "react";
import { useRouter } from "next/router";

interface BackButtonProps {
  color?: string;
  className?: string;
  delay?: number;
  targetRoute?: string; // Nova prop para definir rota específica
}

export const BackButton: React.FC<BackButtonProps> = ({
  color = "#6366f1",
  className = "",
  delay = 250,
  targetRoute,
}) => {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);

    setTimeout(() => {
      if (targetRoute) {
        // Se uma rota específica foi fornecida, navegar para ela
        router.push(targetRoute, undefined, { scroll: false });
      } else if (router.query.id && typeof router.query.id === "string") {
        // Se estamos em uma página de disciplina, voltar para a disciplina base
        router.push(`/disciplinas/${router.query.id}`, undefined, {
          scroll: false,
        });
      } else {
        // Fallback para router.back() em outros casos
        router.back();
      }
    }, delay);
  };

  return (
    <button
      onClick={handleBack}
      disabled={isExiting}
      className={`
        flex items-center justify-center p-3 rounded-lg bg-white 
        border border-gray-200 hover:bg-gray-50 
        shadow-sm hover:shadow-md disabled:opacity-50 
        disabled:cursor-not-allowed smooth-button
        ${isExiting ? "opacity-75 scale-95" : "opacity-100 scale-100"}
        ${className}
      `}
    >
      {isExiting ? (
        // Loading spinner durante a saída
        <div
          className="w-5 h-5 border-2 border-gray-300 border-t-current rounded-full animate-spin"
          style={{ borderTopColor: color }}
        />
      ) : (
        // Ícone normal de voltar
        <svg
          className="w-5 h-5 transition-transform duration-200"
          fill="none"
          stroke={color}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      )}
    </button>
  );
};
