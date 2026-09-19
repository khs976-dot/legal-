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
      className={`inline-flex items-center gap-0.5 rounded-full border border-navy/10 bg-white/70 px-1.5 py-1 text-[0.7rem] tracking-[0.14em] uppercase backdrop-blur ${className}`}
      role="navigation"
      aria-label={ariaLabel || t("language")}
    >
      <Link
        href={switchLocalePath(pathname, "ar")}
        hrefLang="ar"
        className={`rounded-full px-2.5 py-0.5 ${
          locale === "ar"
            ? "bg-navy text-ivory"
            : "text-navy/55 hover:text-navy"
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
            ? "bg-navy text-ivory"
            : "text-navy/55 hover:text-navy"
        }`}
        aria-current={locale === "en" ? "true" : undefined}
      >
        {t("languageToggleEnLabel")}
      </Link>
    </div>
  );
}
