import { makeUi, type Locale, type SiteContent } from "@/lib/types";

export function Footer({
  locale,
  content,
}: {
  locale: Locale;
  content: SiteContent;
}) {
  const t = makeUi(content, locale);
  const year = new Date().getFullYear();
  const name =
    locale === "ar" ? content.identity.nameAr : content.identity.nameEn;

  return (
    <footer className="border-t border-navy/8 bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <p className="max-w-2xl text-sm leading-7 text-muted">{t("disclaimer")}</p>
        <p className="mt-6 text-xs text-navy/40">
          © {year} {name}. {t("footerRights")}.
        </p>
      </div>
    </footer>
  );
}
