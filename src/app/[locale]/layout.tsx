import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getContent } from "@/lib/content";
import { parseLocaleParam } from "@/lib/i18n";
import { isLocale, makeUi } from "@/lib/types";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = parseLocaleParam(rawLocale);
  const content = await getContent();
  const t = makeUi(content, locale);

  return (
    <>
      <a href="#content" className="skip-link">
        {t("skipToContent")}
      </a>
      <Header locale={locale} content={content} />
      <main id="content" className="flex-1">
        {children}
      </main>
      <Footer locale={locale} content={content} />
    </>
  );
}
