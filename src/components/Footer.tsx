import { localizedPath } from "@/lib/i18n";
import { makeUi, type Locale, type SiteContent } from "@/lib/types";
import Link from "next/link";

type FooterProps = {
  locale: Locale;
  content: SiteContent;
};

export function Footer({ locale, content }: FooterProps) {
  const t = makeUi(content, locale);
  const year = new Date().getFullYear();
  const name =
    locale === "ar" ? content.identity.nameAr : content.identity.nameEn;

  return (
    <footer className="mt-auto border-t border-gold/25 bg-navy text-ivory">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-display text-2xl">{name}</p>
            <p className="mt-2 text-sm text-gold-pale">
              {locale === "ar"
                ? content.identity.titleAr
                : content.identity.titleEn}
            </p>
            <p className="mt-6 max-w-xl text-sm leading-8 text-ivory/75">
              {t("disclaimer")}
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <Link href={localizedPath(locale, "/about")} className="hover:text-gold-light">
              {t("navAbout")}
            </Link>
            <Link
              href={localizedPath(locale, "/practice")}
              className="hover:text-gold-light"
            >
              {t("navPractice")}
            </Link>
            <Link
              href={localizedPath(locale, "/contact")}
              className="hover:text-gold-light"
            >
              {t("navContact")}
            </Link>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-ivory/50">
          © {year} {name}. {t("footerRights")}.
        </p>
      </div>
    </footer>
  );
}
