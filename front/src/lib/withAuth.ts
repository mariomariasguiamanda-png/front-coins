import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { LOGIN_ROUTE } from "./config";

// Front-only placeholder: verifica cookie de sessão enviado pelo backend (quando disponível)
export function withAuth<P extends Record<string, any>>(
  gssp: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const { req } = ctx;
    const cookies = req.headers.cookie || "";

    // Regra simples: considera autenticado se existir QUALQUER cookie de sessão do backend
    // Ajuste aqui quando souber o nome exato do cookie/token
    const isAuthenticated = /session|token|auth/gi.test(cookies);

    if (!isAuthenticated) {
      return {
        redirect: {
          destination: `${LOGIN_ROUTE}?from=${encodeURIComponent(
            ctx.resolvedUrl || "/"
          )}`,
          permanent: false,
        },
      };
    }

    return gssp(ctx);
  };
}
