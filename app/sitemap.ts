import type { MetadataRoute } from "next";
import { getAllCafeSlugs, getAllGearSlugs, getAllPrintSlugs } from "@/lib/queries";

// Revalidate every hour so new cafés and gear added in Sanity appear in the
// sitemap without needing a full redeploy. Without this the route is frozen
// as fully static (○) at build time and never picks up new content.
export const revalidate = 3600;

// BASE_URL must live inside the function (not at module scope) so it is
// evaluated at request time — module-level NEXT_PUBLIC_ vars are inlined at
// build time and may resolve to "" on platforms where the env var is absent
// during the build phase.
function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://flatwhiteframes.com")
    .replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = getBaseUrl();

  const [cafeSlugs, gearSlugs, printSlugs] = await Promise.all([
    getAllCafeSlugs(),
    getAllGearSlugs(),
    getAllPrintSlugs(),
  ]);

  // ── Static routes ──────────────────────────────────────────────────────────
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/coffee`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gear`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/prints`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // ── Dynamic café pages ─────────────────────────────────────────────────────
  const cafeRoutes: MetadataRoute.Sitemap = cafeSlugs.map(({ slug, updatedAt }) => ({
    url: `${BASE_URL}/coffee/${slug}`,
    lastModified: new Date(updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // ── Dynamic gear pages ─────────────────────────────────────────────────────
  const gearRoutes: MetadataRoute.Sitemap = gearSlugs.map(({ slug, updatedAt }) => ({
    url: `${BASE_URL}/gear/${slug}`,
    lastModified: new Date(updatedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // ── Dynamic print pages ────────────────────────────────────────────────────
  const printRoutes: MetadataRoute.Sitemap = printSlugs.map(({ slug, updatedAt }) => ({
    url: `${BASE_URL}/prints/${slug}`,
    lastModified: new Date(updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...cafeRoutes, ...gearRoutes, ...printRoutes];
}
