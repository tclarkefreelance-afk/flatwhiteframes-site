"use client";

// Thin client wrapper that owns the dynamic import.
// Keeping the `loading` JSX here (in a client file) avoids a Turbopack
// compilation error that occurs when JSX appears inside next/dynamic's
// `loading` option inside a server component file.

import dynamic from "next/dynamic";
import type { Cafe } from "@/lib/queries";

type CafePin = Pick<Cafe, "_id" | "name" | "slug" | "city" | "rating" | "latitude" | "longitude">;

const CafeMap = dynamic(() => import("./CafeMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-sm bg-cream-dark animate-pulse"
      style={{ height: 420 }}
      aria-label="Loading map…"
    />
  ),
});

export default function CafeMapDynamic({ cafes }: { cafes: CafePin[] }) {
  return <CafeMap cafes={cafes} />;
}
