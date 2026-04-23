export default function Footer() {
  return (
    <footer className="border-t border-roast-muted mt-24">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-serif text-stone text-sm italic">
          Flat White Frames &mdash; coffee & cameras
        </p>
        <a
          href="https://instagram.com/flatwhiteframes"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-stone hover:text-roast transition-colors tracking-wide"
        >
          @flatwhiteframes
        </a>
      </div>
    </footer>
  );
}
