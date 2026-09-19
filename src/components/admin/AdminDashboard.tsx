"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COPY_FIELD_LABELS, COPY_GROUPS } from "@/lib/admin-labels";
import type { PersistMode } from "@/lib/content";
import type {
  CopyPairKey,
  ExperienceItem,
  Highlight,
  IntakeSubjectItem,
  PracticeArea,
  SiteContent,
  SiteCopy,
} from "@/lib/types";

type AdminDashboardProps = {
  initialContent: SiteContent;
  githubPersist: boolean;
};

type SectionId =
  | "identity"
  | "hero"
  | "bio"
  | "highlights"
  | "experience"
  | "credentials"
  | "practice"
  | "contact"
  | "cta"
  | "intake"
  | "copy";

const sections: { id: SectionId; label: string }[] = [
  { id: "identity", label: "الاسم والمسميات" },
  { id: "hero", label: "الصفحة الأولى" },
  { id: "bio", label: "النبذة" },
  { id: "highlights", label: "الملامح" },
  { id: "experience", label: "المسار المهني" },
  { id: "credentials", label: "التعليم والعضويات" },
  { id: "practice", label: "مجالات العمل" },
  { id: "contact", label: "التواصل" },
  { id: "cta", label: "زر التواصل" },
  { id: "intake", label: "موضوعات لوحة الطلب" },
  { id: "copy", label: "نصوص الموقع كلها" },
];

function Field({
  label,
  value,
  onChange,
  multiline = false,
  dir,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  dir?: "rtl" | "ltr";
  type?: string;
}) {
  const shared = {
    className:
      "w-full border border-navy/15 bg-white px-3 py-2 text-sm text-ink",
    value,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    dir,
  };

  return (
    <label className="grid gap-1.5 text-sm text-navy">
      <span className="font-medium">{label}</span>
      {multiline ? (
        <textarea rows={6} {...shared} />
      ) : (
        <input type={type} {...shared} />
      )}
    </label>
  );
}

function PairFields({
  label,
  arValue,
  enValue,
  onAr,
  onEn,
  multiline = false,
}: {
  label: string;
  arValue: string;
  enValue: string;
  onAr: (value: string) => void;
  onEn: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field
        label={`${label} (عربي)`}
        value={arValue}
        onChange={onAr}
        multiline={multiline}
        dir="rtl"
      />
      <Field
        label={`${label} (English)`}
        value={enValue}
        onChange={onEn}
        multiline={multiline}
      />
    </div>
  );
}

export function AdminDashboard({
  initialContent,
  githubPersist,
}: AdminDashboardProps) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [section, setSection] = useState<SectionId>("identity");
  const [status, setStatus] = useState("");
  const [persist, setPersist] = useState<PersistMode | "">("");
  const [saving, setSaving] = useState(false);

  const persistNote = useMemo(() => {
    if (persist === "file") {
      return "تم الحفظ في ملف المحتوى. حدّث الصفحة العامة لترى التغيير.";
    }
    if (persist === "github") {
      return "تم الحفظ. سيظهر التحديث بعد إعادة النشر.";
    }
    if (persist === "ephemeral") {
      return "حُفظ مؤقتاً في هذه الجلسة. حمّل الملف واحفظه إن لزم.";
    }
    return githubPersist
      ? "الحفظ يحدّث ملف المحتوى."
      : "الحفظ يكتب ملف المحتوى على هذا الجهاز.";
  }, [persist, githubPersist]);

  function updateIdentity(key: keyof SiteContent["identity"], value: string) {
    setContent((current) => ({
      ...current,
      identity: { ...current.identity, [key]: value },
    }));
  }

  function updateHero(key: keyof SiteContent["hero"], value: string) {
    setContent((current) => ({
      ...current,
      hero: { ...current.hero, [key]: value },
    }));
  }

  function updateBio(key: keyof SiteContent["bio"], value: string) {
    setContent((current) => ({
      ...current,
      bio: { ...current.bio, [key]: value },
    }));
  }

  function updateCopy(key: keyof SiteCopy, value: string) {
    setContent((current) => ({
      ...current,
      copy: { ...current.copy, [key]: value },
    }));
  }

  function updatePractice(index: number, patch: Partial<PracticeArea>) {
    setContent((current) => ({
      ...current,
      practiceAreas: current.practiceAreas.map((area, i) =>
        i === index ? { ...area, ...patch } : area,
      ),
    }));
  }

  function updateHighlight(index: number, patch: Partial<Highlight>) {
    setContent((current) => ({
      ...current,
      highlights: current.highlights.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addHighlight() {
    setContent((current) => ({
      ...current,
      highlights: [
        ...current.highlights,
        {
          id: `highlight-${crypto.randomUUID()}`,
          titleAr: "",
          titleEn: "",
          textAr: "",
          textEn: "",
        },
      ],
    }));
  }

  function removeHighlight(index: number) {
    setContent((current) => ({
      ...current,
      highlights: current.highlights.filter((_, i) => i !== index),
    }));
  }

  function updateExperience(index: number, patch: Partial<ExperienceItem>) {
    setContent((current) => ({
      ...current,
      experience: current.experience.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addExperience() {
    setContent((current) => ({
      ...current,
      experience: [
        ...current.experience,
        {
          id: `role-${crypto.randomUUID()}`,
          periodAr: "",
          periodEn: "",
          titleAr: "",
          titleEn: "",
          descriptionAr: "",
          descriptionEn: "",
        },
      ],
    }));
  }

  function removeExperience(index: number) {
    setContent((current) => ({
      ...current,
      experience: current.experience.filter((_, i) => i !== index),
    }));
  }

  function addPractice() {
    setContent((current) => ({
      ...current,
      practiceAreas: [
        ...current.practiceAreas,
        {
          id: `area-${crypto.randomUUID()}`,
          titleAr: "",
          titleEn: "",
          descriptionAr: "",
          descriptionEn: "",
        },
      ],
    }));
  }

  function removePractice(index: number) {
    setContent((current) => ({
      ...current,
      practiceAreas: current.practiceAreas.filter((_, i) => i !== index),
    }));
  }

  function movePractice(index: number, direction: -1 | 1) {
    setContent((current) => {
      const next = [...current.practiceAreas];
      const target = index + direction;
      if (target < 0 || target >= next.length) {
        return current;
      }
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return { ...current, practiceAreas: next };
    });
  }

  function updateSubject(index: number, patch: Partial<IntakeSubjectItem>) {
    setContent((current) => ({
      ...current,
      intakeSubjects: current.intakeSubjects.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addSubject() {
    setContent((current) => ({
      ...current,
      intakeSubjects: [
        ...current.intakeSubjects,
        {
          id: `subject-${crypto.randomUUID()}`,
          labelAr: "",
          labelEn: "",
        },
      ],
    }));
  }

  function removeSubject(index: number) {
    setContent((current) => ({
      ...current,
      intakeSubjects: current.intakeSubjects.filter((_, i) => i !== index),
    }));
  }

  async function save() {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = (await response.json().catch(() => null)) as {
        persist?: PersistMode;
        error?: string;
      } | null;
      if (!response.ok) {
        setStatus(data?.error || "تعذّر الحفظ.");
        return;
      }
      setPersist(data?.persist || "file");
      setStatus("تم الحفظ.");
      router.refresh();
    } catch {
      setStatus("تعذّر الحفظ.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
    router.refresh();
  }

  function downloadJson() {
    const blob = new Blob([`${JSON.stringify(content, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "site.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-ivory text-ink" dir="rtl">
      <header className="border-b border-gold/30 bg-navy text-ivory">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <h1 className="font-display text-2xl">تعديل نصوص الموقع</h1>
            <p className="mt-1 text-xs text-gold-pale">خاص بك — لا يظهر للزوار</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="border border-gold/40 px-3 py-2 text-sm text-ivory"
            >
              عرض الموقع
            </Link>
            <button
              type="button"
              onClick={downloadJson}
              className="border border-gold/40 px-3 py-2 text-sm"
            >
              تنزيل الملف
            </button>
            <button
              type="button"
              onClick={logout}
              className="border border-gold/40 px-3 py-2 text-sm"
            >
              خروج
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="bg-gold px-4 py-2 text-sm text-navy-deep disabled:opacity-60"
            >
              {saving ? "جاري الحفظ…" : "حفظ التغييرات"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-col gap-1" aria-label="أقسام التعديل">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`px-3 py-2 text-start text-sm ${
                section === item.id
                  ? "bg-navy text-ivory"
                  : "bg-white text-navy hover:bg-gold-pale/40"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          <p className="border border-gold/30 bg-gold-pale/40 px-4 py-3 text-sm leading-6 text-navy">
            {persistNote}
            {status ? ` ${status}` : ""}
          </p>

          {section === "identity" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">الاسم والمسميات</h2>
              <PairFields
                label="الاسم الكامل"
                arValue={content.identity.nameAr}
                enValue={content.identity.nameEn}
                onAr={(value) => updateIdentity("nameAr", value)}
                onEn={(value) => updateIdentity("nameEn", value)}
              />
              <PairFields
                label="الاسم المختصر في أعلى الصفحة"
                arValue={content.identity.shortNameAr}
                enValue={content.identity.shortNameEn}
                onAr={(value) => updateIdentity("shortNameAr", value)}
                onEn={(value) => updateIdentity("shortNameEn", value)}
              />
              <Field
                label="الحرفان في المربع الذهبي"
                value={content.identity.monogram}
                onChange={(value) => updateIdentity("monogram", value)}
              />
              <PairFields
                label="المسمى"
                arValue={content.identity.titleAr}
                enValue={content.identity.titleEn}
                onAr={(value) => updateIdentity("titleAr", value)}
                onEn={(value) => updateIdentity("titleEn", value)}
              />
              <PairFields
                label="الجهة أو القطاع (بدون اسم شركة)"
                arValue={content.identity.organizationAr}
                enValue={content.identity.organizationEn}
                onAr={(value) => updateIdentity("organizationAr", value)}
                onEn={(value) => updateIdentity("organizationEn", value)}
              />
              <PairFields
                label="المقر"
                arValue={content.identity.locationAr}
                enValue={content.identity.locationEn}
                onAr={(value) => updateIdentity("locationAr", value)}
                onEn={(value) => updateIdentity("locationEn", value)}
              />
            </section>
          ) : null}

          {section === "hero" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">الصفحة الأولى</h2>
              <PairFields
                label="السطر الصغير فوق الاسم"
                arValue={content.hero.eyebrowAr}
                enValue={content.hero.eyebrowEn}
                onAr={(value) => updateHero("eyebrowAr", value)}
                onEn={(value) => updateHero("eyebrowEn", value)}
              />
              <PairFields
                label="العنوان الكبير"
                arValue={content.hero.headlineAr}
                enValue={content.hero.headlineEn}
                onAr={(value) => updateHero("headlineAr", value)}
                onEn={(value) => updateHero("headlineEn", value)}
              />
              <PairFields
                label="النص القصير تحت العنوان"
                arValue={content.hero.subheadlineAr}
                enValue={content.hero.subheadlineEn}
                onAr={(value) => updateHero("subheadlineAr", value)}
                onEn={(value) => updateHero("subheadlineEn", value)}
                multiline
              />
            </section>
          ) : null}

          {section === "bio" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">النبذة</h2>
              <PairFields
                label="نبذة قصيرة (الصفحة الأولى)"
                arValue={content.bio.shortAr}
                enValue={content.bio.shortEn}
                onAr={(value) => updateBio("shortAr", value)}
                onEn={(value) => updateBio("shortEn", value)}
                multiline
              />
              <PairFields
                label="نبذة صفحة «نبذة»"
                arValue={content.bio.longAr}
                enValue={content.bio.longEn}
                onAr={(value) => updateBio("longAr", value)}
                onEn={(value) => updateBio("longEn", value)}
                multiline
              />
            </section>
          ) : null}

          {section === "highlights" ? (
            <section className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-navy">الملامح</h2>
                <button
                  type="button"
                  onClick={addHighlight}
                  className="bg-navy px-3 py-2 text-sm text-ivory"
                >
                  إضافة ملمح
                </button>
              </div>
              <p className="text-sm text-muted">
                جمل قصيرة. لا تضف أرقاماً ولا أسماء جهات عمل.
              </p>
              {content.highlights.map((item, index) => (
                <article key={item.id} className="grid gap-3 bg-white p-5">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted">ملمح {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="border border-red-300 px-2 py-1 text-xs text-red-800"
                    >
                      حذف
                    </button>
                  </div>
                  <PairFields
                    label="العنوان"
                    arValue={item.titleAr}
                    enValue={item.titleEn}
                    onAr={(value) => updateHighlight(index, { titleAr: value })}
                    onEn={(value) => updateHighlight(index, { titleEn: value })}
                  />
                  <PairFields
                    label="النص"
                    arValue={item.textAr}
                    enValue={item.textEn}
                    onAr={(value) => updateHighlight(index, { textAr: value })}
                    onEn={(value) => updateHighlight(index, { textEn: value })}
                    multiline
                  />
                </article>
              ))}
            </section>
          ) : null}

          {section === "experience" ? (
            <section className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-navy">المسار المهني</h2>
                <button
                  type="button"
                  onClick={addExperience}
                  className="bg-navy px-3 py-2 text-sm text-ivory"
                >
                  إضافة مرحلة
                </button>
              </div>
              <p className="text-sm text-muted">
                اكتب المسمّى والقطاع فقط. لا تذكر اسم شركة أو مكتب.
              </p>
              {content.experience.map((item, index) => (
                <article key={item.id} className="grid gap-3 bg-white p-5">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted">مرحلة {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="border border-red-300 px-2 py-1 text-xs text-red-800"
                    >
                      حذف
                    </button>
                  </div>
                  <PairFields
                    label="الفترة"
                    arValue={item.periodAr}
                    enValue={item.periodEn}
                    onAr={(value) => updateExperience(index, { periodAr: value })}
                    onEn={(value) => updateExperience(index, { periodEn: value })}
                  />
                  <PairFields
                    label="المسمّى"
                    arValue={item.titleAr}
                    enValue={item.titleEn}
                    onAr={(value) => updateExperience(index, { titleAr: value })}
                    onEn={(value) => updateExperience(index, { titleEn: value })}
                  />
                  <PairFields
                    label="الوصف"
                    arValue={item.descriptionAr}
                    enValue={item.descriptionEn}
                    onAr={(value) =>
                      updateExperience(index, { descriptionAr: value })
                    }
                    onEn={(value) =>
                      updateExperience(index, { descriptionEn: value })
                    }
                    multiline
                  />
                </article>
              ))}
            </section>
          ) : null}

          {section === "credentials" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">
                التعليم والعضويات
              </h2>
              <PairFields
                label="التعليم"
                arValue={content.credentials.educationAr}
                enValue={content.credentials.educationEn}
                onAr={(value) =>
                  setContent((current) => ({
                    ...current,
                    credentials: { ...current.credentials, educationAr: value },
                  }))
                }
                onEn={(value) =>
                  setContent((current) => ({
                    ...current,
                    credentials: { ...current.credentials, educationEn: value },
                  }))
                }
                multiline
              />
              <PairFields
                label="العضويات"
                arValue={content.credentials.membershipsAr}
                enValue={content.credentials.membershipsEn}
                onAr={(value) =>
                  setContent((current) => ({
                    ...current,
                    credentials: {
                      ...current.credentials,
                      membershipsAr: value,
                    },
                  }))
                }
                onEn={(value) =>
                  setContent((current) => ({
                    ...current,
                    credentials: {
                      ...current.credentials,
                      membershipsEn: value,
                    },
                  }))
                }
                multiline
              />
              <PairFields
                label="اللغات"
                arValue={content.credentials.languagesAr}
                enValue={content.credentials.languagesEn}
                onAr={(value) =>
                  setContent((current) => ({
                    ...current,
                    credentials: { ...current.credentials, languagesAr: value },
                  }))
                }
                onEn={(value) =>
                  setContent((current) => ({
                    ...current,
                    credentials: { ...current.credentials, languagesEn: value },
                  }))
                }
              />
            </section>
          ) : null}

          {section === "practice" ? (
            <section className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-navy">مجالات العمل</h2>
                <button
                  type="button"
                  onClick={addPractice}
                  className="bg-navy px-3 py-2 text-sm text-ivory"
                >
                  إضافة مجال
                </button>
              </div>
              {content.practiceAreas.map((area, index) => (
                <article key={area.id} className="grid gap-3 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-muted">مجال {index + 1}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => movePractice(index, -1)}
                        className="border border-navy/20 px-2 py-1 text-xs"
                      >
                        أعلى
                      </button>
                      <button
                        type="button"
                        onClick={() => movePractice(index, 1)}
                        className="border border-navy/20 px-2 py-1 text-xs"
                      >
                        أسفل
                      </button>
                      <button
                        type="button"
                        onClick={() => removePractice(index)}
                        className="border border-red-300 px-2 py-1 text-xs text-red-800"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <PairFields
                    label="العنوان"
                    arValue={area.titleAr}
                    enValue={area.titleEn}
                    onAr={(value) => updatePractice(index, { titleAr: value })}
                    onEn={(value) => updatePractice(index, { titleEn: value })}
                  />
                  <PairFields
                    label="الوصف"
                    arValue={area.descriptionAr}
                    enValue={area.descriptionEn}
                    onAr={(value) =>
                      updatePractice(index, { descriptionAr: value })
                    }
                    onEn={(value) =>
                      updatePractice(index, { descriptionEn: value })
                    }
                    multiline
                  />
                </article>
              ))}
            </section>
          ) : null}

          {section === "contact" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">التواصل</h2>
              <Field
                label="البريد الإلكتروني"
                type="email"
                value={content.contact.email}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    contact: { ...current.contact, email: value },
                  }))
                }
              />
              <Field
                label="رقم الهاتف"
                value={content.contact.phone}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    contact: { ...current.contact, phone: value },
                  }))
                }
              />
              <Field
                label="رابط لينكدإن (اختياري)"
                value={content.contact.linkedin}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    contact: { ...current.contact, linkedin: value },
                    social: { ...current.social, linkedin: value },
                  }))
                }
              />
              <PairFields
                label="العنوان الظاهر للزائر"
                arValue={content.contact.addressAr}
                enValue={content.contact.addressEn}
                onAr={(value) =>
                  setContent((current) => ({
                    ...current,
                    contact: { ...current.contact, addressAr: value },
                  }))
                }
                onEn={(value) =>
                  setContent((current) => ({
                    ...current,
                    contact: { ...current.contact, addressEn: value },
                  }))
                }
              />
              <Field
                label="رابط خدمة النماذج المجانية (اختياري)"
                value={content.contact.formspreeEndpoint}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    contact: { ...current.contact, formspreeEndpoint: value },
                  }))
                }
              />
              <Field
                label="رابط X (اختياري)"
                value={content.social.x}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    social: { ...current.social, x: value },
                  }))
                }
              />
              <Field
                label="موقع آخر (اختياري)"
                value={content.social.website}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    social: { ...current.social, website: value },
                  }))
                }
              />
            </section>
          ) : null}

          {section === "cta" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">زر التواصل</h2>
              <PairFields
                label="نص الزر"
                arValue={content.cta.labelAr}
                enValue={content.cta.labelEn}
                onAr={(value) =>
                  setContent((current) => ({
                    ...current,
                    cta: { ...current.cta, labelAr: value },
                  }))
                }
                onEn={(value) =>
                  setContent((current) => ({
                    ...current,
                    cta: { ...current.cta, labelEn: value },
                  }))
                }
              />
              <PairFields
                label="الجملة بجانب الزر"
                arValue={content.cta.textAr}
                enValue={content.cta.textEn}
                onAr={(value) =>
                  setContent((current) => ({
                    ...current,
                    cta: { ...current.cta, textAr: value },
                  }))
                }
                onEn={(value) =>
                  setContent((current) => ({
                    ...current,
                    cta: { ...current.cta, textEn: value },
                  }))
                }
                multiline
              />
            </section>
          ) : null}

          {section === "intake" ? (
            <section className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-navy">
                  موضوعات لوحة الطلب
                </h2>
                <button
                  type="button"
                  onClick={addSubject}
                  className="bg-navy px-3 py-2 text-sm text-ivory"
                >
                  إضافة موضوع
                </button>
              </div>
              {content.intakeSubjects.map((item, index) => (
                <article key={item.id} className="grid gap-3 bg-white p-5">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted">موضوع {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="border border-red-300 px-2 py-1 text-xs text-red-800"
                    >
                      حذف
                    </button>
                  </div>
                  <PairFields
                    label="اسم الموضوع في القائمة"
                    arValue={item.labelAr}
                    enValue={item.labelEn}
                    onAr={(value) => updateSubject(index, { labelAr: value })}
                    onEn={(value) => updateSubject(index, { labelEn: value })}
                  />
                </article>
              ))}
            </section>
          ) : null}

          {section === "copy" ? (
            <section className="grid gap-8">
              <div>
                <h2 className="font-display text-2xl text-navy">
                  نصوص الموقع كلها
                </h2>
                <p className="mt-2 text-sm text-muted">
                  هنا تعدّل عناوين القوائم والأزرار والنماذج والإخلاء ورسائل النجاح.
                </p>
              </div>
              {COPY_GROUPS.map((group) => (
                <div key={group.title} className="grid gap-4 bg-white p-6">
                  <h3 className="text-lg text-navy">{group.title}</h3>
                  {group.keys.map((key: CopyPairKey) => (
                    <PairFields
                      key={key}
                      label={COPY_FIELD_LABELS[key]}
                      arValue={content.copy[`${key}Ar`]}
                      enValue={content.copy[`${key}En`]}
                      onAr={(value) => updateCopy(`${key}Ar`, value)}
                      onEn={(value) => updateCopy(`${key}En`, value)}
                      multiline={
                        key === "disclaimer" ||
                        key === "approachText" ||
                        key === "intakeIntro" ||
                        key === "practiceIntro" ||
                        key === "formMailtoHint" ||
                        key === "formSuccess" ||
                        key === "formError"
                      }
                    />
                  ))}
                </div>
              ))}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
