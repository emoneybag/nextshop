"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Star } from "lucide-react";

type Props = { productId: number; existing?: { rating: number; title: string; body: string } };

export default function ReviewForm({ productId, existing }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating: rating || undefined, title, body }),
    });
    setBusy(false);
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error ?? "Could not save your review");
    if (!existing) { setRating(0); setTitle(""); setBody(""); }
    router.refresh();
  }

  async function remove() {
    setBusy(true);
    await fetch(`/api/reviews?productId=${productId}`, { method: "DELETE" });
    setBusy(false);
    setRating(0); setTitle(""); setBody("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} noValidate className="card space-y-4 p-6">
      <h3 className="display text-lg font-semibold">{existing ? "Edit your review" : "Write a review"}</h3>
      <fieldset>
        <legend className="label">Your rating</legend>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              className="rounded p-1 transition hover:scale-110"
            >
              <Star className={`size-7 ${n <= rating ? "fill-accent text-accent" : "text-line"}`} />
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="r-title" className="label">Title</label>
        <input id="r-title" className="field" value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="r-body" className="label">Review</label>
        <textarea id="r-body" rows={4} className="field" value={body} maxLength={1000} onChange={(e) => setBody(e.target.value)} />
      </div>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={busy}>{busy && <Loader2 className="size-4 animate-spin" />}{existing ? "Update review" : "Post review"}</button>
        {existing && <button type="button" onClick={remove} disabled={busy} className="text-sm text-muted hover:text-danger">Delete my review</button>}
      </div>
    </form>
  );
}
