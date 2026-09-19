# خالد السميري / Khaled AlSmairi

موقع تعريفي مهني ثنائي اللغة (العربية أولاً مع اتجاه RTL، والإنجليزية) للمحامي خالد السميري في دولة الكويت. التركيز: الاستثمار والمعاملات والخدمات المالية.

A bilingual professional profile (Arabic first / RTL, plus English) for Khaled AlSmairi, Kuwait. Focus: investment, transactions, and financial-services legal work.

The site is informational. It is **not legal advice**.

This repository is prepared for **review and preview only**. It is not a production go-live.

The stack is **free-tier only**: no paid hosting plans, no paid CMS, no paid form products required, no paid fonts or analytics.

---

## العربية

### الصفحات

- **الرئيسية** — مقدمة، نبذة، مجالات مختارة، ودعوة إلى لوحة الطلب
- **نبذة** — مسار مهني وتعليم وعضويات (بدون أسماء جهات عمل)
- **مجالات العمل** — قائمة قابلة للتعديل
- **لوحة الطلب** — الاسم، الموضوع (استشارة / صياغة عقد / دعوى)، رقم الهاتف
- **لوحة التحكم** على `/admin`

لا تُذكر أسماء شركات أو مكاتب على الصفحات العامة.

### التشغيل للمراجعة محلياً

Node.js 20+.

```bash
npm install
cp .env.example .env.local
```

في `.env.local`:

```
ADMIN_PASSWORD=choose-a-strong-password
CONTACT_TO_EMAIL=khs.976@outlook.com
```

```bash
npm run dev
```

- العربية: http://localhost:3000
- English: http://localhost:3000/en
- لوحة التحكم: http://localhost:3000/admin
- لوحة الطلب: http://localhost:3000/contact#intake

### النشر لاحقاً (اختياري، مجاني فقط)

عند الرغبة في معاينة عامة لاحقاً — وليس الآن — يمكن استخدام **Vercel Hobby** المجاني (`*.vercel.app`) دون بطاقة ائتمان. لا يُشترط نطاق مدفوع.

1. اربط المستودع بـ Vercel (الخطة المجانية).
2. أضف `ADMIN_PASSWORD` و`CONTACT_TO_EMAIL`.
3. اختياري للنماذج دون فتح برنامج البريد: **Web3Forms** المجاني (250 طلباً/شهر تقريباً) عبر `CONTACT_FORM_ENDPOINT` و`CONTACT_FORM_ACCESS_KEY`.

لا يُنصح بأي ترقية مدفوعة.

---

## English

### Pages

- Home, About, Practice, Contact (intake panel)
- `/admin` dashboard edits `content/site.json`

Employer and law-firm names are omitted on purpose. Roles are described by function, sector, and years.

### Preview locally

```bash
npm install
cp .env.example .env.local
# set ADMIN_PASSWORD
npm run dev
```

| Surface | URL |
| --- | --- |
| Arabic (default, RTL) | http://localhost:3000 |
| English | http://localhost:3000/en |
| Admin | http://localhost:3000/admin |
| Intake form | http://localhost:3000/contact#intake |

Admin password is `ADMIN_PASSWORD`. Intake email target is `CONTACT_TO_EMAIL` (default `khs.976@outlook.com`).

### Intake form (free)

Fields: **name**, **subject** (Consultation / Contract drafting / Lawsuit), **phone**.

Delivery, in order:

1. `RESEND_API_KEY` (optional) — server sends to `CONTACT_TO_EMAIL`.
2. `CONTACT_FORM_ENDPOINT` (optional **Web3Forms** or Formspree free) — server POSTs there. Add `CONTACT_FORM_ACCESS_KEY` for Web3Forms.
3. Otherwise the browser opens `mailto:khs.976@outlook.com` with subject `[طلب موقع] استشارة — Name`.

Env vars: `CONTACT_TO_EMAIL` (default `khs.976@outlook.com`), optional `RESEND_API_KEY` / `RESEND_FROM_EMAIL`, optional `CONTACT_FORM_ENDPOINT` / `CONTACT_FORM_ACCESS_KEY`.

Free limits if you later add an endpoint: Web3Forms about 250 submissions/month; Formspree free about 50/month. Mailto has no quota. No paid plan is required.

### Later hosting (optional, free only)

Vercel Hobby (`*.vercel.app`) is enough. Custom domains are optional and unused for this review. Do not enable paid add-ons.

### Stack (all free)

Next.js App Router, TypeScript, Tailwind, Google Fonts, file-based JSON admin. No paid dependencies in `package.json`.

```bash
npm run dev
npm run build
npm run start
npm run lint
```
