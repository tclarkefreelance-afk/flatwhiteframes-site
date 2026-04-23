export default function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={i < rating ? "text-roast" : "text-roast-muted"}
          fill="currentColor"
        >
          <path d="M6 1l1.39 2.82 3.11.45-2.25 2.19.53 3.09L6 8.02 3.22 9.55l.53-3.09L1.5 4.27l3.11-.45z" />
        </svg>
      ))}
    </span>
  );
}
