/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["image.mux.com","**","img.clerk.com"],
    },
    async headers() {
      return [
        {
          // Configuração para todas as rotas
          source: "/api/:path*",
          headers: [
            {
              key: "Access-Control-Allow-Credentials",
              value: "true",
            },
            {
              key: "Access-Control-Allow-Origin",
              value: "*", // Permite qualquer origem
            }
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  