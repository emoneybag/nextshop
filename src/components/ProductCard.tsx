"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";
import Link from "next/link";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {

  const { addToCart } = useCart();


  return (

    <div className="border rounded p-5">

      <Link href={`/products/${product.id}`}>

      <h2 className="text-xl font-bold">
        {product.name}
      </h2>

      </Link>

      <p className="text-gray-600">
        {product.description}
      </p>

      <p className="mt-3">
        Category: {product.category}
      </p>

      <p className="font-bold mt-2">
        ${product.price}
      </p>


      <button
        onClick={() => addToCart(product)}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>

    </div>

  );

}