import Link from "next/link";
import { getLatestCafes } from "@/lib/queries";
import CafeCard from "@/components/CafeCard";

export const revalidate = 60;

export default async function HomePage() {
  const cafes = await getLatestCafes(3);

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="py-24 border-b border-roast-muted">
        <p className="text-xs text-roast uppercase tracking-widest font-sans mb-6">
          Coffee &amp; Cameras
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-espresso leading-tight max-w-2xl">
          A log of great coffee and honest gear reviews.
        </h1>
        <p className="mt-6 text-stone text-lg max-w-xl leading-relaxed">
          I&rsquo;m Taylor &mdash; I spend too much time in coffee shops and too much money
          on camera gear. This is where I write it all down.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href="/coffee"
            className="inline-block px-6 py-3 bg-espresso text-cream text-sm tracking-wide hover:bg-espresso-light transition-colors"
          >
            Browse the Coffee Log
          </Link>
          <a
            href="https://instagram.com/flatwhiteframes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone hover:text-roast transition-colors"
          >
            @flatwhiteframes on Instagram
          </a>
        </div>
      </section>

      {/* Latest Cafés */}
      {cafes.length > 0 && (
        <section className="py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-2xl text-espresso">Latest Visits</h2>
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
          <h2 className="font-serif text-2xl text-espresso mb-4">What&rsquo;s in the Bag</h2>
          <p className="text-stone leading-relaxed mb-6">
            My full camera kit — bodies, lenses, and accessories — each with an honest
            write-up and sample shots from the field.
          </p>
          <Link
            href="/gear"
            className="text-sm text-espresso border-b border-espresso pb-0.5 hover:text-roast hover:border-roast transition-colors"
          >
            See the Gear Index &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
