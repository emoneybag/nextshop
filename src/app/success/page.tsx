import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { getOrderForUser } from "@/server/orders";
import { syncOrderPayment } from "@/server/payments";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import PendingRefresh from "@/components/PendingRefresh";

export const metadata: Metadata = { title: "Order status" };

type Props = { searchParams: Promise<{ order?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const { order: orderId } = await searchParams;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");
  if (!orderId) notFound();

  // Scoped to the signed-in user, so nobody can view someone else's order.
  let order = await getOrderForUser(orderId, session.user.id);
  if (!order) notFound();

  // The buyer can arrive before Stripe's webhook does, so ask Stripe directly.
  if (order.status === "PENDING") {
    await syncOrderPayment(order.id);
    order = (await getOrderForUser(orderId, session.user.id)) ?? order;
  }

  const units = order.items.reduce((n, i) => n + i.quantity, 0);
  const paid = order.status !== "PENDING" && order.status !== "CANCELLED";

  return (
    <main className="wrap grid place-items-center py-20">
      <div className="card glow w-full max-w-xl p-10 text-center">
        {paid ? (
          <>
            <ClearCartOnMount />
            <CheckCircle2 className="mx-auto size-14" />
            <h1 className="display mt-5 text-4xl font-bold">Order confirmed</h1>
            <p className="mt-3 text-muted">
              Thanks for shopping with NextShop. Payment received in Stripe test mode, so no real money moved.
            </p>
          </>
        ) : order.status === "PENDING" ? (
          <>
            <Clock className="mx-auto size-14" />
            <h1 className="display mt-5 text-4xl font-bold">Payment pending</h1>
            <p className="mt-3 text-muted">We haven&apos;t received confirmation from Stripe yet.</p>
            <PendingRefresh />
          </>
        ) : (
          <>
            <XCircle className="mx-auto size-14" />
            <h1 className="display mt-5 text-4xl font-bold">Order cancelled</h1>
            <p className="mt-3 text-muted">This payment did not go through and you have not been charged. Your cart was kept.</p>
          </>
        )}

        <dl className="mt-8 divide-y divide-line rounded-xl border border-line text-left text-sm">
          <div className="flex justify-between px-4 py-3"><dt className="text-muted">Reference</dt><dd className="font-mono">{order.reference}</dd></div>
          <div className="flex justify-between px-4 py-3"><dt className="text-muted">Items</dt><dd>{units}</dd></div>
          {order.discount > 0 && (
            <div className="flex justify-between px-4 py-3"><dt className="text-muted">Discount{order.discountCode ? ` (${order.discountCode})` : ""}</dt><dd>−{formatPrice(order.discount)}</dd></div>
          )}
          <div className="flex justify-between px-4 py-3"><dt className="text-muted">Total</dt><dd className="font-semibold">{formatPrice(order.total)}</dd></div>
          <div className="flex justify-between gap-4 px-4 py-3"><dt className="text-muted">Receipt sent to</dt><dd className="truncate">{order.email}</dd></div>
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {paid ? (
            <>
              <Link href="/orders" className="btn-primary">View my orders</Link>
              <Link href="/products" className="btn-ghost">Keep shopping</Link>
            </>
          ) : (
            <Link href="/checkout" className="btn-primary">Back to checkout</Link>
          )}
        </div>
      </div>
    </main>
  );
}
