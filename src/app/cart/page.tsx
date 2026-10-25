"use client";

import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import QuantityStepper from "@/components/QuantityStepper";
import { ShippingProgress, TotalsTable } from "@/components/OrderSummary";
import { formatPrice } from "@/lib/format";
import { calculateTotals } from "@/lib/pricing";

export default function CartPage() {
  const { cart, subtotal, hydrated, setQuantity, removeFromCart } = useCart();
  const totals = calculateTotals(subtotal);

  return (
    <main className="wrap py-12">
      <h1 className="display text-4xl font-bold sm:text-5xl">Your cart</h1>

      {!hydrated ? (
        <div className="mt-10 h-48 animate-pulse rounded-2xl bg-surface" aria-label="Loading cart" />
      ) : cart.length === 0 ? (
        <div className="card mt-10 grid place-items-center gap-4 px-6 py-24 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-surface-2 text-accent">
            <ShoppingBag className="size-7" />
          </span>
          <p className="display text-2xl font-semibold">Your cart is empty</p>
          <p className="text-muted">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products" className="btn-primary mt-2">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section aria-label="Cart items">
            <ShippingProgress subtotal={subtotal} />
            <ul className="space-y-4">
              {cart.map(({ product, quantity }) => (
                <li key={product.id} className="card flex gap-4 p-4 sm:gap-6">
                  <Link href={`/products/${product.id}`} className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:size-28">
                    <ProductImage src={product.image} alt={product.name} sizes="112px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <Link href={`/products/${product.id}`} className="display block truncate font-semibold hover:text-accent">
                          {product.name}
                        </Link>
                        <p className="text-sm text-muted">{product.category} · {formatPrice(product.price)} each</p>
                      </div>
                      <p className="display font-semibold">{formatPrice(product.price * quantity)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <QuantityStepper value={quantity} onChange={(n) => setQuantity(product.id, n)} label={`Quantity for ${product.name}`} />
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="flex items-center gap-1.5 text-sm text-muted transition hover:text-danger"
                      >
                        <Trash2 className="size-4" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="card h-fit p-6 lg:sticky lg:top-32">
            <h2 className="display mb-5 text-xl font-semibold">Order summary</h2>
            <TotalsTable totals={totals} />
            <Link href="/checkout" className="btn-primary mt-6 w-full">
              Checkout <ArrowRight className="size-4" />
            </Link>
            <Link href="/products" className="mt-3 block text-center text-sm text-muted hover:text-ink">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
