import Link from "next/link";
import { getLatestCafes, getSiteSettings } from "@/lib/queries";
import CafeCard from "@/components/CafeCard";

export const revalidate = 60;

export default async function HomePage() {
  const [cafes, s] = await Promise.all([getLatestCafes(3), getSiteSettings()]);
  const igUrl = `https://instagram.com/${s.instagramHandle ?? "flatwhiteframes"}`;

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="py-24 border-b border-roast-muted">
        {s.heroEyebrow && (
          <p className="text-xs text-roast uppercase tracking-widest font-sans mb-6">
            {s.heroEyebrow}
          </p>
        )}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-espresso leading-tight max-w-2xl">
          {s.heroHeadline}
        </h1>
        {s.heroAbout && (
          <p className="mt-6 text-stone text-lg max-w-xl leading-relaxed">
            {s.heroAbout}
          </p>
        )}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href="/coffee"
            className="inline-block px-6 py-3 bg-espresso text-cream text-sm tracking-wide hover:bg-espresso-light transition-colors"
          >
            {s.heroCoffeeCtaLabel}
          </Link>
          {s.heroInstagramCtaLabel && (
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-stone hover:text-roast transition-colors"
            >
              {s.heroInstagramCtaLabel}
            </a>
          )}
        </div>
      </section>

      {/* Latest Cafés */}
      {cafes.length > 0 && (
        <section className="py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-2xl text-espresso">
              {s.latestVisitsHeading}
            </h2>
            <Link href="/coffee" className="text-sm text-roast hover:text-espresso transition-colors">
              All cafés &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cafes.map((cafe) => (
              <CafeCard key={cafe._id} cafe={cafe} />
            ))}
          </div>
        </section>
      )}

      {/* Gear teaser */}
      <section className="py-16 border-t border-roast-muted">
        <div className="max-w-xl">
          {s.gearTeaserHeading && (
            <h2 className="font-serif text-2xl text-espresso mb-4">
              {s.gearTeaserHeading}
            </h2>
          )}
          {s.gearTeaserBody && (
            <p className="text-stone leading-relaxed mb-6">{s.gearTeaserBody}</p>
          )}
          {s.gearTeaserCtaLabel && (
            <Link
              href="/gear"
              className="text-sm text-espresso border-b border-espresso pb-0.5 hover:text-roast hover:border-roast transition-colors"
            >
              {s.gearTeaserCtaLabel} &rarr;
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
