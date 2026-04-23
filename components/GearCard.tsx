import Link from "next/link";
import Image from "next/image";
import { Gear } from "@/lib/queries";
import { urlFor } from "@/lib/sanity.image";
import StarRating from "./StarRating";

const CATEGORY_LABELS: Record<string, string> = {
  camera: "Camera Body",
  lens: "Lens",
  accessory: "Accessory",
  film: "Film",
  bag: "Bag",
};

export default function GearCard({ gear }: { gear: Gear }) {
  const img = gear.samplePhoto
    ? urlFor(gear.samplePhoto).width(700).height(500).fit("crop").url()
    : null;

  return (
    <Link
      href={`/gear/${gear.slug.current}`}
      className="group flex flex-col bg-cream border border-roast-muted hover:border-roast-light transition-colors rounded-sm overflow-hidden"
    >
      <div className="aspect-[4/3] overflow-hidden bg-cream-dark relative">
        {img ? (
          <Image
            src={img}
            alt={gear.samplePhoto?.alt ?? gear.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-light">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="3"/>
              <path d="M20 6H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2z"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs text-roast uppercase tracking-widest font-sans">
              {CATEGORY_LABELS[gear.category] ?? gear.category}
            </span>
            <h3 className="font-serif text-lg text-espresso leading-tight group-hover:text-roast transition-colors mt-1">
              {gear.name}
            </h3>
          </div>
          {gear.rating && <StarRating rating={gear.rating} />}
        </div>

        <p className="text-stone text-sm leading-relaxed line-clamp-2 flex-1">
          {gear.shortReview}
        </p>

        {gear.stillOwn === false && (
          <span className="text-xs text-stone-light italic">Sold / No longer own</span>
        )}
      </div>
    </Link>
  );
}
