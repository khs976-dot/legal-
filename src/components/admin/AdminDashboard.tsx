"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COPY_FIELD_LABELS, COPY_GROUPS } from "@/lib/admin-labels";
import type { PersistMode } from "@/lib/content";
import type {
  Chip,
  CopyPairKey,
  Highlight,
  SiteContent,
  SiteCopy,
} from "@/lib/types";

type SectionId = "identity" | "hero" | "bio" | "chips" | "highlights" | "cta" | "contact" | "copy";

const sections: { id: SectionId; label: string }[] = [
  { id: "identity", label: "الاسم" },
  { id: "hero", label: "المقدمة" },
  { id: "bio", label: "النبذة" },
  { id: "chips", label: "الشريط المختصر" },
  { id: "highlights", label: "الملامح" },
  { id: "cta", label: "دعوة التواصل" },
  { id: "contact", label: "بيانات التواصل" },
  { id: "copy", label: "نصوص الصفحة" },
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
    className: "w-full border border-navy/15 bg-white px-3 py-2 text-sm text-ink",
    value,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    dir,
  };

  return (
    <label className="grid gap-1.5 text-sm text-navy">
      <span className="font-medium">{label}</span>
      {multiline ? <textarea rows={5} {...shared} /> : <input type={type} {...shared} />}
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
      <Field label={`${label} (عربي)`} value={arValue} onChange={onAr} multiline={multiline} dir="rtl" />
      <Field label={`${label} (English)`} value={enValue} onChange={onEn} multiline={multiline} />
    </div>
  );
}

export function AdminDashboard({
  initialContent,
  githubPersist,
}: {
  initialContent: SiteContent;
  githubPersist: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [section, setSection] = useState<SectionId>("identity");
  const [status, setStatus] = useState("");
  const [persist, setPersist] = useState<PersistMode | "">("");
  const [saving, setSaving] = useState(false);

  const persistNote = useMemo(() => {
    if (persist === "file") {
      return "تم الحفظ. حدّث الصفحة العامة لترى التغيير.";
    }
    if (persist === "github") {
      return "تم الحفظ.";
    }
    if (persist === "ephemeral") {
      return "حُفظ مؤقتاً. حمّل الملف إن لزم.";
    }
    return githubPersist
      ? "الحفظ يحدّث ملف المحتوى."
      : "الحفظ يكتب ملف المحتوى على هذا الجهاز.";
  }, [persist, githubPersist]);

  function updateCopy(key: keyof SiteCopy, value: string) {
    setContent((current) => ({
      ...current,
      copy: { ...current.copy, [key]: value },
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
            <h1 className="font-display text-2xl">تعديل الصفحة</h1>
            <p className="mt-1 text-xs text-gold-pale">خاص بك — لا يظهر للزوار</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="border border-gold/40 px-3 py-2 text-sm text-ivory">
              عرض الموقع
            </Link>
            <button type="button" onClick={downloadJson} className="border border-gold/40 px-3 py-2 text-sm">
              تنزيل الملف
            </button>
            <button type="button" onClick={logout} className="border border-gold/40 px-3 py-2 text-sm">
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
                section === item.id ? "bg-navy text-ivory" : "bg-white text-navy hover:bg-gold-pale/40"
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
              <h2 className="font-display text-2xl text-navy">الاسم</h2>
              <PairFields
                label="الاسم الكامل"
                arValue={content.identity.nameAr}
                enValue={content.identity.nameEn}
                onAr={(value) =>
                  setContent((c) => ({ ...c, identity: { ...c.identity, nameAr: value } }))
                }
                onEn={(value) =>
                  setContent((c) => ({ ...c, identity: { ...c.identity, nameEn: value } }))
                }
              />
              <PairFields
                label="الاسم المختصر"
                arValue={content.identity.shortNameAr}
                enValue={content.identity.shortNameEn}
                onAr={(value) =>
                  setContent((c) => ({ ...c, identity: { ...c.identity, shortNameAr: value } }))
                }
                onEn={(value) =>
                  setContent((c) => ({ ...c, identity: { ...c.identity, shortNameEn: value } }))
                }
              />
              <Field
                label="الحرفان في المربع"
                value={content.identity.monogram}
                onChange={(value) =>
                  setContent((c) => ({ ...c, identity: { ...c.identity, monogram: value } }))
                }
              />
              <PairFields
                label="المسمّى"
                arValue={content.identity.titleAr}
                enValue={content.identity.titleEn}
                onAr={(value) =>
                  setContent((c) => ({ ...c, identity: { ...c.identity, titleAr: value } }))
                }
                onEn={(value) =>
                  setContent((c) => ({ ...c, identity: { ...c.identity, titleEn: value } }))
                }
              />
              <PairFields
                label="المقر"
                arValue={content.identity.locationAr}
                enValue={content.identity.locationEn}
                onAr={(value) =>
                  setContent((c) => ({ ...c, identity: { ...c.identity, locationAr: value } }))
                }
                onEn={(value) =>
                  setContent((c) => ({ ...c, identity: { ...c.identity, locationEn: value } }))
                }
              />
            </section>
          ) : null}

          {section === "hero" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">المقدمة</h2>
              <PairFields
                label="السطر الصغير"
                arValue={content.hero.eyebrowAr}
                enValue={content.hero.eyebrowEn}
                onAr={(value) => setContent((c) => ({ ...c, hero: { ...c.hero, eyebrowAr: value } }))}
                onEn={(value) => setContent((c) => ({ ...c, hero: { ...c.hero, eyebrowEn: value } }))}
              />
              <PairFields
                label="الاسم الكبير"
                arValue={content.hero.headlineAr}
                enValue={content.hero.headlineEn}
                onAr={(value) => setContent((c) => ({ ...c, hero: { ...c.hero, headlineAr: value } }))}
                onEn={(value) => setContent((c) => ({ ...c, hero: { ...c.hero, headlineEn: value } }))}
              />
              <PairFields
                label="الجملة القصيرة"
                arValue={content.hero.subheadlineAr}
                enValue={content.hero.subheadlineEn}
                onAr={(value) =>
                  setContent((c) => ({ ...c, hero: { ...c.hero, subheadlineAr: value } }))
                }
                onEn={(value) =>
                  setContent((c) => ({ ...c, hero: { ...c.hero, subheadlineEn: value } }))
                }
                multiline
              />
            </section>
          ) : null}

          {section === "bio" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">النبذة</h2>
              <PairFields
                label="فقرة قصيرة"
                arValue={content.bio.shortAr}
                enValue={content.bio.shortEn}
                onAr={(value) => setContent((c) => ({ ...c, bio: { ...c.bio, shortAr: value } }))}
                onEn={(value) => setContent((c) => ({ ...c, bio: { ...c.bio, shortEn: value } }))}
                multiline
              />
            </section>
          ) : null}

          {section === "chips" ? (
            <section className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-navy">الشريط المختصر</h2>
                <button
                  type="button"
                  className="bg-navy px-3 py-2 text-sm text-ivory"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      chips: [
                        ...c.chips,
                        { id: `chip-${crypto.randomUUID()}`, labelAr: "", labelEn: "" },
                      ],
                    }))
                  }
                >
                  إضافة شريحة
                </button>
              </div>
              {content.chips.map((item: Chip, index) => (
                <article key={item.id} className="grid gap-3 bg-white p-5">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted">شريحة {index + 1}</p>
                    <button
                      type="button"
                      className="border border-red-300 px-2 py-1 text-xs text-red-800"
                      onClick={() =>
                        setContent((c) => ({
                          ...c,
                          chips: c.chips.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      حذف
                    </button>
                  </div>
                  <PairFields
                    label="النص"
                    arValue={item.labelAr}
                    enValue={item.labelEn}
                    onAr={(value) =>
                      setContent((c) => ({
                        ...c,
                        chips: c.chips.map((chip, i) =>
                          i === index ? { ...chip, labelAr: value } : chip,
                        ),
                      }))
                    }
                    onEn={(value) =>
                      setContent((c) => ({
                        ...c,
                        chips: c.chips.map((chip, i) =>
                          i === index ? { ...chip, labelEn: value } : chip,
                        ),
                      }))
                    }
                  />
                </article>
              ))}
            </section>
          ) : null}

          {section === "highlights" ? (
            <section className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-navy">الملامح</h2>
                <button
                  type="button"
                  className="bg-navy px-3 py-2 text-sm text-ivory"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      highlights: [
                        ...c.highlights,
                        {
                          id: `highlight-${crypto.randomUUID()}`,
                          titleAr: "",
                          titleEn: "",
                          textAr: "",
                          textEn: "",
                        },
                      ],
                    }))
                  }
                >
                  إضافة ملمح
                </button>
              </div>
              {content.highlights.map((item: Highlight, index) => (
                <article key={item.id} className="grid gap-3 bg-white p-5">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted">ملمح {index + 1}</p>
                    <button
                      type="button"
                      className="border border-red-300 px-2 py-1 text-xs text-red-800"
                      onClick={() =>
                        setContent((c) => ({
                          ...c,
                          highlights: c.highlights.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      حذف
                    </button>
                  </div>
                  <PairFields
                    label="العنوان"
                    arValue={item.titleAr}
                    enValue={item.titleEn}
                    onAr={(value) =>
                      setContent((c) => ({
                        ...c,
                        highlights: c.highlights.map((row, i) =>
                          i === index ? { ...row, titleAr: value } : row,
                        ),
                      }))
                    }
                    onEn={(value) =>
                      setContent((c) => ({
                        ...c,
                        highlights: c.highlights.map((row, i) =>
                          i === index ? { ...row, titleEn: value } : row,
                        ),
                      }))
                    }
                  />
                  <PairFields
                    label="النص"
                    arValue={item.textAr}
                    enValue={item.textEn}
                    onAr={(value) =>
                      setContent((c) => ({
                        ...c,
                        highlights: c.highlights.map((row, i) =>
                          i === index ? { ...row, textAr: value } : row,
                        ),
                      }))
                    }
                    onEn={(value) =>
                      setContent((c) => ({
                        ...c,
                        highlights: c.highlights.map((row, i) =>
                          i === index ? { ...row, textEn: value } : row,
                        ),
                      }))
                    }
                    multiline
                  />
                </article>
              ))}
            </section>
          ) : null}

          {section === "cta" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">دعوة التواصل</h2>
              <PairFields
                label="نص الزر"
                arValue={content.cta.labelAr}
                enValue={content.cta.labelEn}
                onAr={(value) => setContent((c) => ({ ...c, cta: { ...c.cta, labelAr: value } }))}
                onEn={(value) => setContent((c) => ({ ...c, cta: { ...c.cta, labelEn: value } }))}
              />
              <PairFields
                label="الجملة"
                arValue={content.cta.textAr}
                enValue={content.cta.textEn}
                onAr={(value) => setContent((c) => ({ ...c, cta: { ...c.cta, textAr: value } }))}
                onEn={(value) => setContent((c) => ({ ...c, cta: { ...c.cta, textEn: value } }))}
                multiline
              />
            </section>
          ) : null}

          {section === "contact" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">بيانات التواصل</h2>
              <Field
                label="البريد"
                type="email"
                value={content.contact.email}
                onChange={(value) =>
                  setContent((c) => ({ ...c, contact: { ...c.contact, email: value } }))
                }
              />
              <Field
                label="الهاتف"
                value={content.contact.phone}
                onChange={(value) =>
                  setContent((c) => ({ ...c, contact: { ...c.contact, phone: value } }))
                }
              />
              <PairFields
                label="العنوان الظاهر"
                arValue={content.contact.addressAr}
                enValue={content.contact.addressEn}
                onAr={(value) =>
                  setContent((c) => ({ ...c, contact: { ...c.contact, addressAr: value } }))
                }
                onEn={(value) =>
                  setContent((c) => ({ ...c, contact: { ...c.contact, addressEn: value } }))
                }
              />
              <Field
                label="رابط خدمة النماذج المجانية (اختياري)"
                value={content.contact.formspreeEndpoint}
                onChange={(value) =>
                  setContent((c) => ({
                    ...c,
                    contact: { ...c.contact, formspreeEndpoint: value },
                  }))
                }
              />
            </section>
          ) : null}

          {section === "copy" ? (
            <section className="grid gap-8">
              <div>
                <h2 className="font-display text-2xl text-navy">نصوص الصفحة</h2>
                <p className="mt-2 text-sm text-muted">
                  عناوين الأقسام، حقول النموذج، ورسائل النجاح. الموضوع حقل حر يكتبه الزائر.
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
                        key === "inquiryIntro" ||
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
