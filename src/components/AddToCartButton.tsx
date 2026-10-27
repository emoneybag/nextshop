"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  quantity?: number;
  compact?: boolean;
  className?: string;
};

export default function AddToCartButton({
  product,
  quantity = 1,
  compact = false,
  className = "",
}: Props) {
  const { addToCart, openCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <button
      type="button"
      onClick={() => {
        addToCart(product, quantity);
        setAdded(true);
        openCart();
      }}
      className={`btn-primary ${compact ? "shrink-0 !px-4 !py-2.5" : "w-full"} ${className}`}
      aria-live="polite"
    >
      {added ? (
        <>
          <Check className="size-4" aria-hidden /> Added
        </>
      ) : (
        <>
          <ShoppingBag className="size-4" aria-hidden />
          {compact ? "Add" : "Add to cart"}
        </>
      )}
    </button>
  );
}
