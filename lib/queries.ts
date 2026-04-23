import { client } from "./sanity.client";

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
  visitDate?: string;
  rating: number;
  shortNotes: string;
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
  category: "camera" | "lens" | "accessory" | "film" | "bag";
  shortReview: string;
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
  return client.fetch(
    `*[_type == "cafe"] | order(visitDate desc) { ${cafeFields} }`
  );
}

export async function getLatestCafes(limit = 3): Promise<Cafe[]> {
  return client.fetch(
    `*[_type == "cafe"] | order(visitDate desc) [0...$limit] { ${cafeFields} }`,
    { limit }
  );
}

export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
  return client.fetch(
    `*[_type == "cafe" && slug.current == $slug][0] { ${cafeFullFields} }`,
    { slug }
  );
}

export async function getAllCafeSlugs(): Promise<{ slug: string }[]> {
  const results = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "cafe"] { slug }`
  );
  return results.map((r) => ({ slug: r.slug.current }));
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
  return client.fetch(
    `*[_type == "gear"] | order(category asc, name asc) { ${gearFields} }`
  );
}

export async function getGearBySlug(slug: string): Promise<Gear | null> {
  return client.fetch(
    `*[_type == "gear" && slug.current == $slug][0] { ${gearFullFields} }`,
    { slug }
  );
}

export async function getAllGearSlugs(): Promise<{ slug: string }[]> {
  const results = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "gear"] { slug }`
  );
  return results.map((r) => ({ slug: r.slug.current }));
}
