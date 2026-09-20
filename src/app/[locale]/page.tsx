import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroLanding } from "@/components/HeroLanding";
import { IntakeForm } from "@/components/IntakeForm";
import { getContent } from "@/lib/content";
import { parseLocaleParam } from "@/lib/i18n";
import { isLocale, makeUi } from "@/lib/types";

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
  const t = makeUi(content, locale);

  return (
    <div className="bg-ivory">
      <HeroLanding locale={locale} content={content} />

      <section className="border-y border-navy/8 bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <p className="text-xs tracking-[0.24em] text-gold uppercase">
            {t("trustHeading")}
          </p>
          {content.chips.length === 0 ? (
            <p className="mt-5 text-sm text-muted">{t("emptyChips")}</p>
          ) : (
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {content.chips.map((chip) => (
                <li
                  key={chip.id}
                  className="border border-gold/35 bg-ivory px-4 py-2 text-sm text-navy"
                >
                  {locale === "ar" ? chip.labelAr : chip.labelEn}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs tracking-[0.24em] text-gold uppercase">
              {t("bioHeading")}
            </p>
            <p className="mt-5 max-w-md text-lg leading-9 text-ink/80">
              {locale === "ar" ? content.bio.shortAr : content.bio.shortEn}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.24em] text-gold uppercase">
              {t("highlightsHeading")}
            </p>
            {content.highlights.length === 0 ? (
              <p className="mt-5 text-sm text-muted">{t("emptyHighlights")}</p>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {content.highlights.map((item, index) => (
                  <li
                    key={item.id}
                    className="card-lift border border-navy/8 bg-cream p-6"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <p className="text-[0.65rem] tracking-[0.2em] text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="font-display mt-3 text-2xl text-navy">
                      {locale === "ar" ? item.titleAr : item.titleEn}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-ink/70">
                      {locale === "ar" ? item.textAr : item.textEn}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="px-5 pb-8 md:px-8">
        <div className="mx-auto max-w-6xl border border-gold/30 bg-navy px-8 py-12 text-ivory md:px-14">
          <p className="text-xs tracking-[0.24em] text-gold-light uppercase">
            {locale === "ar" ? content.cta.labelAr : content.cta.labelEn}
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ivory/80">
            {locale === "ar" ? content.cta.textAr : content.cta.textEn}
          </p>
          <Link
            href="#inquiry"
            className="mt-8 inline-block bg-gold px-7 py-3 text-sm tracking-[0.16em] text-navy-deep uppercase"
          >
            {locale === "ar" ? content.cta.labelAr : content.cta.labelEn}
          </Link>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-display text-4xl text-navy">
              {t("inquiryHeading")}
            </h2>
            <p className="mt-4 max-w-sm text-base leading-8 text-muted">
              {t("inquiryIntro")}
            </p>
            <dl className="mt-8 space-y-3 text-sm text-navy">
              {content.contact.email ? (
                <div>
                  <dt className="text-muted">{content.contact.email}</dt>
                </div>
              ) : null}
              {content.contact.phone ? (
                <div dir="ltr" className="text-start">
                  {content.contact.phone}
                </div>
              ) : null}
              <div>
                {locale === "ar"
                  ? content.contact.addressAr
                  : content.contact.addressEn}
              </div>
            </dl>
          </div>
          <div className="border border-navy/8 bg-white p-7 md:p-10">
            <IntakeForm locale={locale} content={content} />
          </div>
        </div>
      </section>
    </div>
  );
}
