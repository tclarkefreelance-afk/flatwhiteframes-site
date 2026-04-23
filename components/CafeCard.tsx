import Link from "next/link";
import Image from "next/image";
import { Cafe } from "@/lib/queries";
import { urlFor } from "@/lib/sanity.image";
import StarRating from "./StarRating";

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

export default function CafeCard({ cafe }: { cafe: Cafe }) {
  const img = cafe.coverImage
    ? urlFor(cafe.coverImage).width(800).height(560).fit("crop").url()
    : null;

  return (
    <Link
      href={`/coffee/${cafe.slug.current}`}
      className="group flex flex-col bg-cream border border-roast-muted hover:border-roast-light transition-colors rounded-sm overflow-hidden"
    >
      <div className="aspect-[16/10] overflow-hidden bg-cream-dark relative">
        {img ? (
          <Image
            src={img}
            alt={cafe.coverImage?.alt ?? cafe.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-light">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg text-espresso leading-tight group-hover:text-roast transition-colors">
              {cafe.name}
            </h3>
            <p className="text-stone text-sm mt-0.5">
              {cafe.city}{cafe.country ? `, ${cafe.country}` : ""}
            </p>
          </div>
          <StarRating rating={cafe.rating} />
        </div>

        <p className="text-stone text-sm leading-relaxed line-clamp-2 flex-1">
          {cafe.shortNotes}
        </p>

        {cafe.tags && cafe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {cafe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-roast-muted text-espresso-light rounded-full"
              >
                {TAG_LABELS[tag] ?? tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
