import Image from "next/image";
import { urlFor } from "@/lib/sanity.image";
import { PortableTextComponents } from "@portabletext/react";

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
