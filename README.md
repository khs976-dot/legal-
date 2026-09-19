# خالد السميري / Khaled AlSmairi

صفحة واحدة تعريفية (العربية أولاً / RTL، مع تبديل الإنجليزية) للمحامي خالد السميري في دولة الكويت.

A **single-page** bilingual professional profile (Arabic first / RTL, plus English) for Khaled AlSmairi, Kuwait.

The site is informational. It is **not legal advice**.

This repository is for **review and preview only**. It is not a production go-live.

**The stack is free-tier only.** No paid hosting, no paid CMS, no paid form product, no paid fonts, no paid analytics, and no credit card is required.

---

## العربية

صفحة واحدة للزائر: مقدمة، شريط مختصر، ملامح، ثم نموذج تواصل في الأسفل (الاسم، الموضوع كنص حر، الهاتف). بلا قوائم أقسام وبلا صفحات داخلية.

كل كلمة ظاهرة قابلة للتعديل من لوحة خاصة. لا تُذكر أسماء شركات أو مكاتب. لوحة التعديل ليست رابطاً عاماً.

### التشغيل للمراجعة محلياً

```bash
npm install
cp .env.example .env.local
# ADMIN_PASSWORD
npm run dev
```

- العربية: http://localhost:3000
- English: http://localhost:3000/en
- النموذج: http://localhost:3000/#inquiry
- التعديل الخاص: http://localhost:3000/admin

---

## English

One public page. Language toggle only. Inquiry fields: **name**, **subject** (free text), **phone**. Default delivery is `mailto:` + copy-to-clipboard to `khs.976@outlook.com`. Optional free Web3Forms/Formspree.

| Surface | URL |
| --- | --- |
| Arabic (default, RTL) | http://localhost:3000 |
| English | http://localhost:3000/en |
| Inquiry | http://localhost:3000/#inquiry |
| Private editor (not linked publicly) | http://localhost:3000/admin |

`/about`, `/practice`, and `/contact` redirect to the one page.

Every visitor-facing word lives in `content/site.json`.

```bash
npm run build
```
