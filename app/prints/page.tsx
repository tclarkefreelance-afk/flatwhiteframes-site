import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPrints, getSiteSettings } from "@/lib/queries";
import { urlFor } from "@/lib/sanity.image";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: s.printsPageHeading,
    description: s.printsPageDescription,
  };
}

export default async function PrintsPage() {
  const [prints, s] = await Promise.all([getAllPrints(), getSiteSettings()]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <header className="mb-12 border-b border-roast-muted pb-10">
        {s.printsPageEyebrow && (
          <p className="text-xs text-roast uppercase tracking-widest font-sans mb-4">
            {s.printsPageEyebrow}
          </p>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl text-espresso">
          {s.printsPageHeading}
        </h1>
        {s.printsPageDescription && (
          <p className="mt-4 text-stone max-w-lg leading-relaxed">
            {s.printsPageDescription}
          </p>
        )}
        <div className="mt-5 inline-flex items-center gap-2 text-xs text-roast bg-roast-muted px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-roast inline-block" />
          Coming soon — join the waitlist on any print
        </div>
      </header>

      {prints.length === 0 ? (
        <p className="text-stone italic">No prints available yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {prints.map((print) => {
            const imgSrc =
              print.image?.asset
                ? urlFor(print.image).width(600).height(800).fit("crop").url()
                : null;

            return (
              <Link
                key={print._id}
                href={`/prints/${print.slug.current}`}
                className="group block"
              >
                <div className="aspect-[3/4] bg-cream-dark overflow-hidden mb-3 relative">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={print.image?.alt ?? print.name}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-light text-sm">
                      No image
                    </div>
                  )}
                </div>
                <p className="font-serif text-espresso group-hover:text-roast transition-colors">
                  {print.name}
                </p>
                <p className="text-stone text-sm mt-0.5">From £20</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
