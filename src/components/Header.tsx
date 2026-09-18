"use client";

import Link from "next/link";
import { useState } from "react";
import { getDictionary } from "@/lib/dictionary";
import { localizedPath } from "@/lib/i18n";
import type { Locale, SiteContent } from "@/lib/types";
import { LanguageSwitcher } from "./LanguageSwitcher";

type HeaderProps = {
  locale: Locale;
  content: SiteContent;
};

export function Header({ locale, content }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const t = getDictionary(locale);
  const name =
    locale === "ar" ? content.identity.shortNameAr : content.identity.shortNameEn;

  const links = [
    { href: localizedPath(locale, "/"), label: t.navHome },
    { href: localizedPath(locale, "/about"), label: t.navAbout },
    { href: localizedPath(locale, "/practice"), label: t.navPractice },
    { href: localizedPath(locale, "/contact"), label: t.navContact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gold/25 bg-navy/95 text-ivory backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Link
          href={localizedPath(locale, "/")}
          className="flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center border border-gold text-[0.7rem] font-semibold tracking-[0.16em] text-gold">
            KA
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base md:text-lg">{name}</span>
            <span className="block text-[0.68rem] tracking-[0.16em] text-gold-pale uppercase">
              {locale === "ar" ? "الكويت" : "Kuwait"}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ivory/85 transition-colors hover:text-gold-light"
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher locale={locale} />
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-gold/40 text-gold md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? t.closeMenu : t.openMenu}</span>
          <span aria-hidden="true" className="text-lg leading-none">
            {open ? "×" : "☰"}
          </span>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-gold/20 px-5 py-4 md:hidden"
          aria-label="Primary"
        >
          <div className="flex flex-col gap-3 text-base">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 text-ivory"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher locale={locale} className="mt-2 self-start" />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
