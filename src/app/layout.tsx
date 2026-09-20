import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  Cormorant_Garamond,
  IBM_Plex_Sans_Arabic,
  Noto_Naskh_Arabic,
  Source_Sans_3,
} from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic-sans",
  display: "swap",
});

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic-serif",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-en",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans-en",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${content.identity.nameAr} | ${content.identity.nameEn}`,
      template: `%s | ${content.identity.shortNameAr}`,
    },
    description: content.bio.shortEn,
    alternates: {
      languages: {
        ar: "/",
        en: "/en",
      },
    },
    openGraph: {
      title: `${content.identity.nameAr} | ${content.identity.nameEn}`,
      description: content.hero.subheadlineEn,
      locale: "ar_KW",
      alternateLocale: ["en_GB"],
      type: "profile",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const locale = headerStore.get("x-locale") === "en" ? "en" : "ar";

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${plexArabic.variable} ${naskh.variable} ${cormorant.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory text-ink">
        {children}
      </body>
    </html>
  );
}
