import "server-only";

import { randomInt } from "node:crypto";
import { connection } from "next/server";
import { prisma } from "@/server/db";
import { calculateTotals } from "@/lib/pricing";
import type { OrderInput } from "@/lib/validators/order";
import type { Order } from "@/types/order";
import type { Prisma } from "@/generated/prisma/client";

const orderInclude = { items: { orderBy: { id: "asc" } } } satisfies Prisma.OrderInclude;
type OrderRow = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    email: row.email,
    subtotal: row.subtotalCents / 100,
    shipping: row.shippingCents / 100,
    tax: row.taxCents / 100,
    total: row.totalCents / 100,
    shippingAddress: {
      fullName: row.shipName,
      address: row.shipAddress,
      city: row.shipCity,
      region: row.shipRegion,
      postalCode: row.shipPostalCode,
      country: row.shipCountry,
    },
    items: row.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.name,
      image: i.image,
      price: i.priceCents / 100,
      quantity: i.quantity,
    })),
  };
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  await connection();
  const rows = await prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

/** Returns the order only if it belongs to `userId`. */
export async function getOrderForUser(id: string, userId: string): Promise<Order | null> {
  await connection();
  const row = await prisma.order.findFirst({
    where: { id, userId },
    include: orderInclude,
  });
  return row ? toOrder(row) : null;
}

export async function countOrdersForUser(userId: string): Promise<number> {
  await connection();
  return prisma.order.count({ where: { userId } });
}

// No 0/O/1/I so references are easy to read out over the phone.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const makeReference = () =>
  "NS-" + Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");

export class OrderError extends Error {}

/**
 * Creates an order. Prices are always read from the database, never from the
 * client, so the cart can't be tampered with.
 */
export async function createOrder(userId: string, input: OrderInput) {
  // Merge duplicate lines so one product appears once.
  const wanted = new Map<number, number>();
  for (const { productId, quantity } of input.items) {
    wanted.set(productId, Math.min(10, (wanted.get(productId) ?? 0) + quantity));
  }

  const products = await prisma.product.findMany({
    where: { id: { in: [...wanted.keys()] }, active: true },
  });
  if (products.length !== wanted.size) {
    throw new OrderError("Some items in your cart are no longer available.");
  }

  const subtotalCents = products.reduce(
    (sum, p) => sum + p.priceCents * (wanted.get(p.id) ?? 0),
    0,
  );
  const totals = calculateTotals(subtotalCents / 100);
  const toCents = (n: number) => Math.round(n * 100);

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await prisma.order.create({
        data: {
          reference: makeReference(),
          userId,
          email: input.email.toLowerCase(),
          subtotalCents: toCents(totals.subtotal),
          shippingCents: toCents(totals.shipping),
          taxCents: toCents(totals.tax),
          totalCents: toCents(totals.total),
          shipName: input.shipping.fullName,
          shipAddress: input.shipping.address,
          shipCity: input.shipping.city,
          shipRegion: input.shipping.region,
          shipPostalCode: input.shipping.postalCode,
          shipCountry: input.shipping.country,
          items: {
            create: products.map((p) => ({
              productId: p.id,
              name: p.name,
              image: p.image,
              priceCents: p.priceCents,
              quantity: wanted.get(p.id)!,
            })),
          },
        },
        select: { id: true, reference: true, totalCents: true },
      });
    } catch (error) {
      // Reference collision: pick a new one and retry.
      const code = typeof error === "object" && error && "code" in error ? error.code : null;
      if (code !== "P2002") throw error;
    }
  }
  throw new Error("Could not generate a unique order reference");
}
