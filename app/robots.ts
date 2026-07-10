import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://flatwhiteframes.com")
    .replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep the CMS out of Google's index
        disallow: "/studio/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
