import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order confirmed — Flat White Frames",
};

export default function PrintSuccessPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 text-center">
      <p className="text-xs text-roast uppercase tracking-widest font-sans mb-4">Order confirmed</p>
      <h1 className="font-serif text-4xl sm:text-5xl text-espresso mb-6">
        Thank you for your order
      </h1>
      <p className="text-stone text-lg leading-relaxed max-w-md mx-auto mb-10">
        Your print is on its way to the press. You&apos;ll receive a confirmation email
        shortly with your order details and tracking information once it ships.
      </p>
      <Link
        href="/prints"
        className="inline-block border border-espresso text-espresso font-sans text-sm uppercase tracking-widest px-6 py-3 hover:bg-espresso hover:text-cream transition-colors"
      >
        Back to prints
      </Link>
    </div>
  );
}
