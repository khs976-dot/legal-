import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = ["", "/about", "/practice", "/contact"];

  return paths.flatMap((path) => [
    {
      url: `${siteUrl}${path || "/"}`,
      alternates: {
        languages: {
          ar: `${siteUrl}${path || "/"}`,
          en: `${siteUrl}/en${path}`,
        },
      },
    },
    {
      url: `${siteUrl}/en${path}`,
      alternates: {
        languages: {
          ar: `${siteUrl}${path || "/"}`,
          en: `${siteUrl}/en${path}`,
        },
      },
    },
  ]);
}
