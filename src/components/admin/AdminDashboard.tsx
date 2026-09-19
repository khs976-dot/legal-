"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PersistMode } from "@/lib/content";
import type { ExperienceItem, Highlight, PracticeArea, SiteContent } from "@/lib/types";

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
  | "cta";

const sections: { id: SectionId; label: string }[] = [
  { id: "identity", label: "Name & titles" },
  { id: "hero", label: "Hero text" },
  { id: "bio", label: "Biography" },
  { id: "highlights", label: "Soft highlights" },
  { id: "experience", label: "Professional path" },
  { id: "credentials", label: "Education & memberships" },
  { id: "practice", label: "Practice areas" },
  { id: "contact", label: "Contact & social" },
  { id: "cta", label: "Call to action" },
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
      return "Saved to content/site.json. Refresh the public pages to see the update.";
    }
    if (persist === "github") {
      return "Saved and committed to GitHub. Vercel will republish the site shortly.";
    }
    if (persist === "ephemeral") {
      return "Saved in this server session only. On Vercel the disk is read-only — download the JSON and commit it, or add GITHUB_TOKEN (see README).";
    }
    return githubPersist
      ? "Saves will commit content/site.json to GitHub."
      : "Locally, saves write content/site.json. On Vercel, add GITHUB_TOKEN for durable live edits.";
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
        setStatus(data?.error || "Save failed.");
        return;
      }
      setPersist(data?.persist || "file");
      setStatus("Saved.");
      router.refresh();
    } catch {
      setStatus("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
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
    <div className="min-h-screen bg-ivory text-ink">
      <header className="border-b border-gold/30 bg-navy text-ivory">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-gold uppercase">
              Dashboard
            </p>
            <h1 className="font-display text-2xl">Edit site content</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="border border-gold/40 px-3 py-2 text-sm text-ivory"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={downloadJson}
              className="border border-gold/40 px-3 py-2 text-sm"
            >
              Download JSON
            </button>
            <button
              type="button"
              onClick={logout}
              className="border border-gold/40 px-3 py-2 text-sm"
            >
              Sign out
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="bg-gold px-4 py-2 text-sm text-navy-deep disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-col gap-1" aria-label="Content sections">
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
              <h2 className="font-display text-2xl text-navy">Name & titles</h2>
              <Field
                label="الاسم بالعربية"
                value={content.identity.nameAr}
                onChange={(value) => updateIdentity("nameAr", value)}
                dir="rtl"
              />
              <Field
                label="Name in English"
                value={content.identity.nameEn}
                onChange={(value) => updateIdentity("nameEn", value)}
              />
              <Field
                label="الاسم المختصر (عربي)"
                value={content.identity.shortNameAr}
                onChange={(value) => updateIdentity("shortNameAr", value)}
                dir="rtl"
              />
              <Field
                label="Short name (English)"
                value={content.identity.shortNameEn}
                onChange={(value) => updateIdentity("shortNameEn", value)}
              />
              <Field
                label="المسمى الوظيفي (عربي)"
                value={content.identity.titleAr}
                onChange={(value) => updateIdentity("titleAr", value)}
                dir="rtl"
              />
              <Field
                label="Title (English)"
                value={content.identity.titleEn}
                onChange={(value) => updateIdentity("titleEn", value)}
              />
              <Field
                label="الجهة (عربي)"
                value={content.identity.organizationAr}
                onChange={(value) => updateIdentity("organizationAr", value)}
                dir="rtl"
              />
              <Field
                label="Organisation (English)"
                value={content.identity.organizationEn}
                onChange={(value) => updateIdentity("organizationEn", value)}
              />
              <Field
                label="المقر (عربي)"
                value={content.identity.locationAr}
                onChange={(value) => updateIdentity("locationAr", value)}
                dir="rtl"
              />
              <Field
                label="Location (English)"
                value={content.identity.locationEn}
                onChange={(value) => updateIdentity("locationEn", value)}
              />
            </section>
          ) : null}

          {section === "hero" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">Hero text</h2>
              <Field
                label="سطر علوي (عربي)"
                value={content.hero.eyebrowAr}
                onChange={(value) => updateHero("eyebrowAr", value)}
                dir="rtl"
              />
              <Field
                label="Eyebrow (English)"
                value={content.hero.eyebrowEn}
                onChange={(value) => updateHero("eyebrowEn", value)}
              />
              <Field
                label="العنوان (عربي)"
                value={content.hero.headlineAr}
                onChange={(value) => updateHero("headlineAr", value)}
                dir="rtl"
              />
              <Field
                label="Headline (English)"
                value={content.hero.headlineEn}
                onChange={(value) => updateHero("headlineEn", value)}
              />
              <Field
                label="النص التعريفي (عربي)"
                value={content.hero.subheadlineAr}
                onChange={(value) => updateHero("subheadlineAr", value)}
                multiline
                dir="rtl"
              />
              <Field
                label="Sub-headline (English)"
                value={content.hero.subheadlineEn}
                onChange={(value) => updateHero("subheadlineEn", value)}
                multiline
              />
            </section>
          ) : null}

          {section === "bio" ? (
            <section className="grid gap-4 bg-white p-6">
              <h2 className="font-display text-2xl text-navy">Biography</h2>
              <Field
                label="نبذة قصيرة (عربي)"
                value={content.bio.shortAr}
                onChange={(value) => updateBio("shortAr", value)}
                multiline
                dir="rtl"
              />
              <Field
                label="Short bio (English)"
                value={content.bio.shortEn}
                onChange={(value) => updateBio("shortEn", value)}
                multiline
              />
              <Field
                label="نبذة مطوّلة (عربي)"
                value={content.bio.longAr}
                onChange={(value) => updateBio("longAr", value)}
                multiline
                dir="rtl"
              />
              <Field
                label="Long bio (English)"
                value={content.bio.longEn}
                onChange={(value) => updateBio("longEn", value)}
                multiline
              />
            </section>
          ) : null}

          {section === "highlights" ? (
            <section className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-navy">
                  Soft highlights
                </h2>
                <button
                  type="button"
                  onClick={addHighlight}
                  className="bg-navy px-3 py-2 text-sm text-ivory"
                >
                  Add highlight
                </button>
              </div>
              <p className="text-sm text-muted">
                Keep these general. Do not add transaction values, win rates, or
                employer names.
              </p>
              {content.highlights.map((item, index) => (
                <article key={item.id} className="grid gap-3 bg-white p-5">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted">Note {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="border border-red-300 px-2 py-1 text-xs text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <Field
                    label="العنوان (عربي)"
                    value={item.titleAr}
                    onChange={(value) =>
                      updateHighlight(index, { titleAr: value })
                    }
                    dir="rtl"
                  />
                  <Field
                    label="Title (English)"
                    value={item.titleEn}
                    onChange={(value) =>
                      updateHighlight(index, { titleEn: value })
                    }
                  />
                  <Field
                    label="النص (عربي)"
                    value={item.textAr}
                    onChange={(value) =>
                      updateHighlight(index, { textAr: value })
                    }
                    multiline
                    dir="rtl"
                  />
                  <Field
                    label="Text (English)"
                    value={item.textEn}
                    onChange={(value) =>
                      updateHighlight(index, { textEn: value })
                    }
                    multiline
                  />
                </article>
              ))}
            </section>
          ) : null}

          {section === "experience" ? (
            <section className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-navy">
                  Professional path
                </h2>
                <button
                  type="button"
                  onClick={addExperience}
                  className="bg-navy px-3 py-2 text-sm text-ivory"
                >
                  Add role
                </button>
              </div>
              <p className="text-sm text-muted">
                Describe roles by function and sector. Do not name employers or
                firms.
              </p>
              {content.experience.map((item, index) => (
                <article key={item.id} className="grid gap-3 bg-white p-5">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted">Role {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="border border-red-300 px-2 py-1 text-xs text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <Field
                    label="الفترة (عربي)"
                    value={item.periodAr}
                    onChange={(value) =>
                      updateExperience(index, { periodAr: value })
                    }
                    dir="rtl"
                  />
                  <Field
                    label="Period (English)"
                    value={item.periodEn}
                    onChange={(value) =>
                      updateExperience(index, { periodEn: value })
                    }
                  />
                  <Field
                    label="المسمى (عربي)"
                    value={item.titleAr}
                    onChange={(value) =>
                      updateExperience(index, { titleAr: value })
                    }
                    dir="rtl"
                  />
                  <Field
                    label="Title (English)"
                    value={item.titleEn}
                    onChange={(value) =>
                      updateExperience(index, { titleEn: value })
                    }
                  />
                  <Field
                    label="الوصف (عربي)"
                    value={item.descriptionAr}
                    onChange={(value) =>
                      updateExperience(index, { descriptionAr: value })
                    }
                    multiline
                    dir="rtl"
                  />
                  <Field
                    label="Description (English)"
                    value={item.descriptionEn}
                    onChange={(value) =>
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
                Education & memberships
              </h2>
              <Field
                label="التعليم (عربي)"
                value={content.credentials.educationAr}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    credentials: {
                      ...current.credentials,
                      educationAr: value,
                    },
                  }))
                }
                multiline
                dir="rtl"
              />
              <Field
                label="Education (English)"
                value={content.credentials.educationEn}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    credentials: {
                      ...current.credentials,
                      educationEn: value,
                    },
                  }))
                }
                multiline
              />
              <Field
                label="العضويات (عربي)"
                value={content.credentials.membershipsAr}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    credentials: {
                      ...current.credentials,
                      membershipsAr: value,
                    },
                  }))
                }
                multiline
                dir="rtl"
              />
              <Field
                label="Memberships (English)"
                value={content.credentials.membershipsEn}
                onChange={(value) =>
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
              <Field
                label="اللغات (عربي)"
                value={content.credentials.languagesAr}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    credentials: {
                      ...current.credentials,
                      languagesAr: value,
                    },
                  }))
                }
                dir="rtl"
              />
              <Field
                label="Languages (English)"
                value={content.credentials.languagesEn}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    credentials: {
                      ...current.credentials,
                      languagesEn: value,
                    },
                  }))
                }
              />
            </section>
          ) : null}

          {section === "practice" ? (
            <section className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-navy">
                  Practice areas
                </h2>
                <button
                  type="button"
                  onClick={addPractice}
                  className="bg-navy px-3 py-2 text-sm text-ivory"
                >
                  Add area
                </button>
              </div>
              {content.practiceAreas.map((area, index) => (
                <article key={area.id} className="grid gap-3 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-muted">Area {index + 1}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => movePractice(index, -1)}
                        className="border border-navy/20 px-2 py-1 text-xs"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => movePractice(index, 1)}
                        className="border border-navy/20 px-2 py-1 text-xs"
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() => removePractice(index)}
                        className="border border-red-300 px-2 py-1 text-xs text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <Field
                    label="العنوان (عربي)"
                    value={area.titleAr}
                    onChange={(value) => updatePractice(index, { titleAr: value })}
                    dir="rtl"
                  />
                  <Field
                    label="Title (English)"
                    value={area.titleEn}
                    onChange={(value) => updatePractice(index, { titleEn: value })}
                  />
                  <Field
                    label="الوصف (عربي)"
                    value={area.descriptionAr}
                    onChange={(value) =>
                      updatePractice(index, { descriptionAr: value })
                    }
                    multiline
                    dir="rtl"
                  />
                  <Field
                    label="Description (English)"
                    value={area.descriptionEn}
                    onChange={(value) =>
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
              <h2 className="font-display text-2xl text-navy">
                Contact & social
              </h2>
              <Field
                label="Email"
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
                label="Phone"
                value={content.contact.phone}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    contact: { ...current.contact, phone: value },
                  }))
                }
              />
              <Field
                label="LinkedIn URL"
                value={content.contact.linkedin}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    contact: { ...current.contact, linkedin: value },
                    social: { ...current.social, linkedin: value },
                  }))
                }
              />
              <Field
                label="العنوان (عربي)"
                value={content.contact.addressAr}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    contact: { ...current.contact, addressAr: value },
                  }))
                }
                dir="rtl"
              />
              <Field
                label="Address (English)"
                value={content.contact.addressEn}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    contact: { ...current.contact, addressEn: value },
                  }))
                }
              />
              <Field
                label="Formspree endpoint (optional)"
                value={content.contact.formspreeEndpoint}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    contact: { ...current.contact, formspreeEndpoint: value },
                  }))
                }
              />
              <Field
                label="X / Twitter URL"
                value={content.social.x}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    social: { ...current.social, x: value },
                  }))
                }
              />
              <Field
                label="Website URL"
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
              <h2 className="font-display text-2xl text-navy">Call to action</h2>
              <Field
                label="تسمية الزر (عربي)"
                value={content.cta.labelAr}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    cta: { ...current.cta, labelAr: value },
                  }))
                }
                dir="rtl"
              />
              <Field
                label="Button label (English)"
                value={content.cta.labelEn}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    cta: { ...current.cta, labelEn: value },
                  }))
                }
              />
              <Field
                label="نص الدعوة (عربي)"
                value={content.cta.textAr}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    cta: { ...current.cta, textAr: value },
                  }))
                }
                multiline
                dir="rtl"
              />
              <Field
                label="Invitation text (English)"
                value={content.cta.textEn}
                onChange={(value) =>
                  setContent((current) => ({
                    ...current,
                    cta: { ...current.cta, textEn: value },
                  }))
                }
                multiline
              />
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
