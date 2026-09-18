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
    title: locale === "ar" ? "نبذة" : "About",
  };
}

export default async function AboutPage({
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
  const longBio = locale === "ar" ? content.bio.longAr : content.bio.longEn;

  return (
    <div className="bg-ivory">
      <section className="border-b border-gold/20 bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <p className="text-xs tracking-[0.24em] text-gold uppercase">
            {t.profileBadge}
          </p>
          <h1 className="font-display mt-4 text-4xl text-navy md:text-5xl">
            {t.aboutHeading}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted">{t.aboutLead}</p>
          <div className="mt-8 max-w-xs">
            <Ornament />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.3fr_0.7fr] md:px-8">
        <article className="prose-profile max-w-3xl text-base leading-8 text-ink/90">
          {longBio.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <h2 className="font-display mt-12 text-2xl text-navy">
            {t.approachHeading}
          </h2>
          <p className="mt-4">{t.approachText}</p>
        </article>

        <aside className="space-y-6">
          <div className="border border-gold/30 bg-cream p-7">
            <h2 className="text-xs tracking-[0.2em] text-gold uppercase">
              {t.glanceHeading}
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-muted">{t.currentRole}</dt>
                <dd className="mt-1 text-navy">
                  {locale === "ar"
                    ? content.identity.titleAr
                    : content.identity.titleEn}
                </dd>
              </div>
              <div>
                <dt className="text-muted">
                  {locale === "ar" ? "الجهة" : "Organisation"}
                </dt>
                <dd className="mt-1 text-navy">
                  {locale === "ar"
                    ? content.identity.organizationAr
                    : content.identity.organizationEn}
                </dd>
              </div>
              <div>
                <dt className="text-muted">{t.location}</dt>
                <dd className="mt-1 text-navy">
                  {locale === "ar"
                    ? content.identity.locationAr
                    : content.identity.locationEn}
                </dd>
              </div>
            </dl>
          </div>
          <div className="border border-navy/10 bg-white p-7">
            <h2 className="text-xs tracking-[0.2em] text-gold uppercase">
              {t.credentialsHeading}
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              {t.credentialsNote}
            </p>
            <p className="mt-4 border border-dashed border-navy/20 px-3 py-2 text-sm text-navy/70">
              {t.credentialsPlaceholder}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
