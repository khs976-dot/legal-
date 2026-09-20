import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return [
    {
      url: `${siteUrl}/`,
      alternates: { languages: { ar: `${siteUrl}/`, en: `${siteUrl}/en` } },
    },
    {
      url: `${siteUrl}/en`,
      alternates: { languages: { ar: `${siteUrl}/`, en: `${siteUrl}/en` } },
    },
  ];
}
