"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const MAX_TRIES = 10;

/** Re-checks the order every few seconds while Stripe confirms the payment. */
export default function PendingRefresh() {
  const router = useRouter();
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (tries >= MAX_TRIES) return;
    const t = setTimeout(() => {
      router.refresh();
      setTries((n) => n + 1);
    }, 3000);
    return () => clearTimeout(t);
  }, [tries, router]);

  return tries < MAX_TRIES ? (
    <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
      <Loader2 className="size-4 animate-spin" /> Confirming your payment…
    </p>
  ) : (
    <p className="mt-6 text-sm text-muted">
      This is taking longer than usual. Your order will appear in your order history as soon as the
      payment clears.
    </p>
  );
}
