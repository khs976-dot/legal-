export type Locale = "ar" | "en";

export type Chip = {
  id: string;
  labelAr: string;
  labelEn: string;
};

export type Highlight = {
  id: string;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
};

export const COPY_KEYS = [
  "skipToContent",
  "language",
  "languageToggleArLabel",
  "languageToggleEnLabel",
  "bioHeading",
  "trustHeading",
  "highlightsHeading",
  "emptyChips",
  "emptyHighlights",
  "inquiryHeading",
  "inquiryIntro",
  "formName",
  "formSubject",
  "formPhone",
  "formSubmit",
  "formMailtoHint",
  "formSuccess",
  "formCopy",
  "formCopied",
  "formError",
  "required",
  "disclaimer",
  "footerRights",
  "notFoundTitle",
  "notFoundHome",
] as const;

export type CopyPairKey = (typeof COPY_KEYS)[number];

export type SiteCopy = {
  [K in CopyPairKey as `${K}Ar` | `${K}En`]: string;
};

export type SiteContent = {
  identity: {
    nameAr: string;
    nameEn: string;
    shortNameAr: string;
    shortNameEn: string;
    monogram: string;
    titleAr: string;
    titleEn: string;
    locationAr: string;
    locationEn: string;
  };
  hero: {
    eyebrowAr: string;
    eyebrowEn: string;
    headlineAr: string;
    headlineEn: string;
    subheadlineAr: string;
    subheadlineEn: string;
  };
  bio: {
    shortAr: string;
    shortEn: string;
  };
  chips: Chip[];
  highlights: Highlight[];
  cta: {
    labelAr: string;
    labelEn: string;
    textAr: string;
    textEn: string;
  };
  contact: {
    email: string;
    phone: string;
    addressAr: string;
    addressEn: string;
    formspreeEndpoint: string;
  };
  copy: SiteCopy;
};

export function isLocale(value: string): value is Locale {
  return value === "ar" || value === "en";
}

export function ui(
  content: SiteContent,
  locale: Locale,
  key: CopyPairKey,
): string {
  return locale === "ar" ? content.copy[`${key}Ar`] : content.copy[`${key}En`];
}

export function makeUi(content: SiteContent, locale: Locale) {
  return (key: CopyPairKey) => ui(content, locale, key);
}
