"use client";

import { useState } from "react";

const SIZES = [
  { id: "a4", label: "A4", dimensions: "21 × 29.7 cm", price: "£20" },
  { id: "a3", label: "A3", dimensions: "29.7 × 42 cm", price: "£28" },
  { id: "a2", label: "A2", dimensions: "42 × 59.4 cm", price: "£35" },
] as const;

type SizeId = (typeof SIZES)[number]["id"];

export default function PrintSizeSelector({
  printName,
  printSlug,
}: {
  printName: string;
  printSlug: string;
}) {
  const [selected, setSelected] = useState<SizeId>("a3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedSize = SIZES.find((s) => s.id === selected)!;

  async function handleBuy() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printSlug, size: selected }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Failed to create checkout session");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Size selector */}
      <div className="mb-6">
        <p className="text-xs text-roast uppercase tracking-widest font-sans mb-3">
          Select a size
        </p>
        <div className="flex flex-col gap-2">
          {SIZES.map((size) => (
            <label
              key={size.id}
              className={`flex items-center justify-between px-4 py-3 border rounded cursor-pointer transition-colors ${
                selected === size.id
                  ? "border-espresso bg-espresso/5"
                  : "border-roast-muted hover:border-roast"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="print-size"
                  value={size.id}
                  checked={selected === size.id}
                  onChange={() => setSelected(size.id)}
                  className="accent-espresso"
                />
                <span className="font-sans font-medium text-espresso">{size.label}</span>
                <span className="text-stone text-sm">{size.dimensions}</span>
              </div>
              <span className="font-serif text-espresso font-medium">{size.price}</span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-espresso text-cream font-sans text-sm uppercase tracking-widest py-3 px-6 hover:bg-espresso-light transition-colors disabled:opacity-50"
      >
        {loading ? "Redirecting to checkout…" : `Buy this print — ${selectedSize.price}`}
      </button>

      <p className="text-xs text-stone-light text-center mt-3">
        Secure checkout via Stripe
      </p>
    </div>
  );
}
