import type { Metadata, Viewport } from "next";
import { archivo, onest } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import Grain from "@/components/Grain";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import { site } from "@/content/site";
import { pricing } from "@/content/pricing";
import "./globals.css";

const price = pricing.showPrices ? ` Site une page à partir de ${pricing.sites[0].from} € HTVA.` : "";
const description = `Nous construisons le site de votre commerce, du croquis à la mise en ligne. Restaurants, garages, salons, artisans, en Belgique francophone.${price}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, sites web pour commerces locaux en Belgique francophone`,
    template: `%s | ${site.name}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale.replace("-", "_"),
    siteName: site.name,
    title: `${site.name}, sites web pour commerces locaux`,
    description: `Le site de votre commerce, du croquis à la mise en ligne.${price}`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name}, le site de votre commerce se construit sous vos yeux` }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#EFEBE6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.locale} className={`${archivo.variable} ${onest.variable}`} suppressHydrationWarning>
      <head>
        {/* Marque la présence de JavaScript avant le premier rendu : les textes masqués ne clignotent pas. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-js','')" }} />
      </head>
      <body>
        <a className="skip" href="#haut">
          Aller au contenu
        </a>
        <SmoothScroll />
        {children}
        <Nav />
        <Grain />
        <Cursor />
      </body>
    </html>
  );
}
