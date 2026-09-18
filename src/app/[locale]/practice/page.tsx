import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Ornament } from "@/components/Ornament";
import { getContent } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { parseLocaleParam } from "@/lib/i18n";
import { isLocale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = parseLocaleParam(rawLocale);
  return {
    title: locale === "ar" ? "مجالات العمل" : "Practice areas",
  };
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = parseLocaleParam(rawLocale);
  const content = await getContent();
  const t = getDictionary(locale);

  return (
    <div className="bg-ivory">
      <section className="border-b border-gold/20 bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <h1 className="font-display text-4xl text-navy md:text-5xl">
            {t.practiceHeading}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            {t.practiceIntro}
          </p>
          <div className="mt-8 max-w-xs">
            <Ornament />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {content.practiceAreas.map((area, index) => (
            <article
              key={area.id}
              className="border-s-2 border-gold bg-cream p-8"
            >
              <p className="text-xs tracking-[0.22em] text-gold">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="font-display mt-3 text-2xl text-navy">
                {locale === "ar" ? area.titleAr : area.titleEn}
              </h2>
              <p className="mt-4 text-sm leading-7 text-ink/80">
                {locale === "ar" ? area.descriptionAr : area.descriptionEn}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
