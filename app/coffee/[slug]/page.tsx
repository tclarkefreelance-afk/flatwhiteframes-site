import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getCafeBySlug, getAllCafeSlugs } from "@/lib/queries";
import { urlFor } from "@/lib/sanity.image";
import StarRating from "@/components/StarRating";
import { portableTextComponents } from "@/components/PortableTextComponents";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllCafeSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cafe = await getCafeBySlug(slug);
  if (!cafe) return {};
  return {
    title: cafe.name,
    description: cafe.shortNotes,
    openGraph: cafe.coverImage
      ? { images: [{ url: urlFor(cafe.coverImage).width(1200).height(630).url() }] }
      : undefined,
  };
}

const TAG_LABELS: Record<string, string> = {
  specialty: "Specialty",
  "good-for-working": "Good for Working",
  "dog-friendly": "Dog Friendly",
  "outdoor-seating": "Outdoor Seating",
  "great-food": "Great Food",
  "hidden-gem": "Hidden Gem",
  photogenic: "Photogenic",
  "local-roaster": "Local Roaster",
};

export default async function CafeDetailPage({ params }: Props) {
  const { slug } = await params;
  const cafe = await getCafeBySlug(slug);
  if (!cafe) notFound();

  const coverSrc = cafe.coverImage
    ? urlFor(cafe.coverImage).width(1400).height(800).fit("crop").url()
    : null;

  return (
    <article className="max-w-5xl mx-auto px-6 py-12">
      {/* Back */}
      <Link href="/coffee" className="text-sm text-stone hover:text-roast transition-colors">
        &larr; Coffee Log
      </Link>

      {/* Cover */}
      {coverSrc && (
        <div className="mt-8 aspect-[16/7] relative overflow-hidden rounded-sm bg-cream-dark">
          <Image
            src={coverSrc}
            alt={cafe.coverImage?.alt ?? cafe.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      )}

      {/* Header */}
      <header className="mt-10 pb-8 border-b border-roast-muted">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-roast uppercase tracking-widest font-sans mb-2">
              {cafe.city}{cafe.country ? `, ${cafe.country}` : ""}
              {cafe.visitDate && (
                <> &middot; {new Date(cafe.visitDate).toLocaleDateString("en-AU", { month: "long", year: "numeric" })}</>
              )}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-espresso">{cafe.name}</h1>
          </div>
          <div className="flex flex-col items-end gap-2 pt-1">
            <StarRating rating={cafe.rating} />
            <span className="text-stone text-sm">{cafe.rating}/5</span>
          </div>
        </div>

        {cafe.tags && cafe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {cafe.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 bg-roast-muted text-espresso-light rounded-full">
                {TAG_LABELS[tag] ?? tag}
              </span>
            ))}
          </div>
        )}

        <p className="mt-5 text-stone text-lg leading-relaxed max-w-2xl">{cafe.shortNotes}</p>

        <div className="flex flex-wrap gap-4 mt-5">
          {cafe.website && (
            <a href={cafe.website} target="_blank" rel="noopener noreferrer" className="text-sm text-roast hover:text-espresso transition-colors">
              Website &rarr;
            </a>
          )}
          {cafe.instagram && (
            <a href={`https://instagram.com/${cafe.instagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-roast hover:text-espresso transition-colors">
              @{cafe.instagram}
            </a>
          )}
        </div>
      </header>

      {/* Full review */}
      {cafe.body && cafe.body.length > 0 && (
        <div className="mt-10 prose prose-stone max-w-2xl">
          <PortableText value={cafe.body as Parameters<typeof PortableText>[0]["value"]} components={portableTextComponents} />
        </div>
      )}

      {/* Photo gallery */}
      {cafe.photos && cafe.photos.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl text-espresso mb-6">Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cafe.photos.map((photo, i) => {
              const src = urlFor(photo).width(900).height(640).fit("crop").url();
              return (
                <figure key={i} className="group">
                  <div className="aspect-[4/3] relative overflow-hidden rounded-sm bg-cream-dark">
                    <Image
                      src={src}
                      alt={photo.alt ?? ""}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {photo.caption && (
                    <figcaption className="text-stone text-sm mt-2 italic">{photo.caption}</figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
