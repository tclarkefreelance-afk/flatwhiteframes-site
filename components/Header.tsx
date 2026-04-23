import Link from "next/link";
import { getSiteSettings } from "@/lib/queries";

export default async function Header() {
  const s = await getSiteSettings();
  const igUrl = `https://instagram.com/${s.instagramHandle ?? "flatwhiteframes"}`;

  const nav = [
    { href: "/coffee", label: s.navCoffeeLabel },
    { href: "/gear", label: s.navGearLabel },
  ];

  return (
    <header className="border-b border-roast-muted bg-cream sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-espresso tracking-tight hover:text-roast transition-colors">
          {s.siteTitle}
        </Link>
        <nav className="flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-stone hover:text-espresso transition-colors tracking-wide uppercase font-sans"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone hover:text-roast transition-colors"
            aria-label="Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
        </nav>
      </div>
    </header>
  );
}
