import Link from "next/link";
import { requireAdminPage } from "@/server/admin";
import { getDashboard } from "@/server/admin-data";
import { formatPrice } from "@/lib/format";

export default async function AdminOverview() {
  await requireAdminPage();
  const d = await getDashboard();

  const stats = [
    { label: "Revenue (paid)", value: formatPrice(d.revenueCents / 100) },
    { label: "Paid orders", value: d.paidOrders },
    { label: "Waiting to ship", value: d.toShip },
    { label: "Customers", value: d.users },
    { label: "Active products", value: d.products },
    { label: "Low ratings (≤2★)", value: d.lowRated },
  ];

  return (
    <>
      <h1 className="display text-3xl font-bold sm:text-4xl">Overview</h1>
      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <dt className="text-xs uppercase tracking-wider text-muted">{s.label}</dt>
            <dd className="display mt-2 text-3xl font-bold">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="display text-xl font-semibold">Recent orders</h2>
        <Link href="/admin/orders" className="text-sm text-muted hover:text-ink">View all →</Link>
      </div>
      <div className="card mt-4 divide-y divide-line">
        {d.recent.length === 0 && <p className="p-6 text-sm text-muted">No orders yet.</p>}
        {d.recent.map((o) => (
          <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
            <span className="font-mono">{o.reference}</span>
            <span className="text-muted">{o.user.username}</span>
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs">{o.status}</span>
            <span className="font-semibold">{formatPrice(o.totalCents / 100)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
