import { cache } from "react";
import { client } from "./sanity.client";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type PtBlock = { _type: string; children?: { text?: string }[] };

/** Extracts a plain string from a portable text value.
 *  Handles legacy plain-text strings (existing Sanity documents) and modern
 *  block arrays transparently so old content never causes a runtime error. */
export function blocksToPlainText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return (value as PtBlock[])
    .filter((b) => b && b._type === "block")
    .map((b) => b.children?.map((c) => c.text ?? "").join("") ?? "")
    .join(" ")
    .trim();
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type SanityImage = {
  asset: { _ref: string };
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number };
};

export type Cafe = {
  _id: string;
  _createdAt: string;
  name: string;
  slug: { current: string };
  city: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  visitDate?: string;
  rating: number;
  shortNotes: unknown[] | string;
  body?: unknown[];
  coverImage?: SanityImage;
  photos?: SanityImage[];
  tags?: string[];
  website?: string;
  instagram?: string;
};

export type Gear = {
  _id: string;
  _createdAt: string;
  name: string;
  slug: { current: string };
  category: "camera-gear" | "tech" | "accessories" | "misc";
  shortReview: unknown[] | string;
  body?: unknown[];
  samplePhoto?: SanityImage;
  rating?: number;
  stillOwn?: boolean;
  buyLink?: string;
  specs?: { label: string; value: string }[];
};

// ─── Café queries ─────────────────────────────────────────────────────────────

const cafeFields = `
  _id, _createdAt, name, slug, city, country,
  latitude, longitude,
  visitDate, rating, shortNotes, tags,
  coverImage { asset, alt, hotspot }
`;

const cafeFullFields = `
  ${cafeFields},
  body[] { ..., asset-> },
  photos[] { asset, alt, caption, hotspot },
  website, instagram
`;

export async function getAllCafes(): Promise<Cafe[]> {
  if (!client) return [];
  return client.fetch(
    `*[_type == "cafe"] | order(visitDate desc) { ${cafeFields} }`
  );
}

export async function getLatestCafes(limit = 3): Promise<Cafe[]> {
  if (!client) return [];
  return client.fetch(
    `*[_type == "cafe"] | order(visitDate desc) [0...$limit] { ${cafeFields} }`,
    { limit }
  );
}

export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
  if (!client) return null;
  return client.fetch(
    `*[_type == "cafe" && slug.current == $slug][0] { ${cafeFullFields} }`,
    { slug }
  );
}

export async function getAllCafeSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  if (!client) return [];
  const results = await client.fetch<{ slug: { current: string }; _updatedAt: string }[]>(
    `*[_type == "cafe"] { slug, _updatedAt }`
  );
  return results.map((r) => ({ slug: r.slug.current, updatedAt: r._updatedAt }));
}

// ─── Gear queries ─────────────────────────────────────────────────────────────

const gearFields = `
  _id, _createdAt, name, slug, category, shortReview, rating, stillOwn,
  samplePhoto { asset, alt, caption, hotspot }
`;

const gearFullFields = `
  ${gearFields},
  body[] { ..., asset-> },
  specs[] { label, value },
  buyLink
`;

export async function getAllGear(): Promise<Gear[]> {
  if (!client) return [];
  return client.fetch(
    `*[_type == "gear"] | order(category asc, name asc) { ${gearFields} }`
  );
}

export async function getGearBySlug(slug: string): Promise<Gear | null> {
  if (!client) return null;
  return client.fetch(
    `*[_type == "gear" && slug.current == $slug][0] { ${gearFullFields} }`,
    { slug }
  );
}

export async function getAllGearSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  if (!client) return [];
  const results = await client.fetch<{ slug: { current: string }; _updatedAt: string }[]>(
    `*[_type == "gear"] { slug, _updatedAt }`
  );
  return results.map((r) => ({ slug: r.slug.current, updatedAt: r._updatedAt }));
}

// ─── Print queries ────────────────────────────────────────────────────────────

export type Print = {
  _id: string;
  name: string;
  slug: { current: string };
  image?: SanityImage;
  description?: string;
  available?: boolean;
  order?: number;
};

const printFields = `
  _id, name, slug, description, available, order,
  image { asset, alt, hotspot }
`;

export async function getAllPrints(): Promise<Print[]> {
  if (!client) return [];
  return client.fetch(
    `*[_type == "print" && available == true] | order(order asc, name asc) { ${printFields} }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getPrintBySlug(slug: string): Promise<Print | null> {
  if (!client) return null;
  return client.fetch(
    `*[_type == "print" && slug.current == $slug][0] { ${printFields} }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

export async function getAllPrintSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  if (!client) return [];
  const results = await client.fetch<{ slug: { current: string }; _updatedAt: string }[]>(
    `*[_type == "print" && available == true] { slug, _updatedAt }`
  );
  return results.map((r) => ({ slug: r.slug.current, updatedAt: r._updatedAt }));
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export type SiteSettings = {
  siteTitle: string;
  siteDescription?: string;
  instagramHandle?: string;
  // Navigation
  navCoffeeLabel: string;
  navGearLabel: string;
  navPrintsLabel: string;
  // Homepage
  heroEyebrow?: string;
  heroHeadline?: string;
  heroAbout?: string;
  heroCoffeeCtaLabel?: string;
  heroInstagramCtaLabel?: string;
  latestVisitsHeading?: string;
  gearTeaserHeading?: string;
  gearTeaserBody?: string;
  gearTeaserCtaLabel?: string;
  // Coffee page
  coffeePageEyebrow?: string;
  coffeePageHeading?: string;
  coffeePageDescription?: string;
  // Gear page
  gearPageEyebrow?: string;
  gearPageHeading?: string;
  gearPageAbout?: string;
  gearPageDescription?: string;
  // Prints page
  printsPageEyebrow?: string;
  printsPageHeading?: string;
  printsPageDescription?: string;
  // Footer
  footerTagline?: string;
};

const FALLBACK_SETTINGS: SiteSettings = {
  siteTitle: "Flat White Frames",
  siteDescription: "A log of coffee shops visited and camera gear reviewed.",
  instagramHandle: "flatwhiteframes",
  navCoffeeLabel: "Coffee Log",
  navGearLabel: "Gear",
  navPrintsLabel: "Prints",
  heroEyebrow: "Coffee & Cameras",
  heroHeadline: "A log of great coffee and honest gear reviews.",
  heroAbout: "I'm Taylor — I spend too much time in coffee shops and too much money on camera gear. This is where I write it all down.",
  heroCoffeeCtaLabel: "Browse the Coffee Log",
  heroInstagramCtaLabel: "@flatwhiteframes on Instagram",
  latestVisitsHeading: "Latest Visits",
  gearTeaserHeading: "What's in the Bag",
  gearTeaserBody: "My full camera kit — bodies, lenses, and accessories — each with an honest write-up and sample shots from the field.",
  gearTeaserCtaLabel: "See the Gear Index",
  coffeePageEyebrow: "The Log",
  coffeePageHeading: "Coffee Shop Log",
  coffeePageDescription: "Every café I've visited — rated and reviewed.",
  gearPageEyebrow: "What's in the Bag",
  gearPageHeading: "Gear Index",
  gearPageAbout: "",
  gearPageDescription: "My full camera kit — bodies, lenses, and accessories — each with an honest review.",
  printsPageEyebrow: "The Shop",
  printsPageHeading: "Print Shop",
  printsPageDescription: "Fine art prints of my favourite frames — available in A4, A3, and A2.",
  footerTagline: "Flat White Frames — coffee & cameras",
};

// cache() deduplicates this fetch — Header, Footer, and page components
// all call getSiteSettings() but Sanity is only queried once per render pass.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!client) return FALLBACK_SETTINGS;

  const data = await client.fetch<Partial<SiteSettings> | null>(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]`,
    {}, // no params
    { next: { revalidate: 60 } } // align with page-level ISR revalidation
  );

  if (!data) return FALLBACK_SETTINGS;

  // Only let Sanity values override fallbacks when they are actually set.
  // Spreading `data` directly would replace fallback strings with `null` for
  // any field the user left empty in the Studio, hiding them on the page.
  const nonEmpty = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );

  return { ...FALLBACK_SETTINGS, ...nonEmpty };
});
