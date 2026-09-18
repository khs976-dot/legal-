import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
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
    title: locale === "ar" ? "التواصل" : "Contact",
  };
}

function displayValue(value: string, fallback: string) {
  return value.trim() ? value : fallback;
}

export default async function ContactPage({
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
  const linkedin = content.contact.linkedin || content.social.linkedin;

  return (
    <div className="bg-ivory">
      <section className="border-b border-gold/20 bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <h1 className="font-display text-4xl text-navy md:text-5xl">
            {t.contactHeading}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            {t.contactIntro}
          </p>
          <div className="mt-8 max-w-xs">
            <Ornament />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[0.85fr_1.15fr] md:px-8">
        <aside className="space-y-6">
          <div className="border border-gold/30 bg-cream p-7">
            <dl className="space-y-5 text-sm">
              <div>
                <dt className="text-muted">{t.contactEmail}</dt>
                <dd className="mt-1 text-navy">
                  {content.contact.email ? (
                    <a href={`mailto:${content.contact.email}`}>
                      {content.contact.email}
                    </a>
                  ) : (
                    t.notProvided
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted">{t.contactPhone}</dt>
                <dd className="mt-1 text-navy" dir="ltr">
                  {displayValue(content.contact.phone, t.notProvided)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">{t.contactLinkedin}</dt>
                <dd className="mt-1 text-navy">
                  {linkedin ? (
                    <a href={linkedin} target="_blank" rel="noreferrer">
                      {linkedin}
                    </a>
                  ) : (
                    t.notProvided
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted">{t.contactAddress}</dt>
                <dd className="mt-1 text-navy">
                  {locale === "ar"
                    ? displayValue(content.contact.addressAr, t.notProvided)
                    : displayValue(content.contact.addressEn, t.notProvided)}
                </dd>
              </div>
            </dl>
          </div>
          <p className="text-sm leading-7 text-muted">
            {locale === "ar" ? content.cta.textAr : content.cta.textEn}
          </p>
        </aside>
        <div className="border border-navy/10 bg-white p-7 md:p-10">
          <ContactForm locale={locale} content={content} />
        </div>
      </section>
    </div>
  );
}
