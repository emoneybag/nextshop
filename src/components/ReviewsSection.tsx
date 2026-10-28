import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import type { ReviewView } from "@/server/reviews";
import type { Product } from "@/types/product";
import Stars from "./Stars";
import ReviewForm from "./ReviewForm";

type Props = { product: Product; reviews: ReviewView[]; userId?: string };

export default function ReviewsSection({ product, reviews, userId }: Props) {
  const mine = reviews.find((r) => r.userId === userId);

  return (
    <section className="mt-16" aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="reviews-heading" className="display text-2xl font-bold">Customer reviews</h2>
        <div className="flex items-center gap-3">
          <span className="display text-3xl font-bold">{product.rating.toFixed(1)}</span>
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-4">
          {reviews.length === 0 && (
            <li className="card p-8 text-center text-sm text-muted">No written reviews yet. Be the first to share your thoughts.</li>
          )}
          {reviews.map((r) => (
            <li key={r.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Stars rating={r.rating} />
                <time dateTime={r.createdAt} className="text-xs text-muted">
                  {new Date(r.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                </time>
              </div>
              <h3 className="display mt-2 font-semibold">{r.title}</h3>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">{r.body}</p>
              <p className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
                <span>{r.author}</span>
                {r.verified && (
                  <span className="flex items-center gap-1 text-ink"><BadgeCheck className="size-3.5" /> Verified purchase</span>
                )}
              </p>
            </li>
          ))}
        </ul>

        <div>
          {userId ? (
            <ReviewForm key={mine?.id ?? "new"} productId={product.id} existing={mine && { rating: mine.rating, title: mine.title, body: mine.body }} />
          ) : (
            <div className="card grid gap-3 p-6 text-center">
              <p className="text-sm text-muted">Sign in to share your experience with this product.</p>
              <Link href={`/login?callbackUrl=/products/${product.id}`} className="btn-primary">Sign in to review</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
