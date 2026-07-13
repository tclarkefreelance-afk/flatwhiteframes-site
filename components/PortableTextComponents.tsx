import Image from "next/image";
import { urlFor } from "@/lib/sanity.image";
import { PortableTextComponents } from "@portabletext/react";

/** Used for short-description fields (shortNotes / shortReview) on detail pages.
 *  Renders plain paragraphs in the lede style — no headings or block images. */
export const ledeComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-stone text-lg leading-relaxed mt-3 first:mt-0">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-espresso-light">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => (
      <span style={{ textDecoration: "underline" }}>{children}</span>
    ),
  },
};

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1200).url();
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-[3/2] overflow-hidden rounded-sm bg-cream-dark">
            <Image
              src={src}
              alt={value.alt ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-stone text-sm text-center mt-2 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};
