import "server-only";

import { connection } from "next/server";
import { prisma } from "@/server/db";
import { toProduct } from "@/server/products";
import type { Product } from "@/types/product";

export async function getWishlistIds(userId: string): Promise<number[]> {
  const rows = await prisma.wishlistItem.findMany({
    where: { userId, product: { active: true } },
    select: { productId: true },
  });
  return rows.map((r) => r.productId);
}

export async function getWishlistProducts(userId: string): Promise<Product[]> {
  await connection();
  const rows = await prisma.wishlistItem.findMany({
    where: { userId, product: { active: true } },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });
  return rows.map((r) => toProduct(r.product));
}

/** Idempotent: adding twice is fine. Returns false if the product doesn't exist. */
export async function addToWishlist(userId: string, productId: number): Promise<boolean> {
  const product = await prisma.product.findFirst({ where: { id: productId, active: true }, select: { id: true } });
  if (!product) return false;
  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId },
    update: {},
  });
  return true;
}

export async function removeFromWishlist(userId: string, productId: number) {
  await prisma.wishlistItem.deleteMany({ where: { userId, productId } });
}
