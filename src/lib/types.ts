export type Locale = "ar" | "en";

export type PracticeArea = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
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

export type SiteContent = {
  identity: {
    nameAr: string;
    nameEn: string;
    shortNameAr: string;
    shortNameEn: string;
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
