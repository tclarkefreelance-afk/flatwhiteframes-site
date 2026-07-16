import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPrintSlugs, getPrintBySlug, getSiteSettings } from "@/lib/queries";
import { urlFor } from "@/lib/sanity.image";
import PrintSizeSelector from "@/components/PrintSizeSelector";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPrintSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const print = await getPrintBySlug(slug);
  if (!print) return {};
  return {
    title: `${print.name} — Print`,
    description: print.description,
  };
}

export default async function PrintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [print, s] = await Promise.all([getPrintBySlug(slug), getSiteSettings()]);
  if (!print) notFound();

  const imgSrc = print.image?.asset
    ? urlFor(print.image).width(1200).height(1600).fit("crop").url()
    : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/prints"
        className="inline-flex items-center gap-1.5 text-stone text-sm hover:text-espresso transition-colors mb-10 font-sans uppercase tracking-wide"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="15,18 9,12 15,6" />
        </svg>
        All prints
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Photo */}
        <div className="aspect-[3/4] bg-cream-dark relative overflow-hidden">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={print.image?.alt ?? print.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-light">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <p className="text-xs text-roast uppercase tracking-widest font-sans mb-3">
            Fine Art Print
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-espresso mb-4">
            {print.name}
          </h1>

          {print.description && (
            <div className="space-y-3 mb-8">
              {print.description.split(/\n\n+/).map((para, i) => (
                <p key={i} className="text-stone leading-relaxed">{para}</p>
              ))}
            </div>
          )}

          {/* Print details */}
          {s.printDetailsText && (
            <div className="border-t border-roast-muted pt-6 mb-8">
              <ul className="text-sm text-stone space-y-1.5">
                {s.printDetailsText.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          <PrintSizeSelector printName={print.name} />
        </div>
      </div>
    </div>
  );
}
