"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath } from "@/lib/i18n";
import { makeUi, type Locale, type SiteContent } from "@/lib/types";

export function LanguageSwitcher({
  locale,
  content,
  className = "",
}: {
  locale: Locale;
  content: SiteContent;
  className?: string;
}) {
  const pathname = usePathname() || "/";
  const t = makeUi(content, locale);

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-gold/35 px-2 py-1 text-[0.72rem] tracking-[0.14em] uppercase ${className}`}
      role="navigation"
      aria-label={t("language")}
    >
      <Link
        href={switchLocalePath(pathname, "ar")}
        hrefLang="ar"
        className={`rounded-full px-2 py-0.5 ${
          locale === "ar"
            ? "bg-gold text-navy-deep"
            : "text-gold-pale hover:text-gold-light"
        }`}
        aria-current={locale === "ar" ? "true" : undefined}
      >
        {t("languageToggleArLabel")}
      </Link>
      <Link
        href={switchLocalePath(pathname, "en")}
        hrefLang="en"
        className={`rounded-full px-2 py-0.5 ${
          locale === "en"
            ? "bg-gold text-navy-deep"
            : "text-gold-pale hover:text-gold-light"
        }`}
        aria-current={locale === "en" ? "true" : undefined}
      >
        {t("languageToggleEnLabel")}
      </Link>
    </div>
  );
}
