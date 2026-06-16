import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Content Rocket AI – Générateur de Contenu Viral TikTok Instagram YouTube",
    template: "%s | Content Rocket AI",
  },
  description:
    "Générez automatiquement du contenu viral pour TikTok, Instagram Reels, YouTube Shorts et Facebook Reels grâce à l'IA. Hooks, scripts, hashtags, calendrier éditorial.",
  keywords: [
    "générateur contenu viral",
    "TikTok IA",
    "Instagram Reels script",
    "YouTube Shorts idées",
    "content creator IA",
    "hooks viraux",
    "calendrier éditorial",
  ],
  authors: [{ name: "Content Rocket AI" }],
  creator: "Content Rocket AI",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Content Rocket AI – Générateur de Contenu Viral",
    description:
      "Générez automatiquement du contenu viral pour TikTok, Instagram, YouTube et Facebook grâce à l'IA.",
    siteName: "Content Rocket AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Rocket AI",
    description: "Générez du contenu viral avec l'IA",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#18181b",
                  color: "#fff",
                  border: "1px solid #27272a",
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
