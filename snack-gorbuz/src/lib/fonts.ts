import localFont from "next/font/local";

/** Display condensée pour les titres : Anton (poids unique 400, usage en display). */
export const anton = localFont({
  src: [{ path: "../fonts/anton-latin-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--font-anton",
  display: "swap",
  fallback: ["Impact", "Haettenschweiler", "Arial Narrow", "sans-serif"],
  adjustFontFallback: "Arial",
});

/** Sans-serif très lisible pour le texte : Manrope variable (200 à 800). */
export const manrope = localFont({
  src: [{ path: "../fonts/manrope-latin-wght-normal.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});
