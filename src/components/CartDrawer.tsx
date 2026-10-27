"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";
import QuantityStepper from "./QuantityStepper";
import { ShippingProgress } from "./OrderSummary";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Slide-over cart. Rendered once in the layout (outside the header, whose
 * backdrop-filter would otherwise trap `position: fixed`).
 */
export default function CartDrawer() {
  const { cart, count, subtotal, hydrated, isOpen, closeCart, setQuantity, removeFromCart } = useCart();
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Close whenever the user navigates.
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  // While open: lock page scroll, move focus in, trap Tab, close on Escape,
  // and hand focus back to whatever opened the drawer.
  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") return closeCart();
      if (e.key !== "Tab" || !panelRef.current) return;

      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [isOpen, closeCart]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
      <div
        onClick={closeCart}
        aria-hidden
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        inert={!isOpen}
        style={{ backgroundImage: "var(--page-gradient)" }}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-bg shadow-2xl transition-transform duration-300 motion-reduce:transition-none ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="display text-xl font-semibold">
            Your cart{hydrated && count > 0 && <span className="ml-2 text-sm font-normal text-muted">({count})</span>}
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="grid size-10 place-items-center rounded-full transition hover:bg-surface-2"
          >
            <X className="size-5" />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div className="grid place-items-center gap-3">
              <span className="grid size-14 place-items-center rounded-full bg-surface-2"><ShoppingBag className="size-6" /></span>
              <p className="display text-xl font-semibold">Your cart is empty</p>
              <p className="text-sm text-muted">Add something you like and it will show up here.</p>
              <Link href="/products" className="btn-primary mt-2">Start shopping</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ShippingProgress subtotal={subtotal} />
              <ul className="space-y-5">
                {cart.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-4">
                    <Link href={`/products/${product.id}`} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                      <ProductImage src={product.image} alt={product.name} sizes="80px" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div className="flex justify-between gap-3">
                        <Link href={`/products/${product.id}`} className="display line-clamp-2 text-sm font-semibold leading-snug hover:text-accent">
                          {product.name}
                        </Link>
                        <p className="text-sm font-semibold">{formatPrice(product.price * quantity)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <QuantityStepper value={quantity} onChange={(n) => setQuantity(product.id, n)} label={`Quantity for ${product.name}`} />
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-danger"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="space-y-4 border-t border-line px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="display text-xl font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted">Shipping and tax are calculated at checkout.</p>
              <Link href="/checkout" className="btn-primary w-full">
                Checkout <ArrowRight className="size-4" />
              </Link>
              <Link href="/cart" className="btn-ghost w-full">View full cart</Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
