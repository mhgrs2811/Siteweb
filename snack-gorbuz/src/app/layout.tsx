import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/anton/latin-400.css";
import "@fontsource/anton/latin-ext-400.css";
import "@fontsource-variable/manrope/wght.css";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";
import { seoPages } from "@/data/seoData";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealObserver } from "@/components/ui/RevealObserver";

export const metadata: Metadata = {
  ...(siteConfig.siteUrl ? { metadataBase: new URL(siteConfig.siteUrl) } : {}),
  title: {
    default: seoPages.home.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: seoPages.home.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "fr_BE",
    siteName: siteConfig.name,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171717",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
