import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import { cancelPendingOrder, markOrderPaid } from "@/server/payments";

// Stripe calls this endpoint when a payment completes or a session expires.
// The raw request body is required to verify the signature, so don't parse it as JSON first.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await markOrderPaid(event.data.object);
        break;
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired":
        await cancelPendingOrder(event.data.object);
        break;
    }
  } catch (error) {
    console.error("Webhook handler failed", error);
    // A 500 makes Stripe retry the delivery later.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
