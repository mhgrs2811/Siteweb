import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { localeMeta, defaultLocale } from "@/i18n/config";
import { nav } from "@/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { Cursor } from "@/components/layout/Cursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SurfaceObserver } from "@/components/layout/SurfaceObserver";
import { JsonLd, organizationJsonLd } from "@/lib/seo";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: localeMeta[defaultLocale].ogLocale,
    url: "/",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Exécuté avant le premier rendu : classe .js et préchargeur (1 fois par session). */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!sessionStorage.getItem('nova-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.preload='1'}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={localeMeta[defaultLocale].htmlLang} className={`${geist.variable} ${instrument.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <JsonLd data={organizationJsonLd()} />
      </head>
      <body>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ivory focus:px-5 focus:py-3 focus:text-graphite">
          {nav.skip}
        </a>
        <Preloader />
        <ScrollProgress />
        <Header />
        <main id="contenu" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <Cursor />
        <SurfaceObserver />
      </body>
    </html>
  );
}
