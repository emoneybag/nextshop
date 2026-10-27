import "server-only";

import Stripe from "stripe";

export class StripeNotConfiguredError extends Error {
  constructor() {
    super("STRIPE_SECRET_KEY is not set");
  }
}

let client: Stripe | undefined;

/**
 * Lazily creates the Stripe client so `next build` works without keys.
 * STRIPE_MOCK_PORT points the SDK at a local fake server (like `stripe-mock`)
 * and is only meant for automated tests.
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new StripeNotConfiguredError();

  client ??= new Stripe(
    key,
    process.env.STRIPE_MOCK_PORT
      ? { host: "localhost", port: process.env.STRIPE_MOCK_PORT, protocol: "http", maxNetworkRetries: 0 }
      : { maxNetworkRetries: 2 },
  );
  return client;
}
