import { COPY_KEYS, type SiteCopy } from "./types";

const DEFAULT_COPY: SiteCopy = {
  skipToContentAr: "تخطي إلى المحتوى",
  skipToContentEn: "Skip to content",
  languageAr: "اللغة",
  languageEn: "Language",
  languageToggleArLabelAr: "عربي",
  languageToggleArLabelEn: "عربي",
  languageToggleEnLabelAr: "EN",
  languageToggleEnLabelEn: "EN",
  bioHeadingAr: "نبذة",
  bioHeadingEn: "Profile",
  trustHeadingAr: "باختصار",
  trustHeadingEn: "At a glance",
  highlightsHeadingAr: "مجالات الاهتمام",
  highlightsHeadingEn: "Focus",
  emptyChipsAr: "لا توجد عناصر بعد.",
  emptyChipsEn: "Nothing added yet.",
  emptyHighlightsAr: "لا توجد ملامح بعد.",
  emptyHighlightsEn: "No notes yet.",
  inquiryHeadingAr: "تواصل",
  inquiryHeadingEn: "Get in touch",
  inquiryIntroAr: "الاسم، الموضوع، ورقم الهاتف.",
  inquiryIntroEn: "Name, subject, and telephone.",
  formNameAr: "الاسم",
  formNameEn: "Name",
  formSubjectAr: "الموضوع",
  formSubjectEn: "Subject",
  formPhoneAr: "رقم الهاتف",
  formPhoneEn: "Telephone",
  formSubmitAr: "إرسال",
  formSubmitEn: "Send",
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
    "هذا الموقع ملف تعريفي. لا يُعد مشورة قانونية، ولا يُنشئ علاقة محامٍ بموكل.",
  disclaimerEn:
    "This website is a professional profile. It is not legal advice and does not create a lawyer–client relationship.",
  footerRightsAr: "جميع الحقوق محفوظة",
  footerRightsEn: "All rights reserved",
  notFoundTitleAr: "الصفحة غير موجودة",
  notFoundTitleEn: "Page not found",
  notFoundHomeAr: "العودة",
  notFoundHomeEn: "Return",
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
