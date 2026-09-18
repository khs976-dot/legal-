"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function LanguageSwitcher({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname() || "/";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-gold/35 px-2 py-1 text-[0.72rem] tracking-[0.14em] uppercase ${className}`}
      role="navigation"
      aria-label={locale === "ar" ? "اللغة" : "Language"}
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
        عربي
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
        EN
      </Link>
    </div>
  );
}
