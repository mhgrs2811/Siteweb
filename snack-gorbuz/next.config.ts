import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Les médias du site sont servis en local depuis /public/media.
  // Aucune image externe n'est autorisée tant que les vrais visuels ne sont pas fournis.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // three / drei sont des ESM lourds : on laisse Next les transpiler côté client uniquement.
  transpilePackages: ["three"],
};

export default nextConfig;
