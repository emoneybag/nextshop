import "server-only";

import { prisma } from "@/server/db";
import { formatPrice } from "@/lib/format";

export class DiscountError extends Error {}

export type AppliedDiscount = { code: string; discountCents: number; label: string };

/**
 * Validates a code against a subtotal and returns the amount it takes off.
 * Throws DiscountError with a message that is safe to show to shoppers.
 */
export async function resolveDiscount(rawCode: string, subtotalCents: number): Promise<AppliedDiscount> {
  const code = rawCode.trim().toUpperCase();
  const row = await prisma.discountCode.findUnique({ where: { code } });

  if (!row || !row.active) throw new DiscountError("That code isn't valid.");
  if (row.expiresAt && row.expiresAt < new Date()) throw new DiscountError("That code has expired.");
  if (row.maxRedemptions !== null && row.redeemedCount >= row.maxRedemptions) {
    throw new DiscountError("That code has reached its usage limit.");
  }
  if (subtotalCents < row.minSubtotalCents) {
    throw new DiscountError(`Spend at least ${formatPrice(row.minSubtotalCents / 100)} to use this code.`);
  }

  const raw = row.type === "PERCENT" ? Math.floor((subtotalCents * row.value) / 100) : row.value;
  const discountCents = Math.min(raw, subtotalCents);
  const label = row.type === "PERCENT" ? `${row.value}% off` : `${formatPrice(row.value / 100)} off`;

  return { code: row.code, discountCents, label };
}
