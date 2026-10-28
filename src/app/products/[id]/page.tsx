import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import PurchasePanel from "@/components/PurchasePanel";
import Stars from "@/components/Stars";
import Price from "@/components/Price";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProduct, getRelatedProducts } from "@/server/products";
import { getReviews } from "@/server/reviews";
import ReviewsSection from "@/components/ReviewsSection";
import WishlistButton from "@/components/WishlistButton";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(Number(id));
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(Number(id));
  if (!product) notFound();

  const [related, reviews, session] = await Promise.all([
    getRelatedProducts(product),
    getReviews(product.id),
    getServerSession(authOptions),
  ]);

  return (
    <main className="wrap py-10">
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/products" className="hover:text-ink">Shop</Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-ink">
          {product.category}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="card relative aspect-square overflow-hidden">
          <ProductImage src={product.image} alt={product.name} priority sizes="(min-width:1024px) 50vw, 100vw" />
        </div>

        <div className="flex flex-col">
          <p className="eyebrow">{product.category}</p>
          <h1 className="display mt-2 text-4xl font-bold leading-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-2 text-lg text-muted">{product.tagline}</p>
          <div className="mt-4"><Stars rating={product.rating} reviews={product.reviews} /></div>
          <div className="mt-6"><Price price={product.price} compareAt={product.compareAt} size="lg" /></div>

          <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>

          <PurchasePanel product={product} />
          <div className="mt-4"><WishlistButton productId={product.id} productName={product.name} variant="labelled" /></div>

          <div className="mt-8 grid gap-3 border-t border-line pt-6 text-sm text-muted sm:grid-cols-3">
            <span className="flex items-center gap-2"><Truck className="size-4 text-accent" /> Free over $100</span>
            <span className="flex items-center gap-2"><RotateCcw className="size-4 text-accent" /> 30-day returns</span>
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-accent" /> 2-year warranty</span>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="display text-2xl font-bold">Specifications</h2>
        <dl className="card mt-4 divide-y divide-line">
          {product.specs.map((s) => (
            <div key={s.label} className="grid grid-cols-3 gap-4 px-5 py-4 text-sm">
              <dt className="text-muted">{s.label}</dt>
              <dd className="col-span-2 font-medium">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <ReviewsSection product={product} reviews={reviews} userId={session?.user?.id} />

      <section className="mt-16">
        <h2 className="display text-2xl font-bold">You might also like</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </main>
  );
}
