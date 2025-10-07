export const cores = {
  matematica: {
    grad: "from-blue-500 to-blue-600",
    text: "text-blue-600",
    bar: "bg-blue-500",
  },
  historia: {
    grad: "from-amber-500 to-amber-600",
    text: "text-amber-600",
    bar: "bg-amber-500",
  },
  biologia: {
    grad: "from-green-500 to-green-600",
    text: "text-green-600",
    bar: "bg-green-500",
  },
  fisica: {
    grad: "from-purple-500 to-purple-600",
    text: "text-purple-600",
    bar: "bg-purple-500",
  },
  geografia: {
    grad: "from-teal-500 to-teal-600",
    text: "text-teal-600",
    bar: "bg-teal-500",
  },
  artes: {
    grad: "from-pink-500 to-pink-600",
    text: "text-pink-600",
    bar: "bg-pink-500",
  },
  roxo: {
    grad: "from-violet-500 to-violet-600",
    text: "text-violet-600",
    bar: "bg-violet-500",
  },
} as const;

export type TemaKey = keyof typeof cores;

export function temaPorId(id: string): TemaKey {
  const s = id.toLowerCase();
  if (s === "mat") return "matematica";
  if (s === "hist") return "historia";
  if (s === "geo") return "geografia";
  if (s === "bio") return "biologia";
  if (s === "fis") return "fisica";
  if (s === "art") return "artes";
  return "roxo";
}

export function temaPorNome(nome: string | undefined): TemaKey {
  if (!nome) return "roxo";
  const n = nome.toLowerCase();
  if (n.includes("matem")) return "matematica";
  if (n.includes("hist")) return "historia";
  if (n.includes("geog")) return "geografia";
  if (n.includes("bio")) return "biologia";
  if (n.includes("fís") || n.includes("fis")) return "fisica";
  if (n.includes("arte")) return "artes";
  return "roxo";
}

export function resolverTema({
  id,
  nome,
  queryTema,
}: {
  id?: string;
  nome?: string;
  queryTema?: string | string[];
}) {
  const qt = Array.isArray(queryTema) ? queryTema[0] : queryTema;
  const key = (qt as TemaKey) || (id ? temaPorId(id) : temaPorNome(nome));
  return cores[key] || cores.roxo;
}
