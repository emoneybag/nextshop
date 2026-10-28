import "server-only";

import { connection } from "next/server";
import { prisma } from "@/server/db";
import type { OrderStatus } from "@/generated/prisma/client";

const PAID: OrderStatus[] = ["CONFIRMED", "SHIPPED", "DELIVERED"];

export async function getDashboard() {
  await connection();
  const [revenue, paidOrders, pending, users, products, recent, lowRated] = await Promise.all([
    prisma.order.aggregate({ _sum: { totalCents: true }, where: { status: { in: PAID } } }),
    prisma.order.count({ where: { status: { in: PAID } } }),
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.user.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.order.findMany({
      where: { status: { not: "PENDING" } },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { username: true } } },
    }),
    prisma.review.count({ where: { rating: { lte: 2 } } }),
  ]);
  return {
    revenueCents: revenue._sum.totalCents ?? 0,
    paidOrders,
    toShip: pending,
    users,
    products,
    recent,
    lowRated,
  };
}

export async function getAdminOrders(status?: OrderStatus) {
  await connection();
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { username: true, email: true } }, items: true },
  });
}

export async function getAdminProducts() {
  await connection();
  return prisma.product.findMany({ orderBy: { id: "asc" } });
}

export async function getAdminProduct(id: number) {
  await connection();
  if (!Number.isInteger(id) || id < 1 || id > 2_147_483_647) return null;
  return prisma.product.findUnique({ where: { id } });
}

export async function getAdminDiscounts() {
  await connection();
  return prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });
}
