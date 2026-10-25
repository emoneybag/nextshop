import Link from "next/link";
import type { Product } from "@/types/product";
import ProductImage from "./ProductImage";
import AddToCartButton from "./AddToCartButton";
import Stars from "./Stars";
import Price from "./Price";

const badgeStyle: Record<NonNullable<Product["badge"]>, string> = {
  New: "bg-accent text-accent-ink",
  Sale: "bg-danger text-white",
  "Best seller": "bg-ink text-bg",
};

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-accent/50">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-surface-2"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="transition duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeStyle[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted">{product.category}</p>
          <h3 className="display text-base font-semibold leading-snug">
            <Link href={`/products/${product.id}`} className="hover:text-accent">
              {product.name}
            </Link>
          </h3>
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5 pt-1">
          <Price price={product.price} compareAt={product.compareAt} />
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
