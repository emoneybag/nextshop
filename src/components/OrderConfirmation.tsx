"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useOrders } from "@/context/OrderContext";
import { formatPrice } from "@/lib/format";

export default function OrderConfirmation({ orderId }: { orderId?: string }) {
  const { getOrder, hydrated } = useOrders();
  const order = orderId ? getOrder(orderId) : undefined;

  return (
    <main className="wrap grid place-items-center py-20">
      <div className="card glow w-full max-w-xl p-10 text-center">
        <CheckCircle2 className="mx-auto size-14 text-accent" />
        <h1 className="display mt-5 text-4xl font-bold">Order confirmed</h1>
        <p className="mt-3 text-muted">
          Thanks for shopping with NextShop. This is a demo, so nothing was charged or shipped.
        </p>

        {hydrated && order && (
          <dl className="mt-8 divide-y divide-line rounded-xl border border-line text-left text-sm">
            <div className="flex justify-between px-4 py-3"><dt className="text-muted">Reference</dt><dd className="font-mono">{order.reference}</dd></div>
            <div className="flex justify-between px-4 py-3"><dt className="text-muted">Items</dt><dd>{order.items.reduce((n, i) => n + i.quantity, 0)}</dd></div>
            <div className="flex justify-between px-4 py-3"><dt className="text-muted">Total</dt><dd className="font-semibold">{formatPrice(order.total)}</dd></div>
            <div className="flex justify-between px-4 py-3"><dt className="text-muted">Confirmation sent to</dt><dd>{order.customerEmail}</dd></div>
          </dl>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/orders" className="btn-primary">View my orders</Link>
          <Link href="/products" className="btn-ghost">Keep shopping</Link>
        </div>
      </div>
    </main>
  );
}
