import { COPY_KEYS, type SiteCopy } from "./types";

const DEFAULT_COPY: SiteCopy = {
  skipToContentAr: "تخطي إلى المحتوى",
  skipToContentEn: "Skip to content",
  navHomeAr: "الرئيسية",
  navHomeEn: "Home",
  navAboutAr: "نبذة",
  navAboutEn: "About",
  navPracticeAr: "مجالات العمل",
  navPracticeEn: "Practice",
  navContactAr: "التواصل",
  navContactEn: "Contact",
  navAriaAr: "القائمة الرئيسية",
  navAriaEn: "Primary",
  languageAr: "اللغة",
  languageEn: "Language",
  languageToggleArLabelAr: "عربي",
  languageToggleArLabelEn: "عربي",
  languageToggleEnLabelAr: "EN",
  languageToggleEnLabelEn: "EN",
  openMenuAr: "فتح القائمة",
  openMenuEn: "Open menu",
  closeMenuAr: "إغلاق القائمة",
  closeMenuEn: "Close menu",
  profileBadgeAr: "ملف مهني",
  profileBadgeEn: "Professional profile",
  currentRoleAr: "المنصب",
  currentRoleEn: "Role",
  locationLabelAr: "المقر",
  locationLabelEn: "Location",
  practiceHeadingAr: "مجالات العمل",
  practiceHeadingEn: "Practice",
  practiceIntroAr: "مجالات يُعنى بها الملف المهني.",
  practiceIntroEn: "Areas this profile covers.",
  viewAllPracticeAr: "كل المجالات",
  viewAllPracticeEn: "All areas",
  aboutHeadingAr: "نبذة",
  aboutHeadingEn: "About",
  aboutLeadAr: "تعريف موجز.",
  aboutLeadEn: "A short introduction.",
  homeCtaSecondaryAr: "نبذة أوفى",
  homeCtaSecondaryEn: "Read more",
  highlightsHeadingAr: "ملامح",
  highlightsHeadingEn: "Notes",
  emptyHighlightsAr: "لا توجد ملامح بعد.",
  emptyHighlightsEn: "No notes yet.",
  emptyPracticeAr: "لا توجد مجالات بعد.",
  emptyPracticeEn: "No practice areas yet.",
  glanceHeadingAr: "بطاقة تعريف",
  glanceHeadingEn: "At a glance",
  experienceHeadingAr: "المسار المهني",
  experienceHeadingEn: "Path",
  educationHeadingAr: "التعليم",
  educationHeadingEn: "Education",
  membershipsHeadingAr: "العضويات",
  membershipsHeadingEn: "Memberships",
  languagesHeadingAr: "اللغات",
  languagesHeadingEn: "Languages",
  approachHeadingAr: "منهج العمل",
  approachHeadingEn: "Approach",
  approachTextAr: "صياغة دقيقة، وفصل واضح بين الملف التعريفي وأي مشورة فردية.",
  approachTextEn:
    "Careful drafting, and a clear line between this profile and any individual advice.",
  contactEmailAr: "البريد",
  contactEmailEn: "Email",
  contactPhoneAr: "الهاتف",
  contactPhoneEn: "Telephone",
  contactLinkedinAr: "لينكدإن",
  contactLinkedinEn: "LinkedIn",
  contactAddressAr: "العنوان",
  contactAddressEn: "Address",
  notProvidedAr: "غير مضاف",
  notProvidedEn: "Not added",
  intakeHeadingAr: "لوحة الطلب",
  intakeHeadingEn: "Request",
  intakeIntroAr: "الاسم، الموضوع، ورقم الهاتف. هذا ليس تقديم استشارة قانونية.",
  intakeIntroEn: "Name, subject, and telephone. This is not legal advice.",
  formNameAr: "الاسم",
  formNameEn: "Name",
  formSubjectAr: "الموضوع",
  formSubjectEn: "Subject",
  formPhoneAr: "رقم الهاتف",
  formPhoneEn: "Telephone",
  formSubmitAr: "إرسال الطلب",
  formSubmitEn: "Send request",
  formMailtoHintAr: "قد يُفتح برنامج البريد لديك. يمكنك أيضاً نسخ نص الطلب.",
  formMailtoHintEn: "Your email app may open. You can also copy the request.",
  formSuccessAr: "تم إرسال طلبك. سيتم التواصل معك.",
  formSuccessEn: "Your request was sent. You will be contacted.",
  formCopyAr: "نسخ نص الطلب",
  formCopyEn: "Copy request text",
  formCopiedAr: "تم النسخ",
  formCopiedEn: "Copied",
  formErrorAr: "تعذّر الإرسال. حاول لاحقاً أو اتصل مباشرة.",
  formErrorEn: "Could not send. Try again or call directly.",
  requiredAr: "مطلوب",
  requiredEn: "Required",
  disclaimerAr:
    "هذا الموقع تعريفي فحسب. لا يُعد استشارة قانونية، ولا يُنشئ علاقة محامٍ بموكل.",
  disclaimerEn:
    "This website is a professional profile only. It is not legal advice and does not create a lawyer–client relationship.",
  footerRightsAr: "جميع الحقوق محفوظة",
  footerRightsEn: "All rights reserved",
  notFoundTitleAr: "الصفحة غير موجودة",
  notFoundTitleEn: "Page not found",
  notFoundHomeAr: "العودة إلى الرئيسية",
  notFoundHomeEn: "Return home",
};

export function defaultCopy(): SiteCopy {
  return { ...DEFAULT_COPY };
}

export function mergeCopy(partial?: Partial<SiteCopy> | null): SiteCopy {
  const next = { ...DEFAULT_COPY };
  if (!partial) {
    return next;
  }
  for (const key of COPY_KEYS) {
    const arKey = `${key}Ar` as keyof SiteCopy;
    const enKey = `${key}En` as keyof SiteCopy;
    if (typeof partial[arKey] === "string") {
      next[arKey] = partial[arKey];
    }
    if (typeof partial[enKey] === "string") {
      next[enKey] = partial[enKey];
    }
  }
  return next;
}
