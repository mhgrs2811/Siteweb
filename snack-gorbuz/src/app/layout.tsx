import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { copy } from "@/data/copy";
import { seo } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { anton, manrope } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: seo.home.title,
    template: `%s — ${siteConfig.brand.name}`,
  },
  description: seo.home.description,
  applicationName: siteConfig.brand.name,
  ...(siteConfig.siteUrl ? { metadataBase: new URL(siteConfig.siteUrl) } : {}),
  openGraph: {
    type: "website",
    locale: "fr_BE",
    siteName: siteConfig.brand.name,
    title: seo.home.title,
    description: seo.home.description,
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171717",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${anton.variable} ${manrope.variable}`}>
      <body>
        <a href="#contenu" className="skip-link">
          {copy.nav.skipToContent}
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
