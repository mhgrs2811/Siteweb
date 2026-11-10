import type { NextConfig } from "next";

/**
 * Mode normal : site complet, déployé sur Vercel.
 * STATIC_EXPORT=1 : export statique pour un aperçu partagé (sans formulaire).
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  agentRules: false,
  ...(staticExport
    ? {
        output: "export",
        distDir: ".next-export",
        assetPrefix: "./",
        trailingSlash: false,
        images: { unoptimized: true },
      }
    : {
        cacheComponents: true,
        partialPrefetching: true,
      }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
