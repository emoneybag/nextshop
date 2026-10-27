import "server-only";

import type Stripe from "stripe";
import { prisma } from "@/server/db";
import { getStripe } from "@/lib/stripe";
import type { createOrder } from "@/server/orders";

type PendingOrder = Awaited<ReturnType<typeof createOrder>>;

const isHttps = (url: string) => url.startsWith("https://");

/**
 * Creates a Stripe-hosted Checkout page for a pending order and remembers the
 * session id on the order. Every amount comes from the order row, which was
 * priced from the database, never from the browser.
 */
export async function createCheckoutSession(order: PendingOrder, baseUrl: string) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: "usd",
      unit_amount: item.priceCents,
      product_data: {
        name: item.name,
        // Stripe can only fetch public https images, not local /products/*.jpg files.
        ...(isHttps(item.image) ? { images: [item.image] } : {}),
      },
    },
  }));

  const extra = (name: string, cents: number) => {
    if (cents > 0) {
      lineItems.push({
        quantity: 1,
        price_data: { currency: "usd", unit_amount: cents, product_data: { name } },
      });
    }
  };
  extra("Shipping", order.shippingCents);
  extra("Estimated tax", order.taxCents);

  const session = await getStripe().checkout.sessions.create(
    {
      mode: "payment",
      line_items: lineItems,
      customer_email: order.email,
      client_reference_id: order.id,
      metadata: { orderId: order.id, reference: order.reference },
      success_url: `${baseUrl}/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?canceled=1`,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    { idempotencyKey: `checkout_${order.id}` },
  );

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });
  return session;
}

/**
 * Marks the order paid. Safe to call repeatedly (webhook retries, the success
 * page, or both): it only changes an order that is still PENDING, belongs to
 * this exact session, and whose total matches what Stripe actually charged.
 */
export async function markOrderPaid(session: Stripe.Checkout.Session): Promise<boolean> {
  if (session.payment_status !== "paid") return false;

  const orderId = session.client_reference_id ?? session.metadata?.orderId;
  if (!orderId) return false;

  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      stripeSessionId: session.id,
      status: "PENDING",
      totalCents: session.amount_total ?? -1,
    },
    data: { status: "CONFIRMED", paidAt: new Date(), stripePaymentIntentId: paymentIntent },
  });
  return result.count === 1;
}

/** An expired or failed session can never be paid, so close the order. */
export async function cancelPendingOrder(session: Stripe.Checkout.Session): Promise<boolean> {
  const orderId = session.client_reference_id ?? session.metadata?.orderId;
  if (!orderId) return false;

  const result = await prisma.order.updateMany({
    where: { id: orderId, stripeSessionId: session.id, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
  return result.count === 1;
}

/**
 * Asks Stripe directly whether a pending order was paid. Used when the buyer
 * lands on the success page before the webhook has arrived, which also makes
 * local development work without the Stripe CLI.
 */
export async function syncOrderPayment(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true, stripeSessionId: true },
  });
  if (!order || order.status !== "PENDING" || !order.stripeSessionId) return;

  try {
    const session = await getStripe().checkout.sessions.retrieve(order.stripeSessionId);
    if (session.payment_status === "paid") await markOrderPaid(session);
    else if (session.status === "expired") await cancelPendingOrder(session);
  } catch (error) {
    // Not fatal: the page shows "confirming payment" and the webhook will finish the job.
    console.error("Could not sync order with Stripe", error);
  }
}
