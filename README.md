# خالد السميري / Khaled AlSmairi

موقع تعريفي مهني ثنائي اللغة (العربية أولاً مع اتجاه RTL، والإنجليزية) للمحامي خالد السميري في دولة الكويت. التركيز: الاستثمار والمعاملات والخدمات المالية.

A bilingual professional profile (Arabic first / RTL, plus English) for Khaled AlSmairi, Kuwait. Focus: investment, transactions, and financial-services legal work.

The site is informational. It is **not legal advice**.

This repository is for **review and preview only**. It is not a production go-live.

**The stack is free-tier only.** No paid hosting, no paid CMS, no paid form product, no paid fonts, no paid analytics, and no credit card is required for any documented path.

---

## العربية

### الصفحات

- **الرئيسية** — مقدمة، نبذة، مجالات مختارة، ودعوة إلى لوحة الطلب
- **نبذة** — مسار مهني وتعليم وعضويات (بدون أسماء جهات عمل)
- **مجالات العمل** — قائمة قابلة للتعديل
- **لوحة الطلب** — الاسم، الموضوع (استشارة / صياغة عقد / دعوى)، رقم الهاتف
- **كل كلمة ظاهرة للزائر** قابلة للتعديل من لوحة خاصة (القوائم، العناوين، الأزرار، النموذج، التذييل)

لا تُذكر أسماء شركات أو مكاتب على الصفحات العامة. لوحة التعديل خاصة بك وليست رابطاً في الموقع.

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
- لوحة الطلب: http://localhost:3000/contact#intake
- التعديل الخاص (كلمة مرور فقط، بلا رابط عام): http://localhost:3000/admin

### استضافة لاحقاً (مجانية فقط، اختيارية)

للمعاينة العامة لاحقاً يكفي **Vercel Hobby** المجاني على نطاق `*.vercel.app`. لا يُطلب نطاق مدفوع، ولا تُفعَّل إضافات مدفوعة، ولا تُستخدم بطاقة ائتمان.

حدود الطبقة المجانية إن أُضيفت خدمة نماذج لاحقاً: Web3Forms نحو 250 طلباً/شهر، وFormspree نحو 50 طلباً/شهر. مسار `mailto` بلا حد.

---

## English

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
| Intake form | http://localhost:3000/contact#intake |
| Private editor (password; not linked publicly) | http://localhost:3000/admin |

### Free-tier only

| Piece | Free path | Limit if used |
| --- | --- | --- |
| Hosting | Vercel Hobby `*.vercel.app` (later, optional) | Hobby quotas; no paid domain required |
| Intake email | `mailto:` + copy-to-clipboard by default | None |
| Optional form API | Web3Forms or Formspree **free** | ~250 / ~50 submissions per month |
| Private editor | Password-gated `/admin` writes `content/site.json`. No public nav/footer/sitemap link. | None |
| Fonts | Google Fonts | None |
| Analytics / stock images | None | — |

No paid upgrade is part of this project.

### Intake form

Fields: **name**, **subject** (استشارة / صياغة عقد / دعوى), **phone**.

Delivery:

1. If `CONTACT_FORM_ENDPOINT` is set (Web3Forms or Formspree free), the server POSTs there. Add `CONTACT_FORM_ACCESS_KEY` for Web3Forms.
2. Otherwise the browser opens `mailto:khs.976@outlook.com` with subject `[طلب موقع] استشارة — Name`, and the request text can be copied.

Required env: `ADMIN_PASSWORD`.  
Intake destination: `CONTACT_TO_EMAIL` (default `khs.976@outlook.com`).  
Optional free form: `CONTACT_FORM_ENDPOINT`, `CONTACT_FORM_ACCESS_KEY`.

Every visitor-facing word (nav, headings, buttons, form labels, footer, language toggle, empty/success messages) lives in `content/site.json` and is edited from the private dashboard. There is no public link to `/admin`.

### Stack

Next.js App Router, TypeScript, Tailwind, Google Fonts. `package.json` has no paid licensed services.

```bash
npm run dev
npm run build
npm run start
npm run lint
```
