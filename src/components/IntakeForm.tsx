"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/dictionary";
import { INTAKE_SUBJECTS } from "@/lib/intake";
import type { Locale } from "@/lib/types";

export function IntakeForm({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || "").trim(),
          subject: String(data.get("subject") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        mailto?: string;
        ok?: boolean;
      } | null;

      if (!response.ok) {
        throw new Error("intake failed");
      }

      if (result?.mailto) {
        window.location.href = result.mailto;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      setPending(false);
    }
  }

  return (
    <form id="intake" onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium text-navy">
          {t.formName} <span className="text-gold">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className="border border-navy/15 bg-cream px-4 py-3 text-ink"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="subject" className="text-sm font-medium text-navy">
          {t.formSubject} <span className="text-gold">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          defaultValue=""
          className="border border-navy/15 bg-cream px-4 py-3 text-ink"
        >
          <option value="" disabled>
            {t.formSubject}
          </option>
          {INTAKE_SUBJECTS.map((item) => (
            <option key={item.value} value={item.value}>
              {locale === "ar" ? item.ar : item.en}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label htmlFor="phone" className="text-sm font-medium text-navy">
          {t.formPhone} <span className="text-gold">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          dir="ltr"
          className="border border-navy/15 bg-cream px-4 py-3 text-ink"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="justify-self-start bg-navy px-6 py-3 text-sm tracking-[0.12em] text-ivory uppercase transition-colors hover:bg-navy-mid disabled:opacity-60"
      >
        {t.formSubmit}
      </button>
      <p className="text-sm text-muted">{t.formMailtoHint}</p>
      {status === "success" ? (
        <p className="text-sm text-navy" role="status">
          {t.formSuccess}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-800" role="alert">
          {t.formError}
        </p>
      ) : null}
    </form>
  );
}
