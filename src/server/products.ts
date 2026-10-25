import "server-only";

import { cache } from "react";
import { connection } from "next/server";
import { prisma } from "@/server/db";
import type { Product as ProductRow } from "@/generated/prisma/client";
import type { Category, Product } from "@/types/product";

const BADGES = ["New", "Sale", "Best seller"] as const;

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    price: row.priceCents / 100,
    compareAt: row.compareAtCents ? row.compareAtCents / 100 : undefined,
    category: row.category as Category,
    image: row.image,
    rating: row.rating,
    reviews: row.reviews,
    badge: BADGES.find((b) => b === row.badge),
    features: row.features,
    specs: Array.isArray(row.specs) ? (row.specs as Product["specs"]) : [],
  };
}

// `connection()` opts these queries out of prerendering, so `next build`
// doesn't need a database and every request sees fresh data.
export const getProducts = cache(async (): Promise<Product[]> => {
  await connection();
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: { id: "asc" },
  });
  return rows.map(toProduct);
});

export const getProduct = cache(async (id: number): Promise<Product | null> => {
  if (!Number.isInteger(id) || id < 1 || id > 2_147_483_647) return null;
  await connection();
  const row = await prisma.product.findFirst({ where: { id, active: true } });
  return row ? toProduct(row) : null;
});

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const others = all.filter((p) => p.id !== product.id);
  return [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category),
  ].slice(0, limit);
}
