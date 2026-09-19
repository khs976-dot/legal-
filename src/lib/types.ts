export type Locale = "ar" | "en";

export type PracticeArea = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type Highlight = {
  id: string;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
};

export type ExperienceItem = {
  id: string;
  periodAr: string;
  periodEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export type IntakeSubjectItem = {
  id: string;
  labelAr: string;
  labelEn: string;
};

export const COPY_KEYS = [
  "skipToContent",
  "navHome",
  "navAbout",
  "navPractice",
  "navContact",
  "navAria",
  "language",
  "languageToggleArLabel",
  "languageToggleEnLabel",
  "openMenu",
  "closeMenu",
  "profileBadge",
  "currentRole",
  "locationLabel",
  "practiceHeading",
  "practiceIntro",
  "viewAllPractice",
  "aboutHeading",
  "aboutLead",
  "homeCtaSecondary",
  "highlightsHeading",
  "emptyHighlights",
  "emptyPractice",
  "glanceHeading",
  "experienceHeading",
  "educationHeading",
  "membershipsHeading",
  "languagesHeading",
  "approachHeading",
  "approachText",
  "contactEmail",
  "contactPhone",
  "contactLinkedin",
  "contactAddress",
  "notProvided",
  "intakeHeading",
  "intakeIntro",
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
    organizationAr: string;
    organizationEn: string;
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
    longAr: string;
    longEn: string;
  };
  practiceAreas: PracticeArea[];
  highlights: Highlight[];
  experience: ExperienceItem[];
  credentials: {
    educationAr: string;
    educationEn: string;
    membershipsAr: string;
    membershipsEn: string;
    languagesAr: string;
    languagesEn: string;
  };
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    addressAr: string;
    addressEn: string;
    formspreeEndpoint: string;
  };
  social: {
    linkedin: string;
    x: string;
    website: string;
  };
  cta: {
    labelAr: string;
    labelEn: string;
    textAr: string;
    textEn: string;
  };
  intakeSubjects: IntakeSubjectItem[];
  copy: SiteCopy;
};

export function isLocale(value: string): value is Locale {
  return value === "ar" || value === "en";
}

export function pickLocalized<T extends Record<string, string>>(
  record: T,
  locale: Locale,
  arKey: keyof T,
  enKey: keyof T,
): string {
  return locale === "ar" ? record[arKey] : record[enKey];
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
