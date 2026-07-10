import type { MetadataRoute } from "next";
import { getAllCafeSlugs, getAllGearSlugs } from "@/lib/queries";

// Served automatically at /sitemap.xml by Next.js — no route handler needed.

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://flatwhiteframes.com"
).replace(/\/$/, ""); // strip any accidental trailing slash

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cafeSlugs, gearSlugs] = await Promise.all([
    getAllCafeSlugs(),
    getAllGearSlugs(),
  ]);

  // ── Static routes ──────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/coffee`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gear`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
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

  return [...staticRoutes, ...cafeRoutes, ...gearRoutes];
}
