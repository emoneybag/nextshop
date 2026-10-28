import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, type Totals } from "@/lib/pricing";

export function TotalsTable({ totals }: { totals: Totals }) {
  const row = "flex justify-between text-sm";
  return (
    <dl className="space-y-3">
      <div className={row}><dt className="text-muted">Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
      {totals.discount > 0 && (
        <div className={row}><dt className="text-muted">Discount</dt><dd className="text-accent">−{formatPrice(totals.discount)}</dd></div>
      )}
      <div className={row}>
        <dt className="text-muted">Shipping</dt>
        <dd>{totals.shipping === 0 ? <span className="text-accent">Free</span> : formatPrice(totals.shipping)}</dd>
      </div>
      <div className={row}><dt className="text-muted">Estimated tax</dt><dd>{formatPrice(totals.tax)}</dd></div>
      <div className="flex justify-between border-t border-line pt-4 text-base font-semibold">
        <dt>Total</dt><dd className="display text-xl">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}

export function ShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div className="mb-6">
      <p className="mb-2 flex items-center gap-2 text-sm">
        <Truck className="size-4 text-accent" />
        {remaining === 0
          ? "You've unlocked free shipping!"
          : <>Add <strong>{formatPrice(remaining)}</strong> more for free shipping</>}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
