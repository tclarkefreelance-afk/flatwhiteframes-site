import type { Metadata } from "next";
import { getAllGear, getSiteSettings, type Gear } from "@/lib/queries";
import GearCard from "@/components/GearCard";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: s.gearPageHeading,
    description: s.gearPageDescription,
  };
}

const CATEGORY_ORDER = ["camera-gear", "tech", "accessories", "misc"];
const CATEGORY_LABELS: Record<string, string> = {
  "camera-gear": "Camera Gear",
  tech: "Tech",
  accessories: "Accessories",
  misc: "Misc",
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
  const [gear, s] = await Promise.all([getAllGear(), getSiteSettings()]);
  const grouped = groupByCategory(gear);
  const categories = CATEGORY_ORDER.filter((c) => grouped[c]?.length);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <header className="mb-12 border-b border-roast-muted pb-10">
        {s.gearPageEyebrow && (
          <p className="text-xs text-roast uppercase tracking-widest font-sans mb-4">
            {s.gearPageEyebrow}
          </p>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl text-espresso">
          {s.gearPageHeading}
        </h1>
        {s.gearPageAbout && (
          <p className="mt-4 text-stone max-w-lg leading-relaxed">
            {s.gearPageAbout}
          </p>
        )}
        <p className="mt-4 text-stone-light text-sm">
          {gear.length} {gear.length === 1 ? "item" : "items"}
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
