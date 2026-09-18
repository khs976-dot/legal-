"use client";

import { useMemo, useState } from "react";
import { getDictionary } from "@/lib/dictionary";
import type { Locale, SiteContent } from "@/lib/types";

type ContactFormProps = {
  locale: Locale;
  content: SiteContent;
};

export function ContactForm({ locale, content }: ContactFormProps) {
  const t = getDictionary(locale);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "missing">(
    "idle",
  );
  const [submitting, setSubmitting] = useState(false);

  const endpoint = useMemo(() => {
    return (
      content.contact.formspreeEndpoint.trim() ||
      process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
      ""
    );
  }, [content.contact.formspreeEndpoint]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const organisation = String(data.get("organisation") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!content.contact.email && !endpoint) {
      setStatus("missing");
      return;
    }

    setSubmitting(true);
    setStatus("idle");

    const payload = {
      name,
      email,
      organisation,
      message,
      locale,
    };

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("formspree failed");
        }
        setStatus("success");
        form.reset();
        return;
      }

      const subject =
        locale === "ar"
          ? `استفسار مهني من موقع خالد السميري — ${name}`
          : `Professional enquiry from Khaled Alsmairi website — ${name}`;
      const body = [
        locale === "ar" ? `الاسم: ${name}` : `Name: ${name}`,
        locale === "ar" ? `البريد: ${email}` : `Email: ${email}`,
        organisation
          ? locale === "ar"
            ? `الجهة: ${organisation}`
            : `Organisation: ${organisation}`
          : "",
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n");

      window.location.href = `mailto:${content.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
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
        <label htmlFor="email" className="text-sm font-medium text-navy">
          {t.formEmail} <span className="text-gold">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="border border-navy/15 bg-cream px-4 py-3 text-ink"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="organisation" className="text-sm font-medium text-navy">
          {t.formOrganisation}
        </label>
        <input
          id="organisation"
          name="organisation"
          autoComplete="organization"
          className="border border-navy/15 bg-cream px-4 py-3 text-ink"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-medium text-navy">
          {t.formMessage} <span className="text-gold">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="border border-navy/15 bg-cream px-4 py-3 text-ink"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="justify-self-start bg-navy px-6 py-3 text-sm tracking-[0.12em] text-ivory uppercase transition-colors hover:bg-navy-mid disabled:opacity-60"
      >
        {t.formSubmit}
      </button>
      {!endpoint && content.contact.email ? (
        <p className="text-sm text-muted">{t.formMailtoHint}</p>
      ) : null}
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
      {status === "missing" ? (
        <p className="text-sm text-red-800" role="alert">
          {t.formMissingEmail}
        </p>
      ) : null}
    </form>
  );
}
