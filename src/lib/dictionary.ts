import type { Locale } from "./types";

const dictionary = {
  ar: {
    skipToContent: "تخطي إلى المحتوى",
    navHome: "الرئيسية",
    navAbout: "نبذة",
    navPractice: "مجالات العمل",
    navContact: "التواصل",
    language: "اللغة",
    languageAr: "العربية",
    languageEn: "English",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    profileBadge: "ملف مهني — الكويت",
    currentRole: "المنصب الحالي",
    location: "المقر",
    practiceHeading: "مجالات الاهتمام المهني",
    practiceIntro:
      "عناصر تعريفية بمجالات العمل التي يُعنى بها الملف المهني، وهي ليست شهادات تخصص ولا قائمة قضايا.",
    viewAllPractice: "عرض مجالات العمل",
    aboutHeading: "نبذة مهنية",
    aboutLead: "تعريف مؤسسي موجز، دون ادعاءات غير موثّقة.",
    glanceHeading: "بطاقة تعريف",
    credentialsHeading: "القيد والترخيص",
    credentialsNote:
      "يُستكمل هذا القسم لاحقاً من لوحة التحكم عند توفر بيانات رسمية. لا تُنشر أرقام قيد أو رخص غير مؤكدة.",
    credentialsPlaceholder: "يُضاف لاحقاً",
    contactHeading: "التواصل",
    contactIntro:
      "للتواصل بشأن الفرص المهنية في القطاع الخاص. لن تُعامل الرسالة بوصفها استشارة قانونية.",
    contactEmail: "البريد الإلكتروني",
    contactPhone: "الهاتف",
    contactLinkedin: "لينكدإن",
    contactAddress: "العنوان",
    notProvided: "يُضاف من لوحة التحكم",
    formName: "الاسم",
    formEmail: "البريد الإلكتروني",
    formOrganisation: "الجهة / المؤسسة (اختياري)",
    formMessage: "الرسالة",
    formSubmit: "إرسال الرسالة",
    formMailtoHint: "سيُفتح برنامج البريد لديك لإكمال الإرسال.",
    formSuccess: "شكراً لك. تم توجيه رسالتك.",
    formError: "تعذّر الإرسال. يُرجى المحاولة لاحقاً أو استخدام البريد مباشرة.",
    formMissingEmail:
      "لم يُضف بريد للتواصل بعد. يُرجى إدخال عنوان البريد من لوحة التحكم.",
    required: "مطلوب",
    disclaimer:
      "هذا الموقع ذو طابع تعريفي ومعلوماتي فحسب. وهو لا يُعدّ استشارة قانونية، ولا يُنشئ علاقة محامٍ بموكل، ولا يشكّل تعاقداً أو قبولاً للوكالة.",
    footerRights: "جميع الحقوق محفوظة",
    adminLink: "لوحة التحكم",
    homeCtaSecondary: "نبذة أوفى",
    approachHeading: "منهج العمل",
    approachText:
      "عناية بالصياغة الدقيقة، وبالسياق النظامي الكويتي، وبفصل الملف التعريفي عن أي مشورة قانونية فردية.",
  },
  en: {
    skipToContent: "Skip to content",
    navHome: "Home",
    navAbout: "About",
    navPractice: "Practice",
    navContact: "Contact",
    language: "Language",
    languageAr: "العربية",
    languageEn: "English",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    profileBadge: "Professional profile — Kuwait",
    currentRole: "Current role",
    location: "Location",
    practiceHeading: "Areas of professional focus",
    practiceIntro:
      "These entries describe areas of professional attention. They are not specialist certifications or a matter list.",
    viewAllPractice: "View practice areas",
    aboutHeading: "Professional background",
    aboutLead: "A concise institutional introduction, without unverified claims.",
    glanceHeading: "At a glance",
    credentialsHeading: "Admission & licensing",
    credentialsNote:
      "This section can be completed later from the dashboard once official details are available. Do not publish unverified bar or licence numbers.",
    credentialsPlaceholder: "To be added",
    contactHeading: "Contact",
    contactIntro:
      "For enquiries about private-sector professional opportunities. A message sent here is not treated as legal advice.",
    contactEmail: "Email",
    contactPhone: "Telephone",
    contactLinkedin: "LinkedIn",
    contactAddress: "Address",
    notProvided: "Add this in the dashboard",
    formName: "Name",
    formEmail: "Email",
    formOrganisation: "Organisation (optional)",
    formMessage: "Message",
    formSubmit: "Send message",
    formMailtoHint: "Your email application will open to complete sending.",
    formSuccess: "Thank you. Your message has been directed.",
    formError: "The message could not be sent. Please try again or write directly.",
    formMissingEmail:
      "A contact email has not been added yet. Please set it in the dashboard.",
    required: "Required",
    disclaimer:
      "This website is informational and intended as a professional profile. It does not constitute legal advice, does not create a lawyer–client relationship, and does not form an engagement or acceptance of a mandate.",
    footerRights: "All rights reserved",
    adminLink: "Dashboard",
    homeCtaSecondary: "Read the full profile",
    approachHeading: "Approach",
    approachText:
      "Careful drafting, attention to the Kuwaiti regulatory context, and a clear separation between this public profile and any individual legal advice.",
  },
} as const;

export type Dictionary = (typeof dictionary)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionary[locale];
}
