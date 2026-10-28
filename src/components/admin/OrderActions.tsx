"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const NEXT = { CONFIRMED: { to: "SHIPPED", label: "Mark shipped" }, SHIPPED: { to: "DELIVERED", label: "Mark delivered" } } as const;

export default function OrderActions({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const next = NEXT[status as keyof typeof NEXT];
  if (!next) return null;

  async function advance() {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next.to }),
    });
    if (!res.ok) setError((await res.json().catch(() => ({}))).error ?? "Update failed");
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={advance} disabled={busy} className="btn-ghost !px-4 !py-2">
        {busy && <Loader2 className="size-4 animate-spin" />} {next.label}
      </button>
      {error && <p role="alert" className="text-xs text-danger">{error}</p>}
    </div>
  );
}
