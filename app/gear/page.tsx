import type { Metadata } from "next";
import { getAllGear, Gear } from "@/lib/queries";
import GearCard from "@/components/GearCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gear Index",
  description: "My full camera kit — bodies, lenses, and accessories — each with an honest review.",
};

const CATEGORY_ORDER = ["camera", "lens", "accessory", "film", "bag"];
const CATEGORY_LABELS: Record<string, string> = {
  camera: "Camera Bodies",
  lens: "Lenses",
  accessory: "Accessories",
  film: "Film",
  bag: "Bags",
};

function groupByCategory(gear: Gear[]): Record<string, Gear[]> {
  return gear.reduce<Record<string, Gear[]>>((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export default async function GearPage() {
  const gear = await getAllGear();
  const grouped = groupByCategory(gear);
  const categories = CATEGORY_ORDER.filter((c) => grouped[c]?.length);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <header className="mb-12 border-b border-roast-muted pb-10">
        <p className="text-xs text-roast uppercase tracking-widest font-sans mb-4">
          What&rsquo;s in the Bag
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-espresso">Gear Index</h1>
        <p className="mt-4 text-stone max-w-lg leading-relaxed">
          {gear.length} {gear.length === 1 ? "item" : "items"} — everything I shoot with,
          each with an honest write-up and sample photos.
        </p>
      </header>

      {gear.length === 0 ? (
        <p className="text-stone italic">No gear listed yet — check back soon.</p>
      ) : (
        <div className="flex flex-col gap-16">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="font-serif text-2xl text-espresso mb-6 pb-3 border-b border-roast-muted">
                {CATEGORY_LABELS[cat] ?? cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[cat].map((item) => (
                  <GearCard key={item._id} gear={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
