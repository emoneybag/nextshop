import { Star } from "lucide-react";

export default function Stars({
  rating,
  reviews,
}: {
  rating: number;
  reviews?: number;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted">
      <div className="flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`size-3.5 ${
              i <= Math.round(rating) ? "fill-accent text-accent" : "text-line"
            }`}
          />
        ))}
      </div>
      <span className="sr-only">{rating} out of 5 stars</span>
      <span>
        {rating.toFixed(1)}
        {reviews !== undefined && ` (${reviews})`}
      </span>
    </div>
  );
}
