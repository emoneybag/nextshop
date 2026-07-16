"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

export default function AddToCartButton({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="mt-6 bg-black text-white px-5 py-3 rounded"
    >
      Add To Cart
    </button>
  );
}