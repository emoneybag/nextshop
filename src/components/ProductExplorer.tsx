"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import ProductCard from "./ProductCard";
import { categories } from "@/data/categories";
import type { Product } from "@/types/product";

const sorts = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
} as const;
type SortKey = keyof typeof sorts;

export default function ProductExplorer({
  products,
  initialCategory,
}: {
  products: Product[];
  initialCategory: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q || `${p.name} ${p.tagline} ${p.category}`.toLowerCase().includes(q)),
    );
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [products, category, query, sort]);

  const chips = ["All", ...categories.map((c) => c.name)];

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                category === c
                  ? "border-accent bg-accent text-accent-ink font-semibold"
                  : "border-line text-muted hover:border-accent hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="field !pl-11"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort products"
            className="field !w-auto"
          >
            {Object.entries(sorts).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {visible.length} {visible.length === 1 ? "product" : "products"}
      </p>

      {visible.length === 0 ? (
        <div className="card mt-6 grid place-items-center gap-3 px-6 py-20 text-center">
          <SearchX className="size-10 text-muted" />
          <p className="display text-xl font-semibold">No matches found</p>
          <p className="text-sm text-muted">Try a different search or category.</p>
          <button
            type="button"
            className="btn-ghost mt-2"
            onClick={() => { setCategory("All"); setQuery(""); }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      )}
    </>
  );
}
