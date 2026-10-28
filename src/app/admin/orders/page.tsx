import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/server/admin";
import { getAdminOrders } from "@/server/admin-data";
import { formatPrice } from "@/lib/format";
import OrderActions from "@/components/admin/OrderActions";

export const metadata: Metadata = { title: "Orders" };

const FILTERS = [
  ["", "All"], ["PENDING", "Awaiting payment"], ["CONFIRMED", "To ship"], ["SHIPPED", "Shipped"], ["DELIVERED", "Delivered"], ["CANCELLED", "Cancelled"],
] as const;

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AdminOrders({ searchParams }: Props) {
  await requireAdminPage("/admin/orders");
  const { status } = await searchParams;
  const filter = FILTERS.find(([v]) => v === status)?.[0] || undefined;
  const orders = await getAdminOrders(filter as never);

  return (
    <>
      <h1 className="display text-3xl font-bold sm:text-4xl">Orders</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map(([value, label]) => (
          <Link
            key={label}
            href={value ? `/admin/orders?status=${value}` : "/admin/orders"}
            className={`rounded-full border px-4 py-1.5 text-sm ${(filter ?? "") === value ? "border-accent bg-accent font-semibold text-accent-ink" : "border-line text-muted hover:text-ink"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <ul className="mt-6 space-y-4">
        {orders.length === 0 && <li className="card p-8 text-center text-sm text-muted">No orders match.</li>}
        {orders.map((o) => (
          <li key={o.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono font-medium">{o.reference}</p>
                <p className="text-sm text-muted">{o.user.username} · {o.email}</p>
                <p className="text-xs text-muted">{o.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
              <div className="text-right">
                <p className="display text-xl font-semibold">{formatPrice(o.totalCents / 100)}</p>
                {o.discountCode && <p className="text-xs text-muted">Code {o.discountCode} (−{formatPrice(o.discountCents / 100)})</p>}
                <span className="mt-1 inline-block rounded-full border border-line px-2.5 py-0.5 text-xs">{o.status}</span>
              </div>
            </div>
            <ul className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
              {o.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4">
                  <span>{i.name} <span className="text-muted">× {i.quantity}</span></span>
                  <span>{formatPrice((i.priceCents * i.quantity) / 100)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
              <p className="text-xs leading-relaxed text-muted">
                Ship to {o.shipName}, {o.shipAddress}, {o.shipCity}{o.shipRegion ? `, ${o.shipRegion}` : ""} {o.shipPostalCode}, {o.shipCountry}
              </p>
              <OrderActions orderId={o.id} status={o.status} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
