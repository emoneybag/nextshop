import "server-only";

import { prisma } from "@/server/db";

export type ReviewView = {
  id: string;
  userId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verified: boolean;
};

const PAID = ["CONFIRMED", "SHIPPED", "DELIVERED"] as const;

/** Reviews for a product, with a "verified purchase" flag per reviewer. */
export async function getReviews(productId: number): Promise<ReviewView[]> {
  const rows = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { username: true } } },
  });
  if (rows.length === 0) return [];

  const buyers = await prisma.order.findMany({
    where: {
      userId: { in: rows.map((r) => r.userId) },
      status: { in: [...PAID] },
      items: { some: { productId } },
    },
    select: { userId: true },
  });
  const verified = new Set(buyers.map((b) => b.userId));

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    author: r.user.username,
    rating: r.rating,
    title: r.title,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
    verified: verified.has(r.userId),
  }));
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Creates or edits the user's review and keeps the product's average in sync.
 * The average is updated incrementally so the seeded baseline ratings keep
 * counting alongside real reviews.
 */
export async function saveReview(userId: string, input: { productId: number; rating: number; title: string; body: string }) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findFirst({ where: { id: input.productId, active: true } });
    if (!product) return null;

    const existing = await tx.review.findUnique({
      where: { productId_userId: { productId: input.productId, userId } },
    });

    let reviews = product.reviews;
    let sum = product.rating * product.reviews;
    if (existing) {
      sum += input.rating - existing.rating;
    } else {
      sum += input.rating;
      reviews += 1;
    }

    await tx.review.upsert({
      where: { productId_userId: { productId: input.productId, userId } },
      create: { productId: input.productId, userId, rating: input.rating, title: input.title, body: input.body },
      update: { rating: input.rating, title: input.title, body: input.body },
    });
    await tx.product.update({
      where: { id: input.productId },
      data: { reviews, rating: reviews ? round2(sum / reviews) : 0 },
    });
    return { updated: !!existing };
  });
}

export async function deleteReview(userId: string, productId: number) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.review.findUnique({ where: { productId_userId: { productId, userId } } });
    if (!existing) return false;
    const product = await tx.product.findUnique({ where: { id: productId } });
    await tx.review.delete({ where: { id: existing.id } });
    if (product) {
      const reviews = Math.max(0, product.reviews - 1);
      const sum = product.rating * product.reviews - existing.rating;
      await tx.product.update({ where: { id: productId }, data: { reviews, rating: reviews ? round2(sum / reviews) : 0 } });
    }
    return true;
  });
}
