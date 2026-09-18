# المحامي خالد السميري / Lawyer Khaled Alsmairi

موقع تعريفي مهني ثنائي اللغة (العربية أولاً مع اتجاه RTL، والإنجليزية) للمحامي خالد السميري، مدير مساعد للشؤون القانونية لدى شركة عمار للتمويل والإيجار في مدينة الكويت.

A bilingual professional profile site (Arabic first / RTL, plus English) for Lawyer Khaled Alsmairi, Assistant Manager of Legal Affairs at Amar Finance & Leasing Co., Kuwait City.

The site is informational. It is **not legal advice**.

---

## العربية

### ماذا يتضمن الموقع

- **الرئيسية** — مقدمة، نبذة قصيرة، مجالات مختارة، ودعوة للتواصل
- **نبذة** — تعريف مهني أطول وبطاقة تعريف
- **مجالات العمل** — قائمة قابلة للتعديل من لوحة التحكم
- **التواصل** — نموذج جاهز لـ mailto أو [Formspree](https://formspree.io)
- **لوحة التحكم** على `/admin` لتعديل الاسم والمسميات والنبذة ومجالات العمل وبيانات التواصل دون فتح الشفرة

### التشغيل محلياً

يتطلب Node.js 20 أو أحدث.

```bash
npm install
cp .env.example .env.local
```

عدّل `.env.local` وضَع كلمة مرور حقيقية:

```
ADMIN_PASSWORD=choose-a-strong-password
```

ثم:

```bash
npm run dev
```

- الموقع العربي: [http://localhost:3000](http://localhost:3000)
- English: [http://localhost:3000/en](http://localhost:3000/en)
- لوحة التحكم: [http://localhost:3000/admin](http://localhost:3000/admin)

بعد حفظ التعديلات في `/admin` تُكتب إلى `content/site.json` وتظهر فوراً في الصفحات العامة.

### النشر المجاني على نطاق فرعي من Vercel

1. ادفع المشروع إلى GitHub.
2. ادخل إلى [vercel.com](https://vercel.com) وسجّل بحساب GitHub (الخطة المجانية كافية).
3. **Add New Project** → اختر هذا المستودع.
4. Framework Preset: **Next.js** (يُكتشف تلقائياً).
5. في **Environment Variables** أضف:
   - `ADMIN_PASSWORD` = كلمة مرور قوية
   - `NEXT_PUBLIC_SITE_URL` = `https://your-project.vercel.app` (بعد أول نشر يمكن تحديثه)
6. اضغط **Deploy**.
7. ستحصل على رابط مجاني بالشكل: `https://legal-xxxx.vercel.app`.

لا تضع كلمة مرور لوحة التحكم داخل المستودع.

### ربط نطاق .com لاحقاً

في مشروع Vercel: **Settings → Domains** → أضف `www.yourdomain.com` واتبع تعليمات DNS. بعد الربط حدّث `NEXT_PUBLIC_SITE_URL`.

### تعديل المحتوى على الموقع المنشور

قرص Vercel للقراءة فقط. لذلك:

- **الأسهل:** عدّل محلياً عبر `/admin`، ثم ارفع ملف `content/site.json` المحدَّث وأعد النشر؛ أو
- **اختياري للتحرير المباشر على الموقع الحي:** أضف `GITHUB_TOKEN` و`GITHUB_REPO` و`GITHUB_BRANCH` حتى تُحفظ التعديلات كـ commit في GitHub ويعيد Vercel النشر.

### تنبيه

المحتوى الابتدائي تعريفي فقط. لا تُدرج أرقام قيد أو رخص أو جوائز أو قوائم عملاء غير موثّقة.

---

## English

### Pages

- **Home** — hero, short bio, practice highlights, contact CTA
- **About** — longer professional background
- **Practice** — editable focus areas
- **Contact** — form UI with mailto, or Formspree if an endpoint is set
- **Dashboard** at `/admin` — simple forms for name, titles, bilingual bios, practice areas, contact details, hero text, and social links

### Run locally

Node.js 20+.

```bash
npm install
cp .env.example .env.local
```

Set a real password in `.env.local`:

```
ADMIN_PASSWORD=choose-a-strong-password
```

```bash
npm run dev
```

| Surface | URL |
| --- | --- |
| Arabic (default, RTL) | http://localhost:3000 |
| English | http://localhost:3000/en |
| Admin | http://localhost:3000/admin |

`npm run build` then `npm run start` is the production-local check.

### Admin

- Path: `/admin`
- Password: the `ADMIN_PASSWORD` environment variable
- If that variable is missing, sign-in is refused
- Saving writes `content/site.json` (no code edits required)

### Free Vercel subdomain

1. Push this repository to GitHub.
2. Sign in at [vercel.com](https://vercel.com) with GitHub (Hobby / free tier).
3. **Add New Project** and import the repo.
4. Keep the Next.js preset.
5. Add environment variables:
   - `ADMIN_PASSWORD` — strong password
   - `NEXT_PUBLIC_SITE_URL` — `https://your-project.vercel.app` after the first deploy
6. Deploy. Vercel assigns a free `*.vercel.app` URL.

Optional later:

- **Formspree:** create a form, paste the endpoint into `/admin` → Contact.
- **Custom domain:** Vercel → Settings → Domains, then update `NEXT_PUBLIC_SITE_URL`.
- **Live admin persistence:** set `GITHUB_TOKEN` (contents write), `GITHUB_REPO` (e.g. `khs976-dot/legal-`), and `GITHUB_BRANCH`. The dashboard will commit `content/site.json`.

### Stack

Next.js App Router, TypeScript, Tailwind CSS. Content lives in `content/site.json`.

### Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
