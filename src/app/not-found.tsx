import Link from "next/link";
import { headers } from "next/headers";
import { getContent } from "@/lib/content";
import { makeUi, type Locale } from "@/lib/types";

export default async function NotFound() {
  const headerStore = await headers();
  const locale: Locale = headerStore.get("x-locale") === "en" ? "en" : "ar";
  const content = await getContent();
  const t = makeUi(content, locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-5 text-center text-ivory">
      <h1 className="font-display mt-4 text-4xl">{t("notFoundTitle")}</h1>
      <Link
        href="/"
        className="mt-8 bg-gold px-5 py-3 text-sm tracking-[0.12em] text-navy-deep uppercase"
      >
        {t("notFoundHome")}
      </Link>
    </div>
  );
}
