import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SITE_AUTHOR, SITE_URL, buildLanguageAlternates } from "@/lib/seo";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Copa 2026 no horário do Brasil",
  generator: "Next.js",
  title: {
    default: "Tabela da Copa do Mundo 2026 no horário do Brasil",
    template: "%s — Copa 2026 no horário do Brasil",
  },
  description:
    "Os 104 jogos da Copa do Mundo 2026 com horário convertido para o Brasil. Filtre por seleção, fase, data ou país-sede e ache o seu jogo em segundos.",
  keywords: [
    "Copa do Mundo 2026",
    "World Cup 2026",
    "Mundial 2026",
    "FIFA 2026",
    "tabela Copa do Mundo",
    "World Cup schedule",
    "calendario Mundial",
    "horário do Brasil",
    "Brazil time",
    "Estados Unidos México Canadá",
    "USA Mexico Canada",
  ],
  authors: [{ name: SITE_AUTHOR.name, url: SITE_AUTHOR.url }],
  creator: SITE_AUTHOR.name,
  publisher: SITE_AUTHOR.name,
  category: "sports",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: buildLanguageAlternates(),
  },
  openGraph: {
    type: "website",
    siteName: "Copa 2026 no horário do Brasil",
    title: "Tabela da Copa do Mundo 2026 no horário do Brasil",
    description:
      "Acompanhe os 104 jogos da Copa 2026, da fase de grupos à final, com horário do Brasil e filtros rápidos por seleção e fase.",
    url: SITE_URL,
    locale: "pt_BR",
    alternateLocale: ["en_US", "es_ES"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tabela da Copa do Mundo 2026 no horário do Brasil",
    description:
      "104 jogos. Horário do Brasil. Filtros instantâneos por seleção, fase e data.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
