import type { Metadata } from "next";
import { getAllCafes, getSiteSettings } from "@/lib/queries";
import CafeCard from "@/components/CafeCard";

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cafes.map((cafe) => (
            <CafeCard key={cafe._id} cafe={cafe} />
          ))}
        </div>
      )}
    </div>
  );
}
