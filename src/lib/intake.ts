export const INTAKE_SUBJECTS = [
  { value: "consultation", ar: "استشارة", en: "Consultation" },
  { value: "contract", ar: "صياغة عقد", en: "Contract drafting" },
  { value: "claim", ar: "دعوى", en: "Lawsuit / claim" },
] as const;

export type IntakeSubject = (typeof INTAKE_SUBJECTS)[number]["value"];

export function isIntakeSubject(value: string): value is IntakeSubject {
  return INTAKE_SUBJECTS.some((item) => item.value === value);
}

export function subjectLabel(value: IntakeSubject, locale: "ar" | "en"): string {
  const match = INTAKE_SUBJECTS.find((item) => item.value === value);
  if (!match) {
    return value;
  }
  return locale === "ar" ? match.ar : match.en;
}

export function defaultContactEmail(): string {
  return process.env.CONTACT_TO_EMAIL || "khs.976@outlook.com";
}
