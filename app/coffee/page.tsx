import type { Metadata } from "next";
import { getAllCafes } from "@/lib/queries";
import CafeCard from "@/components/CafeCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Coffee Shop Log",
  description: "Every café I've visited — rated and reviewed.",
};

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

export default async function CoffeePage() {
  const cafes = await getAllCafes();

  // Collect unique cities for filtering (client-side filtering is done by the layout below)
  const cities = Array.from(new Set(cafes.map((c) => c.city))).sort();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <header className="mb-12 border-b border-roast-muted pb-10">
        <p className="text-xs text-roast uppercase tracking-widest font-sans mb-4">
          The Log
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-espresso">Coffee Shop Log</h1>
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
