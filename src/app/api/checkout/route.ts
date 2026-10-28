import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getStripe, StripeNotConfiguredError } from "@/lib/stripe";
import { orderSchema } from "@/lib/validators/order";
import { createOrder, DiscountError, hasTooManyPendingOrders, OrderError } from "@/server/orders";
import { createCheckoutSession } from "@/server/payments";
import { prisma } from "@/server/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to check out." }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    getStripe(); // fail early, before any order is created
  } catch (error) {
    if (error instanceof StripeNotConfiguredError) {
      return NextResponse.json({ error: "Payments are not configured on this server yet." }, { status: 503 });
    }
    throw error;
  }

  const body = await req.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (await hasTooManyPendingOrders(userId)) {
    return NextResponse.json({ error: "Too many unpaid checkouts. Please try again later." }, { status: 429 });
  }

  let order;
  try {
    order = await createOrder(userId, parsed.data);
  } catch (error) {
    if (error instanceof OrderError || error instanceof DiscountError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    // A deleted account still holding a valid JWT hits the user foreign key.
    if (typeof error === "object" && error && "code" in error && error.code === "P2003") {
      return NextResponse.json({ error: "Your session is no longer valid. Please sign in again." }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }

  const baseUrl = (process.env.NEXTAUTH_URL ?? new URL(req.url).origin).replace(/\/$/, "");

  try {
    const checkout = await createCheckoutSession(order, baseUrl);
    if (!checkout.url) throw new Error("Stripe returned no checkout URL");
    return NextResponse.json({ url: checkout.url }, { status: 201 });
  } catch (error) {
    console.error("Stripe checkout failed", error);
    // Don't leave an unpayable order behind.
    await prisma.order.delete({ where: { id: order.id } }).catch(() => {});
    return NextResponse.json({ error: "Could not reach the payment provider. Please try again." }, { status: 502 });
  }
}
