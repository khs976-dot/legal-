import type { IntakeSubjectItem, SiteContent } from "./types";

export function subjectFromContent(
  content: SiteContent,
  id: string,
): IntakeSubjectItem | undefined {
  return content.intakeSubjects.find((item) => item.id === id);
}

export function subjectLabel(
  content: SiteContent,
  id: string,
  locale: "ar" | "en",
): string {
  const match = subjectFromContent(content, id);
  if (!match) {
    return id;
  }
  return locale === "ar" ? match.labelAr : match.labelEn;
}

export function defaultContactEmail(): string {
  return process.env.CONTACT_TO_EMAIL || "khs.976@outlook.com";
}
