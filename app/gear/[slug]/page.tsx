import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getGearBySlug, getAllGearSlugs } from "@/lib/queries";
import { urlFor } from "@/lib/sanity.image";
import StarRating from "@/components/StarRating";
import { portableTextComponents } from "@/components/PortableTextComponents";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllGearSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gear = await getGearBySlug(slug);
  if (!gear) return {};
  return {
    title: gear.name,
    description: gear.shortReview,
    openGraph: gear.samplePhoto
      ? { images: [{ url: urlFor(gear.samplePhoto).width(1200).height(630).url() }] }
      : undefined,
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  camera: "Camera Body",
  lens: "Lens",
  accessory: "Accessory",
  film: "Film",
  bag: "Bag",
};

export default async function GearDetailPage({ params }: Props) {
  const { slug } = await params;
  const gear = await getGearBySlug(slug);
  if (!gear) notFound();

  const sampleSrc = gear.samplePhoto
    ? urlFor(gear.samplePhoto).width(1400).height(900).fit("crop").url()
    : null;

  return (
    <article className="max-w-5xl mx-auto px-6 py-12">
      {/* Back */}
      <Link href="/gear" className="text-sm text-stone hover:text-roast transition-colors">
        &larr; Gear Index
      </Link>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Sample photo */}
        {sampleSrc && (
          <div className="aspect-[4/3] relative overflow-hidden rounded-sm bg-cream-dark">
            <Image
              src={sampleSrc}
              alt={gear.samplePhoto?.alt ?? gear.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {gear.samplePhoto?.caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-espresso/60 text-cream text-xs px-3 py-2 italic">
                {gear.samplePhoto.caption}
              </p>
            )}
          </div>
        )}

        {/* Info panel */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs text-roast uppercase tracking-widest font-sans">
              {CATEGORY_LABELS[gear.category] ?? gear.category}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-espresso mt-2 leading-tight">
              {gear.name}
            </h1>
          </div>

          {gear.rating && (
            <div className="flex items-center gap-3">
              <StarRating rating={gear.rating} />
              <span className="text-stone text-sm">{gear.rating}/5</span>
            </div>
          )}

          <p className="text-stone text-lg leading-relaxed">{gear.shortReview}</p>

          {gear.stillOwn === false && (
            <p className="text-stone-light text-sm italic border-l-2 border-roast-muted pl-3">
              I no longer own this piece of gear.
            </p>
          )}

          {/* Specs table */}
          {gear.specs && gear.specs.length > 0 && (
            <div className="border border-roast-muted rounded-sm overflow-hidden mt-2">
              <table className="w-full text-sm">
                <tbody>
                  {gear.specs.map((spec, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-cream" : "bg-cream-dark"}
                    >
                      <td className="px-4 py-2 font-sans text-stone-light w-1/2">{spec.label}</td>
                      <td className="px-4 py-2 text-espresso">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {gear.buyLink && (
            <a
              href={gear.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block self-start text-sm px-5 py-2 border border-espresso text-espresso hover:bg-espresso hover:text-cream transition-colors"
            >
              Find it online &rarr;
            </a>
          )}
        </div>
      </div>

      {/* Full review body */}
      {gear.body && gear.body.length > 0 && (
        <div className="mt-16 prose prose-stone max-w-2xl">
          <PortableText
            value={gear.body as Parameters<typeof PortableText>[0]["value"]}
            components={portableTextComponents}
          />
        </div>
      )}
    </article>
  );
}
