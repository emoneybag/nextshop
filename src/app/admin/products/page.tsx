import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdminPage } from "@/server/admin";
import { getAdminProducts } from "@/server/admin-data";
import { formatPrice } from "@/lib/format";
import ActiveToggle from "@/components/admin/ActiveToggle";
import ProductImage from "@/components/ProductImage";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProducts() {
  await requireAdminPage("/admin/products");
  const products = await getAdminProducts();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="display text-3xl font-bold sm:text-4xl">Products</h1>
        <Link href="/admin/products/new" className="btn-primary"><Plus className="size-4" /> New product</Link>
      </div>
      <ul className="card mt-6 divide-y divide-line">
        {products.map((p) => (
          <li key={p.id} className={`flex flex-wrap items-center gap-4 px-5 py-4 ${p.active ? "" : "opacity-60"}`}>
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
              <ProductImage src={p.image} alt="" sizes="56px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.name}</p>
              <p className="text-xs text-muted">{p.category} · ★ {p.rating.toFixed(1)} ({p.reviews}){!p.active && " · hidden"}</p>
            </div>
            <p className="w-24 text-right font-semibold">{formatPrice(p.priceCents / 100)}</p>
            <div className="flex w-28 items-center justify-end gap-4">
              <Link href={`/admin/products/${p.id}`} className="text-sm underline-offset-4 hover:underline">Edit</Link>
              <ActiveToggle url={`/api/admin/products/${p.id}`} active={p.active} on="Show" off="Hide" />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
