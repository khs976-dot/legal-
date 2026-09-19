import Link from "next/link";
import { notFound } from "next/navigation";
import { Ornament } from "@/components/Ornament";
import { getContent } from "@/lib/content";
import { getDictionary } from "@/lib/dictionary";
import { localizedPath, parseLocaleParam } from "@/lib/i18n";
import { isLocale } from "@/lib/types";

export default async function HomePage({
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
  const highlights = content.practiceAreas.slice(0, 4);

  return (
    <>
      <section className="hero-grid text-ivory">
        <div className="mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-5 py-20 md:px-8 md:py-28">
          <p className="text-xs tracking-[0.28em] text-gold-light uppercase">
            {locale === "ar" ? content.hero.eyebrowAr : content.hero.eyebrowEn}
          </p>
          <h1 className="font-display mt-6 max-w-4xl text-4xl leading-tight md:text-6xl">
            {locale === "ar"
              ? content.hero.headlineAr
              : content.hero.headlineEn}
          </h1>
          <p className="mt-3 font-display text-xl text-gold-pale md:text-2xl">
            {locale === "ar"
              ? content.identity.nameEn
              : content.identity.nameAr}
          </p>
          <div className="mt-8 max-w-md">
            <Ornament light />
          </div>
          <p className="mt-8 max-w-2xl text-base leading-8 text-ivory/80 md:text-lg">
            {locale === "ar"
              ? content.hero.subheadlineAr
              : content.hero.subheadlineEn}
          </p>
          <p className="mt-4 text-sm text-gold-pale">
            {locale === "ar"
              ? `${content.identity.titleAr} — ${content.identity.organizationAr}`
              : `${content.identity.titleEn} — ${content.identity.organizationEn}`}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`${localizedPath(locale, "/contact")}#intake`}
              className="bg-gold px-6 py-3 text-sm tracking-[0.12em] text-navy-deep uppercase"
            >
              {locale === "ar" ? content.cta.labelAr : content.cta.labelEn}
            </Link>
            <Link
              href={localizedPath(locale, "/about")}
              className="border border-gold/50 px-6 py-3 text-sm tracking-[0.12em] text-ivory uppercase hover:border-gold"
            >
              {t.homeCtaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-8">
          <div>
            <p className="text-xs tracking-[0.24em] text-gold uppercase">
              {t.profileBadge}
            </p>
            <h2 className="font-display mt-4 text-3xl text-navy md:text-4xl">
              {t.aboutHeading}
            </h2>
            <div className="mt-6 max-w-xs">
              <Ornament />
            </div>
            <p className="mt-8 max-w-xl text-base leading-8 text-ink/85">
              {locale === "ar" ? content.bio.shortAr : content.bio.shortEn}
            </p>
          </div>
          <aside className="border border-gold/30 bg-ivory p-8">
            <p className="text-xs tracking-[0.2em] text-gold uppercase">
              {t.currentRole}
            </p>
            <p className="mt-3 font-display text-2xl text-navy">
              {locale === "ar"
                ? content.identity.titleAr
                : content.identity.titleEn}
            </p>
            <p className="mt-3 text-ink/80">
              {locale === "ar"
                ? content.identity.organizationAr
                : content.identity.organizationEn}
            </p>
            <p className="mt-6 text-sm text-muted">
              {locale === "ar"
                ? content.identity.locationAr
                : content.identity.locationEn}
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-3xl text-navy md:text-4xl">
                {t.practiceHeading}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
                {t.practiceIntro}
              </p>
            </div>
            <Link
              href={localizedPath(locale, "/practice")}
              className="text-sm tracking-[0.12em] text-navy uppercase underline decoration-gold decoration-2 underline-offset-6"
            >
              {t.viewAllPractice}
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {highlights.map((area) => (
              <article
                key={area.id}
                className="border border-navy/10 bg-cream p-7"
              >
                <h3 className="font-display text-2xl text-navy">
                  {locale === "ar" ? area.titleAr : area.titleEn}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink/80">
                  {locale === "ar" ? area.descriptionAr : area.descriptionEn}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy text-ivory">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <div className="border border-gold/35 px-8 py-12 md:px-14">
            <p className="text-xs tracking-[0.24em] text-gold-light uppercase">
              {locale === "ar" ? content.cta.labelAr : content.cta.labelEn}
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ivory/85">
              {locale === "ar" ? content.cta.textAr : content.cta.textEn}
            </p>
            <Link
              href={`${localizedPath(locale, "/contact")}#intake`}
              className="mt-8 inline-block bg-gold px-6 py-3 text-sm tracking-[0.12em] text-navy-deep uppercase"
            >
              {t.navContact}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
