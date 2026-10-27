"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";

/** Empties the cart once, after a payment is confirmed. */
export default function ClearCartOnMount() {
  const { clearCart, hydrated } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (hydrated && !done.current) {
      done.current = true;
      clearCart();
    }
  }, [hydrated, clearCart]);

  return null;
}
