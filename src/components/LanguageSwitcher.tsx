"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath } from "@/lib/i18n";
import { makeUi, type Locale, type SiteContent } from "@/lib/types";

export function LanguageSwitcher({
  locale,
  content,
  className = "",
  ariaLabel,
}: {
  locale: Locale;
  content: SiteContent;
  className?: string;
  ariaLabel?: string;
}) {
  const pathname = usePathname() || "/";
  const t = makeUi(content, locale);

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-gold/30 bg-navy-deep/40 px-1.5 py-1 text-[0.7rem] tracking-[0.14em] uppercase backdrop-blur ${className}`}
      role="navigation"
      aria-label={ariaLabel || t("language")}
    >
      <Link
        href={switchLocalePath(pathname, "ar")}
        hrefLang="ar"
        className={`rounded-full px-2.5 py-0.5 ${
          locale === "ar"
            ? "bg-gold text-navy-deep"
            : "text-ivory/60 hover:text-ivory"
        }`}
        aria-current={locale === "ar" ? "true" : undefined}
      >
        {t("languageToggleArLabel")}
      </Link>
      <Link
        href={switchLocalePath(pathname, "en")}
        hrefLang="en"
        className={`rounded-full px-2.5 py-0.5 ${
          locale === "en"
            ? "bg-gold text-navy-deep"
            : "text-ivory/60 hover:text-ivory"
        }`}
        aria-current={locale === "en" ? "true" : undefined}
      >
        {t("languageToggleEnLabel")}
      </Link>
    </div>
  );
}
