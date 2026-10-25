"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import AddToCartButton from "./AddToCartButton";
import QuantityStepper from "./QuantityStepper";

export default function PurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <QuantityStepper value={quantity} onChange={setQuantity} />
      <AddToCartButton product={product} quantity={quantity} className="!w-auto flex-1 sm:flex-none sm:min-w-56" />
    </div>
  );
}
