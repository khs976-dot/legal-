import { COPY_KEYS, type CopyPairKey } from "./types";

export const COPY_FIELD_LABELS: Record<CopyPairKey, string> = {
  skipToContent: "تخطي إلى المحتوى",
  language: "تسمية مبدّل اللغة",
  languageToggleArLabel: "زر العربية",
  languageToggleEnLabel: "زر الإنجليزية",
  bioHeading: "عنوان النبذة",
  trustHeading: "عنوان الشريط المختصر",
  highlightsHeading: "عنوان الملامح",
  emptyChips: "رسالة إذا لم توجد شرائح",
  emptyHighlights: "رسالة إذا لم توجد ملامح",
  inquiryHeading: "عنوان نموذج التواصل",
  inquiryIntro: "مقدمة النموذج",
  formName: "تسمية الاسم",
  formSubject: "تسمية الموضوع",
  formPhone: "تسمية الهاتف",
  formSubmit: "نص زر الإرسال",
  formMailtoHint: "تلميح بعد الإرسال",
  formSuccess: "رسالة النجاح",
  formCopy: "زر النسخ",
  formCopied: "تم النسخ",
  formError: "رسالة الخطأ",
  required: "كلمة مطلوب",
  disclaimer: "إخلاء المسؤولية",
  footerRights: "عبارة الحقوق",
  notFoundTitle: "عنوان صفحة غير موجودة",
  notFoundHome: "زر العودة",
};

export const COPY_GROUPS: { title: string; keys: CopyPairKey[] }[] = [
  {
    title: "اللغة وأعلى الصفحة",
    keys: [
      "skipToContent",
      "language",
      "languageToggleArLabel",
      "languageToggleEnLabel",
    ],
  },
  {
    title: "عناوين الأقسام",
    keys: [
      "bioHeading",
      "trustHeading",
      "highlightsHeading",
      "emptyChips",
      "emptyHighlights",
    ],
  },
  {
    title: "نموذج التواصل",
    keys: [
      "inquiryHeading",
      "inquiryIntro",
      "formName",
      "formSubject",
      "formPhone",
      "formSubmit",
      "required",
      "formMailtoHint",
      "formSuccess",
      "formCopy",
      "formCopied",
      "formError",
    ],
  },
  {
    title: "أسفل الصفحة",
    keys: ["disclaimer", "footerRights", "notFoundTitle", "notFoundHome"],
  },
];

export { COPY_KEYS };
