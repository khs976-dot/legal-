import { localizedPath } from "@/lib/i18n";
import { makeUi, type Locale, type SiteContent } from "@/lib/types";
import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function TopBar({
  locale,
  content,
}: {
  locale: Locale;
  content: SiteContent;
}) {
  const t = makeUi(content, locale);
  const name =
    locale === "ar" ? content.identity.shortNameAr : content.identity.shortNameEn;

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href={localizedPath(locale, "/")}
          className="flex items-center gap-2.5 text-ivory"
        >
          <span className="flex h-9 w-9 items-center justify-center border border-gold/70 text-[0.65rem] tracking-[0.18em] text-gold">
            {content.identity.monogram}
          </span>
          <span className="hidden text-sm tracking-wide text-ivory/70 sm:block">
            {name}
          </span>
          <span className="sr-only">{name}</span>
        </Link>
        <LanguageSwitcher locale={locale} content={content} ariaLabel={t("language")} />
      </div>
    </header>
  );
}
