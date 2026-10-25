import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { PackageOpen } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { getOrdersForUser } from "@/server/orders";
import OrderItemsList from "@/components/OrderItemsList";

export const metadata: Metadata = { title: "Your orders" };

const statusLabel = { CONFIRMED: "Confirmed", SHIPPED: "Shipped", DELIVERED: "Delivered", CANCELLED: "Cancelled" } as const;

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/orders");

  const orders = await getOrdersForUser(session.user.id);

  return (
    <main className="wrap py-12">
      <h1 className="display text-4xl font-bold sm:text-5xl">Your orders</h1>

      {orders.length === 0 ? (
        <div className="card mt-10 grid place-items-center gap-4 px-6 py-24 text-center">
          <PackageOpen className="size-10 text-muted" />
          <p className="display text-2xl font-semibold">No orders yet</p>
          <p className="text-muted">When you place an order it will show up here.</p>
          <Link href="/products" className="btn-primary mt-2">Start shopping</Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-5">
          {orders.map((order) => (
            <li key={order.id} className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-surface-2 px-6 py-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">Order</p>
                  <p className="font-mono font-medium">{order.reference}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">Placed</p>
                  <p>{new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">Total</p>
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                </div>
                <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold">{statusLabel[order.status]}</span>
              </div>
              <OrderItemsList items={order.items} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
