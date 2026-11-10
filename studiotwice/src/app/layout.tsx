import type { Metadata, Viewport } from "next";
import { archivo, onest } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Grain from "@/components/Grain";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import "./globals.css";

// TODO: remplacer par le domaine définitif dès qu'il est connu.
const SITE_URL = "https://studiotwice.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "StudioTwice, sites web pour commerces locaux en Belgique francophone",
  description:
    "Nous construisons le site de votre commerce, du croquis à la mise en ligne. Restaurants, garages, salons, artisans. Site une page à partir de 890 € HTVA.",
  openGraph: {
    type: "website",
    locale: "fr_BE",
    siteName: "StudioTwice",
    title: "StudioTwice, sites web pour commerces locaux",
    description:
      "Le site de votre commerce, du croquis à la mise en ligne. À partir de 890 € HTVA.",
  },
};

export const viewport: Viewport = {
  themeColor: "#15120F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr-BE" className={`${archivo.variable} ${onest.variable}`}>
      <body>
        <SmoothScroll />
        {children}
        <Nav />
        <Grain />
        <Cursor />
      </body>
    </html>
  );
}
