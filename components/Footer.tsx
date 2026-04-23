import { getSiteSettings } from "@/lib/queries";

export default async function Footer() {
  const s = await getSiteSettings();
  const handle = s.instagramHandle ?? "flatwhiteframes";
  const igUrl = `https://instagram.com/${handle}`;

  return (
    <footer className="border-t border-roast-muted mt-24">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-serif text-stone text-sm italic">
          {s.footerTagline}
        </p>
        <a
          href={igUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-stone hover:text-roast transition-colors tracking-wide"
        >
          @{handle}
        </a>
      </div>
    </footer>
  );
}
