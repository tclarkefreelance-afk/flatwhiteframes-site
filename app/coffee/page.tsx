import type { Metadata } from "next";
import { getAllCafes, getSiteSettings } from "@/lib/queries";
import CafeCard from "@/components/CafeCard";
import CafeMapDynamic from "@/components/CafeMapDynamic";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: s.coffeePageHeading,
    description: s.coffeePageDescription,
  };
}

export default async function CoffeePage() {
  const [cafes, s] = await Promise.all([getAllCafes(), getSiteSettings()]);

  // Only pass the fields the map actually needs — keeps the client bundle small
  const mapPins = cafes
    .filter((c) => c.latitude != null && c.longitude != null)
    .map(({ _id, name, slug, city, rating, latitude, longitude }) => ({
      _id, name, slug, city, rating, latitude, longitude,
    }));

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Page header */}
      <header className="mb-12 border-b border-roast-muted pb-10">
        {s.coffeePageEyebrow && (
          <p className="text-xs text-roast uppercase tracking-widest font-sans mb-4">
            {s.coffeePageEyebrow}
          </p>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl text-espresso">
          {s.coffeePageHeading}
        </h1>
        <p className="mt-4 text-stone max-w-lg leading-relaxed">
          {cafes.length} {cafes.length === 1 ? "café" : "cafés"} visited so far.
          Ordered by most recent visit.
        </p>
      </header>

      {cafes.length === 0 ? (
        <p className="text-stone italic">No cafés logged yet — check back soon.</p>
      ) : (
        <>
          {/* Map — only shown when at least one café has coordinates */}
          {mapPins.length > 0 && (
            <section className="mb-16">
              <h2 className="font-serif text-xl text-espresso mb-4">
                On the map
              </h2>
              <CafeMapDynamic cafes={mapPins} />
              {mapPins.length < cafes.length && (
                <p className="mt-3 text-stone-light text-xs">
                  {cafes.length - mapPins.length}{" "}
                  {cafes.length - mapPins.length === 1 ? "café" : "cafés"} not
                  yet mapped — add coordinates in the Studio to include them.
                </p>
              )}
            </section>
          )}

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cafes.map((cafe) => (
              <CafeCard key={cafe._id} cafe={cafe} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
