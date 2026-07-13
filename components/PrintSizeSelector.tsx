"use client";

import { useState } from "react";

const SIZES = [
  { id: "a4", label: "A4", dimensions: "21 × 29.7 cm", price: "£20" },
  { id: "a3", label: "A3", dimensions: "29.7 × 42 cm", price: "£28" },
  { id: "a2", label: "A2", dimensions: "42 × 59.4 cm", price: "£35" },
] as const;

type SizeId = (typeof SIZES)[number]["id"];
type Stage = "idle" | "form" | "success";

export default function PrintSizeSelector({ printName }: { printName: string }) {
  const [selected, setSelected] = useState<SizeId>("a3");
  const [stage, setStage] = useState<Stage>("idle");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedSize = SIZES.find((s) => s.id === selected)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, print: printName, size: selected }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStage("success");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
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
                <span className="font-sans font-medium text-espresso">
                  {size.label}
                </span>
                <span className="text-stone text-sm">{size.dimensions}</span>
              </div>
              <span className="font-serif text-espresso font-medium">{size.price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* CTA / form area */}
      {stage === "idle" && (
        <button
          onClick={() => setStage("form")}
          className="w-full bg-espresso text-cream font-sans text-sm uppercase tracking-widest py-3 px-6 hover:bg-espresso-light transition-colors"
        >
          Buy this print — {selectedSize.price}
        </button>
      )}

      {stage === "form" && (
        <div className="border border-roast-muted p-5 bg-cream-dark">
          <p className="font-serif text-lg text-espresso mb-1">Coming soon</p>
          <p className="text-stone text-sm mb-4 leading-relaxed">
            Prints aren&apos;t available to buy yet. Join the waitlist and we&apos;ll let
            you know as soon as the shop opens.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-roast-muted bg-cream px-4 py-2.5 text-sm text-espresso placeholder:text-stone-light focus:outline-none focus:border-espresso"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-espresso text-cream font-sans text-sm uppercase tracking-widest py-2.5 px-4 hover:bg-espresso-light transition-colors disabled:opacity-50"
              >
                {submitting ? "Joining…" : "Join the waitlist"}
              </button>
              <button
                type="button"
                onClick={() => setStage("idle")}
                className="px-4 py-2.5 border border-roast-muted text-stone text-sm hover:border-espresso hover:text-espresso transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {stage === "success" && (
        <div className="border border-roast-muted p-5 bg-cream-dark text-center">
          <p className="font-serif text-lg text-espresso mb-1">You&apos;re on the list</p>
          <p className="text-stone text-sm leading-relaxed">
            We&apos;ll email you at <span className="text-espresso">{email}</span> when{" "}
            {printName} ({selectedSize.label}, {selectedSize.price}) is available to order.
          </p>
        </div>
      )}
    </div>
  );
}
