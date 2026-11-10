import localFont from "next/font/local";

/** Archivo variable (chasse 62 à 125 %, graisse 100 à 900) : titrage, en version étendue. */
export const archivo = localFont({
  src: "../fonts/archivo-latin.woff2",
  variable: "--font-archivo",
  display: "swap",
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  preload: true,
});

/** Onest variable : texte courant, sobre et très lisible. */
export const onest = localFont({
  src: "../fonts/onest-latin.woff2",
  variable: "--font-onest",
  display: "swap",
  weight: "100 900",
  preload: true,
});
