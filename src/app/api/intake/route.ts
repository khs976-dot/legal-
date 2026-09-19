import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";
import {
  defaultContactEmail,
  isIntakeSubject,
  subjectLabel,
} from "@/lib/intake";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    subject?: string;
    phone?: string;
  } | null;

  const name = body?.name?.trim() ?? "";
  const phone = body?.phone?.trim() ?? "";
  const subject = body?.subject?.trim() ?? "";

  if (!name || !phone || !isIntakeSubject(subject)) {
    return NextResponse.json(
      { error: "Name, subject, and phone are required." },
      { status: 400 },
    );
  }

  const content = await getContent();
  const to =
    process.env.CONTACT_TO_EMAIL?.trim() ||
    content.contact.email.trim() ||
    defaultContactEmail();
  const subjectAr = subjectLabel(subject, "ar");
  const emailSubject = `[طلب موقع] ${subjectAr} — ${name}`;
  const emailBody = [
    `الاسم: ${name}`,
    `الموضوع: ${subjectAr}`,
    `رقم الهاتف: ${phone}`,
    "",
    `Name: ${name}`,
    `Subject: ${subjectLabel(subject, "en")}`,
    `Phone: ${phone}`,
  ].join("\n");

  const endpoint = process.env.CONTACT_FORM_ENDPOINT?.trim();
  const accessKey = process.env.CONTACT_FORM_ACCESS_KEY?.trim();

  if (endpoint) {
    const payload: Record<string, string> = {
      name,
      phone,
      subject: emailSubject,
      message: emailBody,
      email: to,
    };
    if (accessKey) {
      payload.access_key = accessKey;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "The free form service rejected the request." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, delivered: "endpoint" });
  }

  const mailto = `mailto:${to}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const copyText = `To: ${to}\nSubject: ${emailSubject}\n\n${emailBody}`;
  return NextResponse.json({
    ok: true,
    delivered: "mailto",
    mailto,
    copyText,
  });
}
