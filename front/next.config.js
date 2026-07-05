/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita que o Next precise processar o barrel file inteiro de lucide-react/
  // react-icons a cada rota compilada em dev - com dezenas de páginas
  // importando ícones, isso reduz bastante o tempo de compilação/HMR sentido
  // como "trava" ao navegar pela primeira vez para uma rota em modo dev.
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.rocketseat.com.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
