import { isLocale, type Locale } from "./types";

export const locales: Locale[] = ["ar", "en"];
export const defaultLocale: Locale = "ar";

export function localeFromPathname(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return "en";
  }
  return "ar";
}

export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") {
    return clean === "/" ? "/en" : `/en${clean}`;
  }
  return clean;
}

export function switchLocalePath(pathname: string, next: Locale): string {
  return localizedPath(next, stripLocalePrefix(pathname));
}

export function parseLocaleParam(value: string | undefined): Locale {
  if (value && isLocale(value)) {
    return value;
  }
  return defaultLocale;
}
