"use client";

import { useState } from "react";
import { makeUi, type Locale, type SiteContent } from "@/lib/types";

export function IntakeForm({
  locale,
  content,
}: {
  locale: Locale;
  content: SiteContent;
}) {
  const t = makeUi(content, locale);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [pending, setPending] = useState(false);
  const [copyText, setCopyText] = useState("");
  const [copied, setCopied] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setStatus("idle");
    setCopied(false);

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
        copyText?: string;
        ok?: boolean;
      } | null;

      if (!response.ok) {
        throw new Error("intake failed");
      }

      if (result?.copyText) {
        setCopyText(result.copyText);
        try {
          await navigator.clipboard.writeText(result.copyText);
          setCopied(true);
        } catch {
          /* clipboard may be blocked */
        }
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

  async function copyAgain() {
    if (!copyText) {
      return;
    }
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
  }

  return (
    <form id="intake" onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium text-navy">
          {t("formName")} <span className="text-gold">{t("required")}</span>
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
          {t("formSubject")} <span className="text-gold">{t("required")}</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          defaultValue=""
          className="border border-navy/15 bg-cream px-4 py-3 text-ink"
        >
          <option value="" disabled>
            {t("formSubject")}
          </option>
          {content.intakeSubjects.map((item) => (
            <option key={item.id} value={item.id}>
              {locale === "ar" ? item.labelAr : item.labelEn}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label htmlFor="phone" className="text-sm font-medium text-navy">
          {t("formPhone")} <span className="text-gold">{t("required")}</span>
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
        {t("formSubmit")}
      </button>
      <p className="text-sm text-muted">{t("formMailtoHint")}</p>
      {status === "success" ? (
        <div className="space-y-2">
          <p className="text-sm text-navy" role="status">
            {t("formSuccess")}
          </p>
          {copyText ? (
            <button
              type="button"
              onClick={copyAgain}
              className="text-sm text-navy underline decoration-gold underline-offset-4"
            >
              {copied ? t("formCopied") : t("formCopy")}
            </button>
          ) : null}
        </div>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-800" role="alert">
          {t("formError")}
        </p>
      ) : null}
    </form>
  );
}
