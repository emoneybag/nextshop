import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { OrderItem } from "@/types/order";

export default function OrderItemsList({ items }: { items: OrderItem[] }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-4 px-6 py-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
            <ProductImage src={item.image} alt="" sizes="56px" />
          </div>
          <div className="min-w-0 flex-1">
            {item.productId ? (
              <Link href={`/products/${item.productId}`} className="block truncate text-sm font-medium hover:text-accent">{item.name}</Link>
            ) : (
              <p className="truncate text-sm font-medium">{item.name}</p>
            )}
            <p className="text-xs text-muted">Qty {item.quantity} · {formatPrice(item.price)} each</p>
          </div>
          <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
        </li>
      ))}
    </ul>
  );
}
