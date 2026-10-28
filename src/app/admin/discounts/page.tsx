import type { Metadata } from "next";
import { requireAdminPage } from "@/server/admin";
import { getAdminDiscounts } from "@/server/admin-data";
import { formatPrice } from "@/lib/format";
import ActiveToggle from "@/components/admin/ActiveToggle";
import DiscountForm from "@/components/admin/DiscountForm";

export const metadata: Metadata = { title: "Discount codes" };

export default async function AdminDiscounts() {
  await requireAdminPage("/admin/discounts");
  const codes = await getAdminDiscounts();

  return (
    <>
      <h1 className="display text-3xl font-bold sm:text-4xl">Discount codes</h1>
      <div className="mt-6"><DiscountForm /></div>

      <ul className="card mt-6 divide-y divide-line">
        {codes.length === 0 && <li className="p-6 text-sm text-muted">No codes yet.</li>}
        {codes.map((c) => {
          const expired = c.expiresAt && c.expiresAt < new Date();
          return (
            <li key={c.id} className={`flex flex-wrap items-center gap-4 px-5 py-4 ${c.active && !expired ? "" : "opacity-60"}`}>
              <span className="w-40 font-mono font-semibold">{c.code}</span>
              <span className="flex-1 text-sm text-muted">
                {c.type === "PERCENT" ? `${c.value}% off` : `${formatPrice(c.value / 100)} off`}
                {c.minSubtotalCents > 0 && ` · min ${formatPrice(c.minSubtotalCents / 100)}`}
                {c.expiresAt && ` · ${expired ? "expired" : "expires"} ${c.expiresAt.toLocaleDateString("en-US")}`}
              </span>
              <span className="text-sm">{c.redeemedCount}{c.maxRedemptions !== null ? ` / ${c.maxRedemptions}` : ""} used</span>
              <ActiveToggle url={`/api/admin/discounts/${c.id}`} active={c.active} on="Enable" off="Disable" />
            </li>
          );
        })}
      </ul>
    </>
  );
}
